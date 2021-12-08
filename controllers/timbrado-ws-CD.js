const sql = require('mssql');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

const config = require('../dbconfig');

const {
    getSecretTimbrado,
    getExpirationTimbrado
} = require('../configs/config');

const {
  getApplicationsSettings
} = require('./applications-settings');

const {
  getCustomers
} = require('./customers');

const {
  certificar,
  getCadena,
  getSello
} = require('../utils/SAT');

const {
  getGeneralParametersbyID
} = require('./cat-general-parameters');

const {
  timbrarFactura,
  obtenerPDFTimbrado
} = require('../utils/SolucionFactible');

const {
  serializeXML
} = require('../utils/xml');

const { 
  sendMail 
} = require('../utils/mail');

const {
  createPDFFromBase64
} = require('../utils/general')

async function login(req, res) {

    const data = {
        user: req.body.user,
        password: req.body.password,
        idCustomer: req.body.idCustomer,
        idApplication: req.body.idApplication,
        timbradoApplication: req.body.timbradoApplication
    }

    try {
      
      let encRes = await axios.post('http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5', {text: data.password});
  
      let encryptedPassword = encRes.data;

      const pool = await sql.connect(config);

      const userLogin = await pool.request()
        .input('pvOptionCRUD', sql.VarChar, 'VA')
        .input('piIdCustomer', sql.Int, data.idCustomer)
        .input('pIdApplication', sql.SmallInt, data.idApplication)
        .input('pvIdUser', sql.VarChar, data.user)
        .input('pvPassword', sql.VarChar, encryptedPassword)
        .execute('spCustomer_Application_Users_CRUD_Records');

      if(userLogin.recordset[0].Code_Type === 'Error')
      {
        const response = {
          error: {
            code: userLogin.recordsets[0][0].Code,
            idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
            message: userLogin.recordsets[0][0].Code_Message_User
          }
        }
        //const response = [regreso]

        res.status(401).json(response);

      } else {

        let expiration = await getExpirationTimbrado();

        let secret = await getSecretTimbrado();

        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + parseInt(expiration, 10)); // 1 día antes de expirar
        const token = jwt.sign({
          userName:             data.user,
          idCustomer:           data.idCustomer,
          idApplication:        data.idApplication,
          timbradoApplication:  data.timbradoApplication,
          exp:                  parseInt(exp.getTime() / 1000)
        }, secret);

        const response = {
            data: {
                message: userLogin.recordsets[0][0].Code_Message_User,
                token: token,
                exp: exp
            }
          }

        res.json(response);

      }

      pool.close();
      
  } catch (error) {

      console.log(error);
      
  }
    
}   

async function getClientSettings(req, res, next){

  const decode        = jwt.decode(req.headers.authorization.split(' ')[1]);
  const idApplication = decode.idApplication;
  const idCustomer    = decode.idCustomer;

  try {

    const appConfig = await getApplicationsSettings( { pvOptionCRUD: 'R', piIdCustomer: idCustomer, piIdApplication: idApplication } );
  
    let rootFolder = appConfig[0].filter( (data) => {
      
      return data.Settings_Key === 'RootPath';
  
    });
  
    let pendingFolder = appConfig[0].filter( (data) => {
      
      return data.Settings_Key === 'PendingFilesPath';
  
    });
  
    let processedFolder = appConfig[0].filter( (data) => {
      
      return data.Settings_Key === 'ProcessedFilesPath';
  
    });
  
    let xmlsFolder = appConfig[0].filter( (data) => {
      
      return data.Settings_Key === 'XMLPath';
  
    });
  
    let pdfsFolder = appConfig[0].filter( (data) => {
      
      return data.Settings_Key === 'PDFPath';
  
    });
  
    let errorsFolder = appConfig[0].filter( (data) => {
      
      return data.Settings_Key === 'ErrorsPath';
  
    });
  
    rootFolder              = rootFolder[0].Settings_Value;
    pendingFolder           = pendingFolder[0].Settings_Value;
    processedFolder         = processedFolder[0].Settings_Value;
    xmlsFolder              = xmlsFolder[0].Settings_Value;
    pdfsFolder              = pdfsFolder[0].Settings_Value;
    errorsFolder            = errorsFolder[0].Settings_Value;
  
    const response = {
      data: {
        rootFolder:           rootFolder,
        pendingFolder:        pendingFolder,
        processedFolder:      processedFolder,
        xmlsFolder:           xmlsFolder,
        pdfsFolder:           pdfsFolder,
        errorsFolder:         errorsFolder
      }
    }
  
    res.json( response );

  } catch (error) {

    const errorResponse = {
      error: {
        message: 'No se pudieron recuperar los datos de configuración de la aplicación.'
      }
    }

    res.json( errorResponse );

  }

}

