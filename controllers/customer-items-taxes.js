var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

var fs = require('fs');

async function getCustomersItemsTaxes(){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerItemsTaxes(idCustomer){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.Int, idCustomer)
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Insertar un registro
async function insertCustomerItemsTaxes(register){
    console.log(register)
    try{
        let pool = await sql.connect(config);
        let insertRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdItem', sql.VarChar, register.pvIdItem)
            .input('pvIdFactorType', sql.VarChar, register.pvIdFactorType)
            .input('pvIdTax', sql.VarChar, register.pvIdTax)
            .input('pvTaxType', sql.VarChar, register.pvTaxType)
            .input('pvTaxValue', sql.VarChar, register.pvTaxValue)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        console.log(JSON.stringify(insertRegister.recordsets[0][0])); 
        return insertRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro
async function updateCustomerItemsTaxes(register){
    console.log(register)
    try{
        let pool = await sql.connect(config);
        let updateRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('piIdItemTaxes', sql.Int, register.piIdItemTaxes)
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdItem', sql.VarChar, register.pvIdItem)
            .input('pvIdFactorType', sql.VarChar, register.pvIdFactorType)
            .input('pvIdTax', sql.VarChar, register.pvIdTax)
            .input('pvTaxType', sql.VarChar, register.pvTaxType)
            .input('pvTaxValue', sql.VarChar, register.pvTaxValue)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Items_Taxes_CRUD_Records')
        console.log(JSON.stringify(updateRegister.recordsets[0][0])); 
        return updateRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomersItemsTaxes : getCustomersItemsTaxes,
    getCustomerItemsTaxes : getCustomerItemsTaxes,
    insertCustomerItemsTaxes : insertCustomerItemsTaxes,
    updateCustomerItemsTaxes : updateCustomerItemsTaxes
}