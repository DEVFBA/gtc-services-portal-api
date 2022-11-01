var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

var fs = require('fs');

async function getCustomersSeriesFolios(){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCustomer_Serie_Folios_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerSerieFolio(idCustomer){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.Int, idCustomer)
            .execute('spCustomer_Serie_Folios_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Insertar un registro
async function insertCustomerSerieFolio(register){
    console.log(register.pvIP)
    try{
        let pool = await sql.connect(config);
        let insertRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdProductServiceCode', sql.VarChar, register.pvIdProductServiceCode)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.Bit, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Serie_Folios_CRUD_Records')
        console.log(JSON.stringify(insertRegister.recordsets[0][0])); 
        return insertRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomersSeriesFolios : getCustomersSeriesFolios,
    getCustomerSerieFolio : getCustomerSerieFolio,
    insertCustomerSerieFolio : insertCustomerSerieFolio,
}