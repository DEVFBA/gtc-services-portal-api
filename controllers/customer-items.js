var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

var fs = require('fs');

async function getCustomersItems(){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCustomer_Items_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerItems(idCustomer){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.Int, idCustomer)
            .execute('spCustomer_Items_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Insertar un registro
async function insertCustomerItems(register){
    try{
        let pool = await sql.connect(config);
        let insertRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdItem', sql.VarChar, register.pvIdItem)
            .input('pvIdProductServiceCode', sql.VarChar, register.pvIdProductServiceCode)
            .input('pvIdUoMCode', sql.VarChar, register.pvIdUoMCode)
            .input('pvIdTaxObject', sql.VarChar, register.pvIdTaxObject)
            .input('pvIdHarmonizedTariffCode', sql.VarChar, register.pvIdHarmonizedTariffCode)
            .input('pvIdCustom_UoMs', sql.VarChar, register.pvIdCustom_UoMs)
            .input('pvShortDesc', sql.VarChar, register.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, register.pvLongDesc)
            .input('pvBranch', sql.VarChar, register.pvBranch)
            .input('pvModel', sql.VarChar, register.pvModel)
            .input('pvSubModel', sql.VarChar, register.pvSubModel)
            .input('pvSerialNumber', sql.VarChar, register.pvSerialNumber)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Items_CRUD_Records')
        console.log(JSON.stringify(insertRegister.recordsets[0][0])); 
        return insertRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro
async function updateCustomerItems(register){
    try{
        let pool = await sql.connect(config);
        let updateRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdItem', sql.VarChar, register.pvIdItem)
            .input('pvIdProductServiceCode', sql.VarChar, register.pvIdProductServiceCode)
            .input('pvIdUoMCode', sql.VarChar, register.pvIdUoMCode)
            .input('pvIdTaxObject', sql.VarChar, register.pvIdTaxObject)
            .input('pvIdHarmonizedTariffCode', sql.VarChar, register.pvIdHarmonizedTariffCode)
            .input('pvIdCustom_UoMs', sql.VarChar, register.pvIdCustom_UoMs)
            .input('pvShortDesc', sql.VarChar, register.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, register.pvLongDesc)
            .input('pvBranch', sql.VarChar, register.pvBranch)
            .input('pvModel', sql.VarChar, register.pvModel)
            .input('pvSubModel', sql.VarChar, register.pvSubModel)
            .input('pvSerialNumber', sql.VarChar, register.pvSerialNumber)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Items_CRUD_Records')
        console.log(JSON.stringify(updateRegister.recordsets[0][0])); 
        return updateRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomersItems : getCustomersItems,
    getCustomerItems : getCustomerItems,
    insertCustomerItems : insertCustomerItems,
    updateCustomerItems : updateCustomerItems
}