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

module.exports = {
    getGeneralParameters : getGeneralParameters,
}