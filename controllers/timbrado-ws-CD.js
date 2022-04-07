const sql = require('mssql');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const crypto = require('crypto');
const logger = require('../utils/logger');
const path = require('path');

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
  getCustomers,
  getFullAddress,
  getCustomerName
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
  timbrarFactura
} = require('../utils/SolucionFactible');

const {
  serializeXML
} = require('../utils/xml');

const {
  getPDFCasaDiaz
} = require('../utils/PdfCasaDiaz');

let cfdis                   = [];

let cfdiData = new Object ({
  error: 0,
  message: '',
  timbrado: {
    file: '',
    serie: '',
    folio: '',
    statusCFDI: 0,
    uuid: '',
    cfdiTimbrado: '',
    statusPDF: 0,
    pdf: '',
    emailTo: ''
  }
});

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

    logger.error(error + '/timbrado-ws-CD/login - POST -')
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
    logger.error(error + '/timbrado-ws-CD/get-client-settings - GET -')
    const errorResponse = {
      error: {
        message: 'No se pudieron recuperar los datos de configuración de la aplicación.'
      }
    }

    res.json( errorResponse );

  }

}

async function timbrar(req, res){

  logger.info('Body timbrar: ' + JSON.stringify(req.body));

  cfdis = [];

  /* Retrieve General Configuration */

  const decode        = jwt.decode(req.headers.authorization.split(' ')[1]);
  const idApplication = decode.timbradoApplication;
  
  let tempPath        = await getGeneralParametersbyID( { pvOptionCRUD: 'R', piIdParameter: 20 } );
  tempPath = tempPath[0][0].Value;
  
  /*
      data is the Array which will have the API Response, having an Array with a response for each
      xml received in the body request
  */

  /* Retrieve data to process */

  if ( Object.entries(req.body).length === 0 ) { // If body is empty

    cfdiData.error = 1;
    cfdiData.message = 'Request Body incorrecto - Se está enviando vacío el Body del Request';

    cfdis = [...cfdis, cfdiData];

    res.json( { data: cfdis } );
    
  } else if( !req.body.xmls || req.body.xmls.length === 0 ){ // If xmls Array is empty or null

    cfdiData.error = 1;
    cfdiData.message = 'Request Body incorrecto - Se está enviando el array xmls vacío o no se está enviando correctamente';

    cfdis = [...cfdis, cfdiData];

    res.json( { data: cfdis } );

  } else {

    const xmls = req.body.xmls;
  
    const cfdis = await procesarXMLs( xmls, idApplication, tempPath );
  
    res.json( { data: cfdis } );
    
  }

}

