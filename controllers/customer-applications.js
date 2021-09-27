var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
const publicIp = require('public-ip');

async function getCustomerApplications(params){
    try{
        let pool = await sql.connect(config);
        let catApplications = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spCustomer_Applications_CRUD_Records')
        return catApplications.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un registro de los customer applications
async function insertCustomerApplication(catRegister){
    const ip = await publicIp.v4();
    try{
        let pool = await sql.connect(config);
        let insertCARegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, catRegister.piIdCustomer)
            .input('piIdApplication', sql.SmallInt, catRegister.piIdApplication)
            .input('pvFinalEffectiveDate', sql.VarChar, catRegister.pvFinalEffectiveDate)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, ip)
            .execute('spCustomer_Applications_CRUD_Records')
        console.log(JSON.stringify(insertCARegister.recordsets[0][0])); 
        return insertCARegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los customer applications
async function updateCustomerApplication(catRegister){
    const ip = await publicIp.v4();
    try{
        let pool = await sql.connect(config);
        let insertCARegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, catRegister.piIdCustomer)
            .input('piIdApplication', sql.SmallInt, catRegister.piIdApplication)
            .input('pvFinalEffectiveDate', sql.VarChar, catRegister.pvFinalEffectiveDate)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, ip)
            .execute('spCustomer_Applications_CRUD_Records')
        console.log(JSON.stringify(insertCARegister.recordsets[0][0])); 
        return insertCARegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomerApplications : getCustomerApplications,
    insertCustomerApplication : insertCustomerApplication,
    updateCustomerApplication: updateCustomerApplication
}