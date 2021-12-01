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
  certificar,
  getCadena,
  getSello
} = require('../utils/SAT');
const {
  getTemporalFileName
} = require('../utils/general');
const {
  timbrarFactura,
  obtenerPDFTimbrado
} = require('../utils/SolucionFactible');

async function login(req, res) {

    //console.log('Entró');

    const data = {
        user: req.body.user,
        password: req.body.password,
        idCustomer: req.body.idCustomer,
        idApplication: req.body.idApplication
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
          userName:       data.user,
          idCustomer:     data.idCustomer,
          idApplication:  data.idApplication,
          exp:            parseInt(exp.getTime() / 1000),
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

  const decode = jwt.decode(req.headers.authorization.split(' ')[1]);
  const fileName = getTemporalFileName();

  /* Recuperar datos de configuración del Portal GTC */

  const idCustomer      = decode.idCustomer;
  const idApplication   = decode.idApplication;

  const appConfig = await getApplicationsSettings( { pvOptionCRUD: 'R', piIdCustomer: idCustomer, piIdApplication: idApplication } );

  let cerFilePath = appConfig[0].filter((data) => {

    return data.Settings_Key === 'CerFile';

  });

  let keyFilePath = appConfig[0].filter((data) => {

    return data.Settings_Key === 'KeyFile';

  });

  let keyPassword = appConfig[0].filter((data) => {

    return data.Settings_Key === 'KeyPassword';

  });

  let urlWS = appConfig[0].filter((data) => {

    return data.Settings_Key === 'TimbradoWSURL';

  });

  let urlPDF = appConfig[0].filter((data) => {

    return data.Settings_Key === 'PDFWSURL';

  });

  let wsUser = appConfig[0].filter((data) => {

    return data.Settings_Key === 'TimbradoWSUser';

  });

  let wsPassword = appConfig[0].filter((data) => {

    return data.Settings_Key === 'TimbradoWSPassword';

  });

  cerFilePath   = cerFilePath[0].Settings_Value;
  keyFilePath   = keyFilePath[0].Settings_Value;
  keyPassword   = keyPassword[0].Settings_Value;
  urlWS         = urlWS[0].Settings_Value;
  urlPDF        = urlPDF[0].Settings_Value;
  wsUser        = wsUser[0].Settings_Value;
  wsPassword    = wsPassword[0].Settings_Value;

  /* Serializar XML recibido en Base 64 */

  const data = {
    xmlBase64: req.body.xmlBase64
  }

  let buff = Buffer.from(data.xmlBase64, 'base64');
  let xml = buff.toString('utf-8');

  let xmlDoc = new DOMParser().parseFromString(xml);

  /* Obtener Certificado y NoCertificado */

  const serialNumber = certificar(cerFilePath);

  const cer = fs.readFileSync(cerFilePath, 'base64');

  /* Certificar Factura */

  xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('NoCertificado', serialNumber);

  xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Certificado', cer);

  /* Generar XML Certificado */

  let stringXML = new XMLSerializer().serializeToString(xmlDoc);

  fs.writeFileSync(`./Temp/${fileName}.xml`, stringXML);

  /* Sellar XML */

  const cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `./Temp/${fileName}.xml`);

  const prm = await getSello(keyFilePath, keyPassword);

  const sign = crypto.createSign('RSA-SHA256');

  sign.update(cadena);

  const sello = sign.sign(prm, 'base64');

  xml = fs.readFileSync(`./Temp/${fileName}.xml`, 'utf8');

  xmlDoc = new DOMParser().parseFromString(xml);

  xmlDoc.getElementsByTagName('cfdi:Comprobante')[0].setAttribute('Sello', sello);

  stringXML = new XMLSerializer().serializeToString(xmlDoc);

  fs.unlinkSync(`./Temp/${fileName}.xml`);

  fs.writeFileSync(`./Temp/${fileName}.xml`, stringXML);

  /* Convertir a Base 64 y timbrar */

  xml = fs.readFileSync(`./Temp/${fileName}.xml`, 'utf8');

  const xmlBase64 = Buffer.from(xml).toString('base64');

  const timbradoResponse = await timbrarFactura(xmlBase64, urlWS, wsUser, wsPassword, fileName);

  fs.unlinkSync(`./Temp/${fileName}.xml`);

  let response = {
    status: null
  }

  /* Regresar respuesta */

  if(timbradoResponse.status === 200){

    response.status = timbradoResponse.status

    response.cfdiData = {
      uuid: timbradoResponse.uuid,
      cfdiTimbrado: timbradoResponse.cfdiTimbrado
    }

    const pdfResponse = await obtenerPDFTimbrado(urlPDF, timbradoResponse.uuid, wsUser, wsPassword);

    console.log('PDF Responde fuera: ', pdfResponse);

    if(pdfResponse.status === 200) {
      
      response.pdfData = {
        pdfBase64: pdfResponse.pdf
      }

    } else {

      response.pdfError = {
        mensaje: pdfResponse.mensaje
      }

    }

    res.json({ response });

  } else {

    response.status = timbradoResponse.status

    response.error = {
      mensaje: timbradoResponse.mensaje
    }

    res.json({ response });

  }

}

module.exports = {
    login,
    timbrar
}