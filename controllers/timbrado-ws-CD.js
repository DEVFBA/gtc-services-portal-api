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

async function login(req, res) {

    //console.log('Entró');

    const data = {
        user: req.body.user,
        password: req.body.password,
        idCustomer: req.body.idCustomer,
        idApplication: req.body.idApplication,
        timbradoApplication: req.body.timbradoApplication
    }

    //console.log('REQ: ', req.body)

    //console.log('Body: ', body);

    let encRes = await axios.post('http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5', {text: data.password});

    let encryptedPassword = encRes.data;

    //console.log('Encrypted Password', encryptedPassword);

    try {

      const pool = await sql.connect(config);

      const userLogin = await pool.request()
        .input('pvOptionCRUD', sql.VarChar, 'VA')
        .input('piIdCustomer', sql.Int, data.idCustomer)
        .input('pIdApplication', sql.SmallInt, data.idApplication)
        .input('pvIdUser', sql.VarChar, data.user)
        .input('pvPassword', sql.VarChar, encryptedPassword)
        .execute('spCustomer_Application_Users_CRUD_Records');

        //console.log('En Login: ', userLogin.recordset[0]);

      if(userLogin.recordset[0].Code_Type === 'Error')
      {
        const response = {
          error: {
            code: userLogin.recordsets[0][0].Code,
            idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
            mensaje: userLogin.recordsets[0][0].Code_Message_User
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
                mensaje: userLogin.recordsets[0][0].Code_Message_User,
                token: token
            }
          }

        //console.log(expiration);

        res.json(response);

      }

      pool.close();

      //console.log(JSON.stringify('Respuesta', userLogin.recordsets[0][0]));
      
  } catch (error) {

      console.log(error);
      
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

  //console.log("XMLS Array: ", xmls);

  /******  Aquí debe iniciar a barrer cada XML recibido en el Array ******/

  const cfdis = await procesarXMLs(xmls, idApplication, tempPath);

  console.log('CFDIS: ', cfdis);

  res.json( cfdis );

}

async function procesarXMLs(xmls, idApplication, tempPath) {

  let cfdis = [];

    for(let i = 0; i < xmls.length; i++){

      const fileName        = xmls[i].fileName;
  
  
      //console.log(fileName);
    
      /* Serialize received Base 64 XML */
    
      //let xmlDoc = await serializeXML(xmls[0].xmlBase64);
      let xmlDoc = await serializeXML(xmls[i].xmlBase64);
    
      /* Retrieve RFCEmisor to resolve Id Customer for Timbrado Configuration */
    
      const rfcEmisor = xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Rfc');
    
      //console.log('RFC Emisor: ', rfcEmisor);
    
      let idCustomer = await getCustomers( { pvOptionCRUD: 'R' } );
    
      idCustomer = idCustomer[0].filter( (customer) => {
    
        return customer.Tax_Id === rfcEmisor;
    
      });
    
      idCustomer = idCustomer[0].Id_Customer;
    
      //console.log('Customers: ', idCustomer);
    
      //const idApplication = decode.timbradoApplication;
    
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
    
      //console.log('Cer Path: ', cerFilePath);
    
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
    
      xmlDoc = new DOMParser().parseFromString(xml);
    
      xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Sello', sello);
    
      stringXML = new XMLSerializer().serializeToString(xmlDoc);
    
      fs.unlinkSync(`${tempPath}${fileName}`);
    
      fs.writeFileSync(`${tempPath}${fileName}`, stringXML);
    
      /* Convertir a Base 64 y timbrar */
    
      xml = fs.readFileSync(`${tempPath}${fileName}`, 'utf8');
    
      const xmlBase64 = Buffer.from(xml).toString('base64');
  
      //console.log('Aquí: ', xmlBase64, fileName);
    
      const timbradoResponse = await timbrarFactura(xmlBase64, urlWS, wsUser, wsPassword, fileName);
    
      fs.unlinkSync(`${tempPath}${fileName}`);
    
      //console.log(fileName);
    
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
    
        //cfdi.status = timbradoResponse.status
    /* 
        cfdi.cfdiData = {
          uuid: timbradoResponse.uuid,
          cfdiTimbrado: timbradoResponse.cfdiTimbrado
        } */
    
        const pdfResponse = await obtenerPDFTimbrado(urlPDF, timbradoResponse.uuid, wsUser, wsPassword);
    
        //console.log('PDF Responde fuera: ', pdfResponse);
    
        if(pdfResponse.status === 200) {
          
          cfdiData.pdf = {
            status: pdfResponse.status,
            message: pdfResponse.mensaje,
            pdf: pdfResponse.pdf
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
        //return cfdiData;
        //res.json({ cfdi });
    
      } else {
    
        //console.log(fileName);
    
        //console.log(timbradoResponse);
    
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
  
        //console.log(cfdiData);
        
        //console.log(cfdis);
    
        //console.log(cfdiData);
    
        cfdis = [...cfdis, cfdiData];
        
        //console.log(cfdis);
        //return cfdiData;
    
        //console.log('cfdis: ', cfdis);
    
    /*     cfdi.status = timbradoResponse.status
    
        cfdi.error = {
          mensaje: timbradoResponse.mensaje
        } */
    
        //res.json({ cfdi });
    
      }
  
      //return cfdis;

    }

    //console.log('Por Procesar: ', xml);

    //const fileName      = xmls[0].fileName;

  console.log('CFDIS 1: ', cfdis);

  return cfdis;

}

module.exports = {
    login,
    timbrar
}