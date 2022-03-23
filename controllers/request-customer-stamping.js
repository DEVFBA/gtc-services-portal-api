const logger = require("../utils/logger");
const sql = require('mssql');

const {
    execStoredProcedure
} =  require('../utils/mssql-database');

async function addCustomerStampingRecord(data) {

    try {

        logger.info('Añadiendo registro de Timbrado en Control de Timbres.');

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(5),
                value: 'C'
            },
            {
                name: 'piIdCustomer',
                type: sql.Int,
                value: data.customer
            },
            {
                name: 'pvUUID',
                type: sql.VarChar(255),
                value: data.uuid
            },
            {
                name: 'pvResponse',
                type: sql.VarChar(sql.MAX),
                value: data.response
            },
            {
                name: 'pvRequest',
                type: sql.VarChar(sql.MAX),
                value: data.request
            },
            {
                name: 'pvFileName',
                type: sql.VarChar(255),
                value: data.fileName
            },
            {
                name: 'pvSerie',
                type: sql.VarChar(255),
                value: data.serie
            },
            {
                name: 'pvFolio',
                type: sql.VarChar(255),
                value: data.folio
            },
            {
                name: 'pvExecutionMessage',
                type: sql.VarChar(sql.MAX),
                value: data.executionMessage
            },
            {
                name: 'pbSuccessful',
                type: sql.Bit,
                value: data.timbradoSuccess
            },
            {
                name: 'pvUser',
                type: sql.VarChar(50),
                value: data.user
            },
            {
                name: 'pvIP',
                type: sql.VarChar(20),
                value: data.ip
            }
        ];

        const createRecord = await execStoredProcedure('spRequest_Customers_Stamping_CRUD_Records', sqlParams);

        return createRecord[0][0];
        
    } catch (error) {
        
        console.log('ERROR: Error en Add Customer Stamping Record: ', error);
        logger.error('ERROR: Error en Add Customer Stamping Record: ' + error);

    }

}

async function getRequestsCustomersStamping(idCustomer)
{
    try {

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(5),
                value: 'R'
            },
            {
                name: 'piIdCustomer',
                type: sql.Int,
                value: idCustomer
            },
        ];

        const getRecord = await execStoredProcedure('spRequest_Customers_Stamping_CRUD_Records', sqlParams);
        return getRecord;
        
    } catch (error) {
        
        console.log('ERROR: Error en Get Request Customer Stamping: ', error);
        logger.error('ERROR: Error en Get Request Customer Stamping: ' + error);

    }
}

module.exports = {
    addCustomerStampingRecord,
    getRequestsCustomersStamping : getRequestsCustomersStamping
}