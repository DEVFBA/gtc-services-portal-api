const pdf2base64 = require('pdf-to-base64');

const fs = require('fs');

async function pdfToBase64(pdfFile){

    try {
        
        console.log(pdfFile);
    
        const data = fs.readFileSync(pdfFile);
    
        console.log(data);
    
        return 'OK';

    } catch (error) {
        
        console.error(error);

    }


}

/* pdfToBase64('C:/GTC/QA/Temp/FB442D6E-6E85-4BEC-B5D3-3B6552E16D4F.pdf'); */

module.exports = {
    pdfToBase64
}