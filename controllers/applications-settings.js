var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getApplicationsSettings(params){
    try{
        let pool = await sql.connect(config);
        let applicationsSettings = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCustomer', sql.VarChar, params.piIdCustomer)
            .execute('spApplication_Settings_CRUD_Records')
        return applicationsSettings.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getApplicationsSettings : getApplicationsSettings,
}