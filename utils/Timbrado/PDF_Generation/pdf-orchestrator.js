const {
    getPDFPolymex
} =  require('./PdfPolymex');

const fs = require('fs');
const logger = require('../../logger');

async function getInvoicePDF( tempPath, xmlBase64, additionalFiles, pdfOptions, options ) {

    try {

        logger.info('Entra Proceso de Orquestador de PDFs.');

        const additionalFilesLength = additionalFiles.length;
        const PDFLogo               = pdfOptions.pdfLogo;
        let commercialFileFullPath  = '';
        let commercialFileName      = '';

        /**
         * * Retrieve Additional Files Information
         * * ***** CommercialData is a file which contains extra commercial information for PDF
         */
        if( additionalFilesLength > 0 ) {

            logger.info('Procesando archivos adicionales...');

            /**
             * * Retrieve Commercial Data File Information
             */
            const commercialDataFile = additionalFiles.filter( (fileData) => {
                return fileData.fileType === 'CommercialData';
            } );
        
            const commercialDataFileLength  = commercialDataFile.length;

            if( commercialDataFileLength > 0 ) {

                logger.info('Recuperando información Comercial Adicional.');

                const commercialFileBase64      = commercialDataFile[0].fileBase64;
                const commercialFileString      = Buffer.from(commercialFileBase64, 'base64').toString('utf-8');
                commercialFileName              = commercialDataFile[0].fileName;
                commercialFileFullPath          = `${tempPath}${commercialFileName}`;

                fs.writeFileSync( commercialFileFullPath, commercialFileString, {encoding: 'utf-8'} );
            
                //fs.writeFileSync( commercialFileFullPath, commercialFileString );

            } else {
                logger.info('No hay información Comercial Adicional.');
            }

        } else {
            logger.info('No existen Archivos Adicionales por Procesar.');
        }
        
        logger.info('Ejecutando función de PDF: ' + pdfOptions.pdfFunction + ' con los siguientes parámetros: \n' + '   XML Base 64: ' + xmlBase64 + '\n' + 'Path Archivo Comercial: ' + commercialFileFullPath + '\n' + 'Path Logo: ' + PDFLogo + '\n' + 'Options: ' + JSON.stringify(options));

        const pdfData = await eval(pdfOptions.pdfFunction + '( xmlBase64, commercialFileFullPath, PDFLogo, options )');

        const commercialFileExists = fs.existsSync(`${tempPath}${commercialFileName}`);

        if( commercialFileExists ) {
            fs.unlinkSync(`${tempPath}${commercialFileName}`);
        }
    
        return pdfData;

    } catch (error) {
        
        logger.error('Error en getInvoicePDF: ' + error);

    }

}

module.exports = {
    getInvoicePDF
}