async function procesarXMLs(xmls, idApplication, tempPath) {

  try {
    
    for(let i = 0; i < xmls.length; i++){

      cfdiData = new Object ({
        error: 0,
        message: '',
        timbrado: {
          file: '',
          serie: '',
          folio: '',
          statusCFDI: 0,
          uuid: '',
          cfdiTimbrado: '',
          statusPDF: 0,
          pdf: '',
          emailTo: '',
          JDEtable: '',
          rfcEmisor: ''
        }
      });

      let JDETable = null;

      if ( !xmls[i].fileName || xmls[i].fileName === '' ) { // If fileName is empty or null

        cfdiData.error = 1;
        cfdiData.message = 'Request Body incorrecto - Se está enviando el atributo fileName de xmls vacío, o no se está enviando correctamente';
    
        cfdis = [...cfdis, cfdiData];

        continue;
        
      } else if( !xmls[i].xmlBase64 || xmls[i].xmlBase64 === '' ) { // If xmlBase64 is empty or null

        cfdiData.error = 1;
        cfdiData.message = 'Request Body incorrecto - Se está enviando el atributo xmlBase64 de xmls vacío, o no se está enviando correctamente';
    
        cfdis = [...cfdis, cfdiData];

        continue;

      } else {
        
        const fileName        = xmls[i].fileName;
        let rfcEmisor         = '';
      
        /* Serialize received Base 64 XML */
    
        let xmlDoc = await serializeXML( xmls[i].xmlBase64 );
    
        /* Retrieve Serie and Folio for Response */

        let serie = '';
        let folio = '';

        if( !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0] || !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie') ) {

          serie = '';

        } else {

          serie = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Serie');

        }

        if( !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0] || !xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio') ) {

          folio = '';

        } else {

          folio = xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].getAttribute('Folio');

        }
      
        /* Retrieve RFCEmisor to resolve Id Customer for Timbrado Configuration */

        if( !xmlDoc.getElementsByTagName('cfdi:Emisor')[0] || !xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Rfc')) {

          cfdiData.error                    = 1;
          cfdiData.message                  = 'XML Incorrecto - El XML no contiene el dato del CFDI RFC Emisor';
          cfdiData.timbrado.file            = path.basename(fileName, '.xml');
      
          cfdis = [...cfdis, cfdiData];
  
          continue;

        } else {

          rfcEmisor = xmlDoc.getElementsByTagName('cfdi:Emisor')[0].getAttribute('Rfc');

        }
      
        let idCustomer = await getCustomers( { pvOptionCRUD: 'R' } );
      
        idCustomer = idCustomer[0].filter( (customer) => {
      
          return customer.Tax_Id === rfcEmisor;
      
        });
      
        idCustomer = idCustomer[0].Id_Customer;

        /**
         * * Determine JDE Table of the Receipt
         */
        if( !xmlDoc.getElementsByTagName('cartaporte20:CartaPorte')[0] ) {

          JDETable = 'F55XTRC';

        } else {

          JDETable = 'F59TR01';

        }

        /* Retrieve Customer Data */

        const address           = await getFullAddress(idCustomer);
        const businessName      = await getCustomerName(idCustomer);
      
        /* Retrieve Portal GTC Configuration for Timbrado by Customer RFC */
      
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

        let defaultEmail = appConfig[0].filter( (data) => {
      
          return data.Settings_Key === 'DefaultEmail';
      
        });

        let deleteAddenda = appConfig[0].filter( (data) => {
      
          return data.Settings_Key === 'DeleteAddenda';
      
        });

        let pdfLogo = appConfig[0].filter( (data) => {
      
          return data.Settings_Key === 'PDFLogo';
      
        });
      
        cerFilePath                 = cerFilePath[0].Settings_Value;
        keyFilePath                 = keyFilePath[0].Settings_Value;
        keyPassword                 = keyPassword[0].Settings_Value;
        urlWS                       = urlWS[0].Settings_Value;
        urlPDF                      = urlPDF[0].Settings_Value;
        wsUser                      = wsUser[0].Settings_Value;
        wsPassword                  = wsPassword[0].Settings_Value;
        defaultEmail                = defaultEmail[0].Settings_Value;
        deleteAddenda               = deleteAddenda[0].Settings_Value;
        pdfLogo                     = pdfLogo[0].Settings_Value;

        /* 

          Retrieve Addenda Data to resolve Email To
          If there's no Addenda Tag, it will default eMailTo attribute to DefaultEmail Setting Value in Portal GTC

          DeleteAddenda Configuration will define if this Tag will be deleted or not

        */

        let emailTo = '';

        if( !xmlDoc.getElementsByTagName('cfdi:Addenda')[0] || !xmlDoc.getElementsByTagName('DatosAdicionales')[0] || !xmlDoc.getElementsByTagName('cfdi:Addenda')[0].getElementsByTagName('DatosAdicionales')[0].getAttribute('EMAIL') ) {

          emailTo = defaultEmail;

        } else {

          emailTo = xmlDoc.getElementsByTagName('cfdi:Addenda')[0].getElementsByTagName('DatosAdicionales')[0].getAttribute('EMAIL');

          if( parseInt(deleteAddenda) ){

            const addenda = xmlDoc.getElementsByTagName('cfdi:Addenda')[0];

            addenda.parentNode.removeChild(addenda);

          }

        }
      
        /* Get Certificado y NoCertificado */
      
        const serialNumber = certificar(cerFilePath);
      
        const cer = fs.readFileSync(cerFilePath, 'base64');
      
        /* Certificate Invoice */
      
        xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('NoCertificado', serialNumber);
      
        xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Certificado', cer);
      
        /* Generate Certificated Invoice XML */
      
        let stringXML = new XMLSerializer().serializeToString(xmlDoc);
      
        fs.writeFileSync(`${tempPath}${fileName}`, stringXML);
      
        /* Seal XML */
      
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
      
        /* Get Base 64 and Stamp */
      
        xml = fs.readFileSync(`${tempPath}${fileName}`, 'utf8');
      
        const xmlBase64 = Buffer.from(xml).toString('base64');
      
        const timbradoResponse = await timbrarFactura(xmlBase64, urlWS, wsUser, wsPassword);
      
        fs.unlinkSync(`${tempPath}${fileName}`);
      
        /* Get Response */
      
        if( timbradoResponse.status === 200 ){

          cfdiData.timbrado.file            = path.basename(fileName, '.xml');
          cfdiData.timbrado.statusCFDI      = timbradoResponse.status;
          cfdiData.timbrado.uuid            = timbradoResponse.uuid;
          cfdiData.timbrado.cfdiTimbrado    = timbradoResponse.cfdiTimbrado;
          cfdiData.timbrado.serie           = serie;
          cfdiData.timbrado.folio           = folio;
          cfdiData.timbrado.emailTo         = emailTo;
          cfdiData.timbrado.JDEtable        = JDETable;
          cfdiData.timbrado.rfcEmisor       = rfcEmisor;

          const base64 = await getPDFCasaDiaz( timbradoResponse.cfdiTimbrado, pdfLogo, timbradoResponse.uuid, address, businessName );

          if( base64 ) {
    
            cfdiData.timbrado.statusPDF   = 200;
            cfdiData.timbrado.pdf         = base64;
      
          } else {
    
            cfdiData.error                = 2;
            cfdiData.message              = 'No se pudo generar el PDF';
            cfdiData.timbrado.statusPDF   = 500;
      
          }
      
          cfdis = [...cfdis, cfdiData];
      
        } else {
    
          cfdiData.error                    = 1;
          cfdiData.message                  = timbradoResponse.mensaje;
          cfdiData.timbrado.file            = path.basename(fileName, '.xml');
          cfdiData.timbrado.statusCFDI      = timbradoResponse.status;
      
          cfdis = [...cfdis, cfdiData];
      
        }

      }

    }
  
    return cfdis;

  } catch (error) {

    logger.error(error + '/timbrado-ws-CD/timbrado - POST -')
    cfdiData.error          = 1;
    cfdiData.message        = error;

    return cfdis;

  }

}

module.exports = {
    login,
    timbrar,
    getClientSettings
}