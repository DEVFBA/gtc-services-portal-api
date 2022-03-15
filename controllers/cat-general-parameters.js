var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

const {
    execStoredProcedure
} = require('../utils/mssql-database');

async function getGeneralParameters(params){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getGeneralParametersbyID(params){

    try{

        let pool = await sql.connect(config);

        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdParameter', sql.VarChar, params.piIdParameter)
            .execute('spCat_General_Parameters_CRUD_Records');
        
        pool.close();

        return generalParameters.recordsets;

    }catch(error){

        console.log(error);

    }

}

async function getParameterById(parameterId) {

    try {

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            },
            {
                name: 'piIdParameter',
                type: sql.Int,
                value: parameterId
            }
        ]
        
        const generalParameterData = await execStoredProcedure( 'spCat_General_Parameters_CRUD_Records', sqlParams );
        
        return generalParameterData[0][0];

    } catch (error) {
        
        console.log('Error en Function getParameterById: ' + error)
        logger.error('Error en Function getParameterById: ' + JSON.stringify(error));

    }

}

async function getTempFilesPath() {

    try {

        const record = await getParameterById(20);

        const tempFilesPath = record.Value;
        
        return tempFilesPath;
        
    } catch (error) {

        console.log('Error en getTempFilesPath: ' + JSON.stringify(error));

    }

}

module.exports = {
    getGeneralParameters : getGeneralParameters,
    getGeneralParametersbyID: getGeneralParametersbyID,
    getTempFilesPath : getTempFilesPath
}