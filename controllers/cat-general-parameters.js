var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

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

module.exports = {
    getGeneralParameters : getGeneralParameters,
    getGeneralParametersbyID: getGeneralParametersbyID
}