async function timbrar(req, res){

  /* Retrieve General Configuration */
  const decode        = jwt.decode(req.headers.authorization.split(' ')[1]);
  const idApplication = decode.timbradoApplication;
  
  let tempPath        = await getGeneralParametersbyID( { pvOptionCRUD: 'R', piIdParameter: 20 } );
  tempPath = tempPath[0][0].Value;
  
  /*
      cfdis is the Array which will have the API Response, having an Array with a response for each
      xml received in the body request
  */
  

  /* Retrieve data to process */
  const xmls = req.body.XMLs;

  /******  Aquí debe iniciar a barrer cada XML recibido en el Array ******/

  const cfdis = await procesarXMLs( xmls, idApplication, tempPath );

  res.json( { data: cfdis } );

}

async function procesarXMLs(xmls, idApplication, tempPath) {

  let cfdis                   = [];
  let mailAttachments         = [];

  for(let i = 0; i < xmls.length; i++){

    const fileName        = xmls[i].fileName;
  
    /* Serialize received Base 64 XML */

    let xmlDoc = await serializeXML( xmls[i].xmlBase64 );

    /* Retrieve Addenda Data to resolve Email To */

    const emailTo = xmlDoc.getElementsByTagName('cfdi:Addenda')[0].getElementsByTagName('DatosAdicionales')[0].getAttribute('EMAIL');
  
    /* Retrieve RFCEmisor to resolve Id Customer for Timbrado Configuration */
  
    const rfcEmisor = xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Rfc');
  
    let idCustomer = await getCustomers( { pvOptionCRUD: 'R' } );
  
    idCustomer = idCustomer[0].filter( (customer) => {
  
      return customer.Tax_Id === rfcEmisor;
  
    });
  
    idCustomer = idCustomer[0].Id_Customer;
  
    /* Recuperar datos de configuración del Portal GTC */
  
    const appConfig = await getApplicationsSettings( { pvOptionCRUD: 'R', piIdCustomer: idCustomer, piIdApplication: idApplication } );
  
    let cerFilePath = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'CerFile';
  
    });
  
    let keyFilePath = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'KeyFile';
  
    });
  
    let keyPassword = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'KeyPassword';
  
    });
  
    let urlWS = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'TimbradoWSURL';
  
    });
  
    let urlPDF = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'PDFWSURL';
  
    });
  
    let wsUser = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'TimbradoWSUser';
  
    });
  
    let wsPassword = appConfig[0].filter( (data) => {
  
      return data.Settings_Key === 'TimbradoWSPassword';
  
    });
  
    cerFilePath   = cerFilePath[0].Settings_Value;
    keyFilePath   = keyFilePath[0].Settings_Value;
    keyPassword   = keyPassword[0].Settings_Value;
    urlWS         = urlWS[0].Settings_Value;
    urlPDF        = urlPDF[0].Settings_Value;
    wsUser        = wsUser[0].Settings_Value;
    wsPassword    = wsPassword[0].Settings_Value;
  
    /* Obtener Certificado y NoCertificado */
  
    const serialNumber = certificar(cerFilePath);
  
    const cer = fs.readFileSync(cerFilePath, 'base64');
  
    /* Certificar Factura */
  
    xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('NoCertificado', serialNumber);
  
    xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Certificado', cer);
  
    /* Generar XML Certificado */
  
    let stringXML = new XMLSerializer().serializeToString(xmlDoc);
  
    fs.writeFileSync(`${tempPath}${fileName}`, stringXML);
  
    /* Sellar XML */
  
    const cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `${tempPath}${fileName}`);
  
    const prm = await getSello(keyFilePath, keyPassword);
  
    const sign = crypto.createSign('RSA-SHA256');
  
    sign.update(cadena);
  
    const sello = sign.sign(prm, 'base64');
  
    xml = fs.readFileSync(`${tempPath}${fileName}`, 'utf8');
  
    xmlDoc = new DOMParser().parseFromString(xml);//
  
    xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Sello', sello);
  
    stringXML = new XMLSerializer().serializeToString(xmlDoc);
  
    fs.unlinkSync(`${tempPath}${fileName}`);
  
    fs.writeFileSync(`${tempPath}${fileName}`, stringXML);
  
    /* Convertir a Base 64 y timbrar */
  
    xml = fs.readFileSync(`${tempPath}${fileName}`, 'utf8');
  
    const xmlBase64 = Buffer.from(xml).toString('base64');
  
    const timbradoResponse = await timbrarFactura(xmlBase64, urlWS, wsUser, wsPassword, fileName);
  
    fs.unlinkSync(`${tempPath}${fileName}`);
  
    /* Regresar respuesta */
  
    if(timbradoResponse.status === 200){
  
      let cfdiData = {
        file: fileName,
        cfdi: {
          status: timbradoResponse.status,
          message: timbradoResponse.message,
          uuid: timbradoResponse.uuid,
          cfdiTimbrado: timbradoResponse.cfdiTimbrado
        }
      }
      
      let buff = Buffer.from( timbradoResponse.cfdiTimbrado, 'base64' );
      let xmlToSend = buff.toString('utf-8');

      fs.writeFileSync( `${tempPath}${fileName}`, xmlToSend );

      mailAttachments[0] = {
        path: `${tempPath}${fileName}`,
        filename: fileName
      }

      const pdfResponse = await obtenerPDFTimbrado(urlPDF, timbradoResponse.uuid, wsUser, wsPassword);
  
      if(pdfResponse.status === 200) {
        
        cfdiData.pdf = {
          status: pdfResponse.status,
          message: pdfResponse.mensaje,
          pdf: pdfResponse.pdf
        }

        await createPDFFromBase64 ( `${ tempPath }${ path.basename( fileName, '.xml' ) }.pdf`, pdfResponse.pdf );

        //fs.writeFileSync( `${ tempPath }${ path.basename( fileName, '.xml' ) }.pdf` , pdfResponse.pdf);

        mailAttachments[1] = {
          path: `${ tempPath }${ path.basename( fileName, '.xml' ) }.pdf`,
          filename: `${path.basename( fileName, '.xml' )}.pdf`
        }
  
      } else {
  
        cfdiData.pdf = {
          error: {
            status: pdfResponse.status,
            message: pdfResponse.mensaje,
            pdf: pdfResponse.pdf
          }
        }
  
      }
  
      cfdis = [...cfdis, cfdiData];

      await sendMail( emailTo, mailAttachments, idCustomer, idApplication );

      /* Revisar si no se generó el pdf puede tronar */
      fs.unlinkSync(`${ tempPath }${ fileName }`);
      fs.unlinkSync(`${ tempPath }${ path.basename( fileName, '.xml' ) }.pdf`);
  
    } else {
  
      let cfdiData = {
        file: fileName,
        cfdi: {
          error: {
            status: timbradoResponse.status,
            message: timbradoResponse.mensaje,
            uuid: timbradoResponse.uuid,
            cfdiTimbrado: timbradoResponse.cfdiTimbrado
          }
        }
      }
  
      cfdis = [...cfdis, cfdiData];
  
    }

  }

  return cfdis;

}

module.exports = {
    login,
    timbrar,
    getClientSettings
}