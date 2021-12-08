const fs = require('fs');

/* Define Temp Files Names as Date */

const padString = (string, length, character) => {

    const paddedString = String(string).padStart(length, character);

    return paddedString;

}

const getTemporalFileName = () => {

    const dateTime = new Date();

    const day           = padString(dateTime.getDate(), 2, '0');
    const year          = dateTime.getFullYear();
    const month         = padString(dateTime.getMonth(), 2, '0');
    const hour          = dateTime.getHours();
    const minutes       = padString(dateTime.getMinutes(), 2, '0');
    const seconds       = padString(dateTime.getSeconds(), 2, '0');
    const milliseconds  = dateTime.getMilliseconds();

    const fileName = year + month + day + hour + minutes + seconds + milliseconds;

    return fileName;

}

async function createPDFFromBase64 ( filePath, base64PDF ) {

    fs.writeFile( filePath , base64PDF, 'base64', error => {
        if (error) {
            throw error;
        } else {
            console.log('base64 saved!');
        }
      });

}

module.exports = {
    padString,
    getTemporalFileName,
    createPDFFromBase64
}



