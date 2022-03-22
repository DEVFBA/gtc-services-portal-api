const path = require('path');

const logger = require('./logger');
const fs = require('fs');

const getBase64String = (string) => {

    try {
        
        const beginIndexBase64 = string.indexOf(',') + 1;
                
        const base64 = string.substring(beginIndexBase64, string.length);

        return base64;

    } catch (error) {

        logger.error('Error en función getBase64String (Utils/base64.js): ', error);

        return;
        
    }

}

module.exports = {
    getBase64String
}