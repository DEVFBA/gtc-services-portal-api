const xsltproc = require('node-xsltproc');
const xmljson = require('xml-js');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const forge = require('node-forge');
const pki = forge.pki;
const openssl = require('../utils/openssl.js');

const logger = require('../utils/logger');

//const { Config } = require('../config.js');

const certificar = (certificado) => {

  try {

    logger.info('Obteniendo Certificado...');
    
    const cer = fs.readFileSync(certificado, 'base64');
    const pem = '-----BEGIN CERTIFICATE-----\n' + cer + '\n-----END CERTIFICATE-----';
    const serialNumber = pki
    .certificateFromPem(pem)
    .serialNumber.match(/.{1,2}/g)
    .map(function(v) {
      return String.fromCharCode(parseInt(v, 16));
    })
    .join('');

    logger.info('Obtención de Certificado Exitosa.');
  
    return serialNumber;

  } catch (error) {

    console.log('ERROR: Error al Certificar: ', error);
    logger.error('ERROR: Error al Certificar: ' + JSON.stringify(error));

    return false;

  }


  }

async function getCadena(stylesheetDir, originXML) {

    logger.info('Obteniendo cadena 3.3...');

    const libxmlDir = path.join(path.resolve(__dirname, '../'), 'lib', 'win','libxml');

    try {

      const cadena = await xsltproc({xsltproc_path: libxmlDir}).transform([stylesheetDir, originXML]);

      logger.info('Cadena obtenida con éxito.');

      return cadena.result;

    } catch(error){

      console.log('Error en Get Cadena: ', error);
      logger.error('ERROR: Error al obtener cadena: ' + JSON.stringify(error));

      return error;

    }

}

async function getCadena40(stylesheetDir, originXML) {

  logger.info('Obteniendo cadena 4.0...');

  const libxmlDir = path.join(path.resolve(__dirname, '../'), 'lib', 'win','libxml');

  try {

    const cadena = await xsltproc({xsltproc_path: libxmlDir}).transform([stylesheetDir, originXML]);

    logger.info('Cadena obtenida con éxito.');

    return cadena.result;
    
  } catch (error) {

    console.log('Error en getCadena40: ', error);
    logger.error('Error en getCadena40: ' + error);
    
  }

}

async function getSello(keyFile, password) {

  logger.info('Obteniendo Sello...');

  const openssl_path = path.join(path.resolve(__dirname, '../'), 'lib', 'win','openssl');

  try {
    const prm = await openssl.decryptPKCS8PrivateKey({
                                      openssl_path: openssl_path,
                                      in: keyFile,
                                      pass: password
                                    }
                                    );

    logger.info('Sello generado con éxito.');

    return prm;

  } catch (error) {

    console.log('Error en Get Sello: ', error);
    logger.error('ERROR: Error al obtener el Sello: ' + JSON.stringify(error));

    return error;

  }

}

async function sellarFactura(){

  const cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `./${fileName}.xml`);
  
}

async function sellar(JSONInvoice, fileName) {

  const cadena = await getCadena('./resources/XSLT/cadenaoriginal_3_3.xslt', `./${fileName}.xml`);

  const prm = await getSello(Config.keyFile, Config.keyPassword);

  const sign = crypto.createSign('RSA-SHA256');

  sign.update(cadena);

  const sello = sign.sign(prm, 'base64');

  JSONInvoice.elements[0].attributes.Sello = sello;

  let XMLInvoiceSellado = xmljson.js2xml(JSONInvoice, 'utf-8');

  XMLInvoiceSellado = XMLInvoiceSellado.replace(/&/g, '&amp;'); // Reemplazar caracteres raros

  fs.writeFileSync(`./${fileName}_sellado.xml`, XMLInvoiceSellado);

  /* Delete TempFiles */

  fs.unlinkSync(`./${fileName}.xml`);

}

async function getBase64XML (JSONInvoice, tempFileName) {

  await sellar(JSONInvoice, tempFileName);

  const xml = fs.readFileSync(`./${tempFileName}_sellado.xml`, 'utf-8');

  const xmlBase64 = Buffer.from(xml).toString('base64');

  fs.writeFileSync(`./${tempFileName}_base64.txt`, xmlBase64);

  fs.unlinkSync(`./${tempFileName}_sellado.xml`);

}

module.exports = {
    certificar,
    getCadena,
    getSello,
    sellar,
    getBase64XML,
    sellarFactura,
    getCadena40
}