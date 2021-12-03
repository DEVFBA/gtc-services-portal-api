const { DOMParser, XMLSerializer } = require('@xmldom/xmldom');

async function serializeXML(xmlBase64) {

    //console.log('XML Base 64: ', xmlBase64);

    const buff = Buffer.from(xmlBase64, 'base64');
    const xml = buff.toString('utf-8');
  
    const xmlDoc = new DOMParser().parseFromString(xml);

    return xmlDoc;

}

module.exports = {
    serializeXML
}