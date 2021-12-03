var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getApplicationsSettings(params){

    try{
        let pool = await sql.connect(config);

        let applicationsSettings = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCustomer', sql.VarChar, params.piIdCustomer)
            .input('piIdApplication', sql.VarChar, params.piIdApplication)
            .execute('spApplication_Settings_CRUD_Records');

            pool.close();

        return applicationsSettings.recordsets;
        
    }catch(error){

        console.log(error);

    }

}

//Actualizar un registro de los usuarios
async function updateSettings(settingRegister){
    try{
        let pool = await sql.connect(config);
        let updateSettingRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, settingRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, settingRegister.piIdCustomer)
            .input('piIdApplication', sql.VarChar, settingRegister.piIdApplication)
            .input('pvSettingsKey', sql.VarChar, settingRegister.pvSettingsKey)
            .input('pvSettingsValue', sql.VarChar, settingRegister.pvSettingsValue)
            .input('pvUser', sql.VarChar, settingRegister.pvUser)
            .input('pvIP', sql.VarChar, settingRegister.pvIP)
            .execute('spApplication_Settings_CRUD_Records')
        console.log(JSON.stringify(updateSettingRegister.recordsets[0][0])); 
        return updateSettingRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getApplicationsSettings : getApplicationsSettings,
    updateSettings : updateSettings
}