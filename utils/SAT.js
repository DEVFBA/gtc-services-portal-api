const xsltproc = require('node-xsltproc');
const xmljson = require('xml-js');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const forge = require('node-forge');
const pki = forge.pki;
const openssl = require('../utils/openssl.js');

//const { Config } = require('../config.js');

const certificar = (certificado) => {

    const cer = fs.readFileSync(certificado, 'base64');
    const pem = '-----BEGIN CERTIFICATE-----\n' + cer + '\n-----END CERTIFICATE-----';
    const serialNumber = pki
    .certificateFromPem(pem)
    .serialNumber.match(/.{1,2}/g)
    .map(function(v) {
      return String.fromCharCode(parseInt(v, 16));
    })
    .join('');

    return serialNumber;

  }

async function getCadena(stylesheetDir, originXML) {

    const libxmlDir = path.join(path.resolve(__dirname, '../'), 'lib', 'win','libxml');

    try {

      //fs.writeFileSync(path.resolve(Config.files.logs, 'getCadena.txt'), 'Entra a generar Cadena');

      const cadena = await xsltproc({xsltproc_path: libxmlDir}).transform([stylesheetDir, originXML]);

      //fs.writeFileSync(path.resolve(Config.files.logs, 'Cadena.txt'), cadena);

      return cadena.result;

    } catch(error){

      fs.writeFileSync(path.resolve(Config.files.logs, 'Error.txt'), error);

    }

}

async function getSello(keyFile, password) {

  //fs.writeFileSync(path.resolve(Config.files.logs, 'getSello.txt'), 'Entra al sello');

  const openssl_path = path.join(path.resolve(__dirname, '../'), 'lib', 'win','openssl');

  try {
    const prm = await openssl.decryptPKCS8PrivateKey({
                                      openssl_path: openssl_path,
                                      in: keyFile,
                                      pass: password
                                    }
                                    );

    return prm;

  } catch (error) {

    console.log(error);
    fs.writeFileSync(path.resolve(Config.files.errors, 'errors.txt'), error);

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
    sellarFactura
}