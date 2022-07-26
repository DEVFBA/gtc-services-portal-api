const sql = require('mssql');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const {
    execStoredProcedure
} =  require('../utils/mssql-database');

const logger = require('../utils/logger');

const config = require('../dbconfig');

const {
    getSecretTimbrado,
    getExpirationTimbrado
} = require('../configs/config');

async function login(req) {

    let response = {
        data: {
            success: 0,
            message: '',
            idTransacLog: 0,
            login: {
                user: '',
                token: '', 
                exp: ''
            }
        }
    }

    const user                  = req.user;
    const password              = req.password;
    const idCustomer            = req.idCustomer;
    const idApplication         = req.idApplication;
    const serverApplication   = req.serverApplication;

    try {

        let encPassword = await axios.post('http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5', {text: password});

        let encryptedPassword = encPassword.data;

        const applicationLoginPool = await sql.connect(config);
        
        const loginResult = await applicationLoginPool.request()
        .input('pvOptionCRUD', sql.VarChar, 'VA')
        .input('piIdCustomer', sql.Int, idCustomer)
        .input('pIdApplication', sql.SmallInt, idApplication)
        .input('pvIdUser', sql.VarChar, user)
        .input('pvPassword', sql.VarChar, encryptedPassword)
        .execute('spCustomer_Application_Users_CRUD_Records');

        if( loginResult.recordset[0].Code_Type === 'Error' ) {

            response.data.success = loginResult.recordset[0].Code_Successful;
            response.data.message = loginResult.recordset[0].Code_Message_User;
            response.data.idTransacLog = loginResult.recordset[0].IdTransacLog;

            return response;

        } else {

            let expiration = await getExpirationTimbrado();

            let secret = await getSecretTimbrado();

            const today = new Date();
            const exp = new Date(today);
            exp.setDate(today.getDate() + parseInt(expiration, 10)); // 1 día antes de expirar

            const token = jwt.sign({
                userName:             user,
                idCustomer:           idCustomer,
                idApplication:        idApplication,
                serverApplication:    serverApplication,
                exp:                  parseInt(exp.getTime() / 1000)
              }, secret);

            response.data.success               = loginResult.recordset[0].Code_Successful;
            response.data.message               = loginResult.recordset[0].Code_Message_User;
            response.data.login.user            = user;
            response.data.login.token           = token;
            response.data.login.exp             = exp;

            return response;

        }
        
    } catch (error) {

        console.log('Error en Login de External Applications: ' + error);
        logger.error('Error en Login de External Applications: ' + JSON.stringify(error));

    }
    
}

async function getApplicationSettings(idApplication, idCustomer) {

    let response = {
        data: {
            success: false,
            message: '',
            configuration: {}
        }
    }

    let sqlParams = [];

    try {

        const applicationData = await getApplicationDataById(idApplication);

        /**
         * * Validate if Application Exists or if it's enabled
         */
        logger.info('***Validando si existe o está habilitada la aplicación Id: ' + idApplication + '***' );

        if( Object.keys(applicationData).length === 0 || !applicationData.Status ) {

            logger.info('Aplicación Id: ' + idApplication + ' inexistente o inhabilitada en Portal.');

            response.data.success = false;
            response.data.message = 'Aplicación inexistente o inhabilitada en Portal.';

            logger.info('Saliendo de getApplicationSettings y regresando el Response.');

            return response;

        }

        /**
         * * Get Application Settings
         */
        logger.info('Aplicación Id: ' + idApplication + ' válida en el Portal.');

        sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            },
            {
                name: 'piIdApplication',
                type: sql.Int,
                value: idApplication
            },
            {
                name: 'piIdCustomer',
                type: sql.Int,
                value: idCustomer
            }
        ]

        logger.info('***Recuperando las configuraciones de la Aplicación Id: ' + idApplication + ' para el Customer: ' + idCustomer + '***' );

        let applicationSettings = await execStoredProcedure( 'spApplication_Settings_CRUD_Records', sqlParams );

        applicationSettings = applicationSettings[0];

        /**
         * * Validate if Application has configured settings
         */
        if( applicationSettings.length === 0 ) {

            logger.info('Aplicación Id: ' + idApplication + ' para el Customer: ' + idCustomer + ' no tiene configuraciones en Portal.');

            response.data.success = false;
            response.data.message = 'Aplicación sin configuraciones en Portal.';

            logger.info('Saliendo de getApplicationSettings y regresando el Response.');

            return response;

        }

        /**
         * * Retrieve Application Settings and set settings Array
         */
        const settingsLenght = applicationSettings.length;

        for( let i = 0; i < settingsLenght; i++ ) {
    
            const settingKey    = applicationSettings[i].Settings_Key;
            const settingValue  = applicationSettings[i].Settings_Value

            response.data.configuration = {
                ...response.data.configuration,
                [settingKey]: settingValue
            }

        }

        logger.info('Configuraciones recuperadas correctamente.');
        logger.info('Saliendo de getApplicationSettings y regresando el Response.');

        response.data.success = true;

        return response;
        
    } catch (error) {

        console.log('Error en Get Application Settings / External Applications: ' + error);
        console.log('Error en Get Application Settings / External Applications: ' + JSON.stringify(error));

    }

}

async function getApplicationDataById(applicationId) {

    try {

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            },
            {
                name: 'piIdApplication',
                type: sql.Int,
                value: applicationId
            }
        ]

        const applicationData = await execStoredProcedure( 'spCat_Applications_CRUD_Records', sqlParams );

        return applicationData[0][0];
        
    } catch (error) {
        
        console.log('Error en Get Application Data By ID: ', error);
        logger.error('Error en Get Application Data By ID: ', error);

    }

}

module.exports = {
    login : login,
    getApplicationSettings : getApplicationSettings
}