var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCustomerApplicationsUsers(params){
    try{
        let pool = await sql.connect(config);
        let catApplications = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, params.piIdCustomer)
            .input('pIdApplication', sql.SmallInt, params.pIdApplication)
            .execute('spCustomer_Application_Users_CRUD_Records')
        return catApplications.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para insertar usuarios de acuerdo a su Customer Role Service
async function insertCustomerApplicationsUsers(params){
    try{
        let pool = await sql.connect(config);
        let users = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, params.piIdCustomer)
            .input('pIdApplication', sql.VarChar, params.pIdApplication)
            .input('pvIdUser', sql.VarChar, params.pvIdUser)
            .input('pvUser', sql.VarChar, params.pvUser)
            .input('pvIP', sql.VarChar, params.pvIP)
            .execute('spCustomer_Application_Users_CRUD_Records')
            console.log(JSON.stringify(users.recordsets[0][0])); 
        return users.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomerApplicationsUsers : getCustomerApplicationsUsers,
    insertCustomerApplicationsUsers: insertCustomerApplicationsUsers
}