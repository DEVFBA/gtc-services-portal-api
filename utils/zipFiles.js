const JSZip = require('jszip');
const logger = require('./logger');
const fs = require('fs');
const path = require('path');

async function zipFiles(filesToZip, zipFileFullPath) {

    logger.info('Comprimiendo Archivos.');

    const filesToZipLength = filesToZip.length;

    const zip = new JSZip();

    return new Promise((resolve,reject) => {

        try {
    
            for( let i = 0; i < filesToZipLength; i++ ) {
    
                try {
    
                    const fileData              = fs.readFileSync(filesToZip[i]);
                    zip.file(path.basename(filesToZip[i]), fileData);
                    
                } catch (error) {
    
                    logger.error('Error al recuperar los files y zippearlos: ', error);
                }
    
            } 
    
            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
                .pipe(fs.createWriteStream(zipFileFullPath))
                .on('finish', function () {
                    
                    logger.info('Archivo Zip generado con éxito.');
    
                    resolve(true);
    
                });
    
        } catch (error) {
    
            console.log('Error al generar el zip: ', error);
            logger.error('Error al generar el zip: ' + error);
    
            reject(false);
    
        }
    })


}

module.exports = {
    zipFiles
}