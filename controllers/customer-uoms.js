var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

var fs = require('fs');

async function getCustomersUoMs(){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCustomer_UoMs_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerUoMs(idCustomer){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.Int, idCustomer)
            .execute('spCustomer_UoMs_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Insertar un registro
async function insertCustomerUoMs(register){
    console.log(register)
    try{
        let pool = await sql.connect(config);
        let insertRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdUoMCode', sql.VarChar, register.pvIdUoMCode)
            .input('pvIdCustomerUoM', sql.VarChar, register.pvIdCustomerUoM)
            .input('pvShortDesc', sql.VarChar, register.pvShortDesc)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_UoMs_CRUD_Records')
        console.log(JSON.stringify(insertRegister.recordsets[0][0])); 
        return insertRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro
async function updateCustomerUoMs(register){
    try{
        let pool = await sql.connect(config);
        let updateRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdUoMCode', sql.VarChar, register.pvIdUoMCode)
            .input('pvIdCustomerUoM', sql.VarChar, register.pvIdCustomerUoM)
            .input('pvShortDesc', sql.VarChar, register.pvShortDesc)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.Bit, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_UoMs_CRUD_Records')
        console.log(JSON.stringify(updateRegister.recordsets[0][0])); 
        return updateRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomersUoMs : getCustomersUoMs,
    getCustomerUoMs : getCustomerUoMs,
    insertCustomerUoMs : insertCustomerUoMs,
    updateCustomerUoMs : updateCustomerUoMs
}