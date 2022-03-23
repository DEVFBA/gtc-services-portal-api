const sql = require('mssql');
const logger = require('../utils/logger');
const { 
    execStoredProcedure 
} = require('../utils/mssql-database');

async function getAvailableStampings( idCustomer ) {

    try {

        logger.info('Recuperando los Timbres Disponibles para el Cliente: ' + idCustomer);

        let availableStampings = 0;

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(5),
                value: 'VA'
            },
            {
                name: 'piIdCustomer',
                type: sql.Int,
                value: idCustomer
            }
        ];

        const availableStampingsRecord = await execStoredProcedure( 'spCustomers_Stamping_CRUD_Records', sqlParams );

        const availableStampingsRecordLenght = availableStampingsRecord[0].length;

        if( availableStampingsRecordLenght === 0 ) {

            logger.info('No existen registros de Timbres Disponibles para el Cliente: ' + idCustomer);

            availableStampings = 0;
            
        } else {

            availableStampings =  availableStampingsRecord[0][0].Availables;

            logger.info('Los timbres disponibles para el Cliente: ' + idCustomer + ' son: ' + availableStampings);

        }

        return availableStampings;
        
    } catch (error) {
        
        console.log('ERR: Error en Get Available Stampings: ', error);
        logger.error('ERR: Error en Get Available Stampings: ', error);

    }

}

async function getCustomersStamping(idCustomer)
{
    try {

        logger.info('Recuperando los Timbres Disponibles para el Cliente: ' + idCustomer);

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            },
            {
                name: 'piIdCustomer',
                type: sql.Int,
                value: idCustomer
            }
        ];

        const customerStamping = await execStoredProcedure( 'spCustomers_Stamping_CRUD_Records', sqlParams );

        return customerStamping;
        
    } catch (error) {
        
        console.log('ERR: Error en Get Customers Stampings: ', error);
        logger.error('ERR: Error en Get Customers Stampings: ', error);

    }
}

module.exports = {
    getAvailableStampings,
    getCustomersStamping : getCustomersStamping
}