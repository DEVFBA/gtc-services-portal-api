const sql = require('mssql');

const config = require('../dbconfig');
const logger = require('./logger');

async function execStoredProcedure( storedProcedure, sqlParams ) {

    try {

        const pool = await sql.connect(config);
    
        const req = pool.request();
    
        sqlParams.forEach( (param) => {
            req.input(param.name, param.type, param.value);
        } );

        logger.info('Ejecutando Stored Procedure: ' + storedProcedure + ' con los Parámetros: ' + JSON.stringify(req.parameters));
    
        const records = await req.execute(storedProcedure);

        pool.close();
    
        return records.recordsets;
        
    } catch (error) {

        console.log(error);
        logger.error('Error en execStoredProcedure ' + storedProcedure + ': ' + JSON.stringify(error));

    }

}


module.exports = {
    execStoredProcedure
}