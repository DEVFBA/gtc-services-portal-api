var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getApplicationsSettings(params){
    try{
        let pool = await sql.connect(config);
        let applicationsSettings = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spApplication_Settings_Templates_CRUD_Records')
        return applicationsSettings.recordsets
    }catch(error){
        console.log(error)
    }
}

//Funcion para obtener un usuario mediante su id
async function getApplicationsSettingsId(params){
    try{
        let pool = await sql.connect(config);
        let applicationsSettings = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdApplication', sql.Int, params)
            .execute('spApplication_Settings_Templates_CRUD_Records')
        return applicationsSettings.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getApplicationsSettings : getApplicationsSettings,
    getApplicationsSettingsId: getApplicationsSettingsId,
}