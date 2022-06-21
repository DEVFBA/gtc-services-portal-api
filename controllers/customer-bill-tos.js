var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

var fs = require('fs');

async function getCustomersBillTos(){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCustomer_Bill_Tos_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerBillTos(idCustomer){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.Int, idCustomer)
            .execute('spCustomer_Bill_Tos_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Insertar un registro
async function insertCustomerBillTos(register){
    console.log(register)
    try{
        let pool = await sql.connect(config);
        let insertRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdEntityType', sql.VarChar, register.pvIdEntityType)
            .input('pvIdCountry', sql.VarChar, register.pvIdCountry)
            .input('pvIdCFDIUse', sql.VarChar, register.pvIdCFDIUse)
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdTaxRegimen', sql.VarChar, register.pvIdTaxRegimen)
            .input('pvZipCodes', sql.VarChar, register.pvZipCodes)
            .input('pvTaxId', sql.VarChar, register.pvTaxId)
            .input('pvName', sql.VarChar, register.pvName)
            .input('pbForeign', sql.Bit, register.pbForeign)
            .input('pvForeignTaxId', sql.VarChar, register.pvForeignTaxId)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Bill_Tos_CRUD_Records')
        console.log(JSON.stringify(insertRegister.recordsets[0][0])); 
        return insertRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro
async function updateCustomerBillTos(register){
    console.log(register)
    try{
        let pool = await sql.connect(config);
        let updateRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('piIdBillTo', sql.Int, register.piIdBillTo)
            .input('pvIdEntityType', sql.VarChar, register.pvIdEntityType)
            .input('pvIdCountry', sql.VarChar, register.pvIdCountry)
            .input('pvIdCFDIUse', sql.VarChar, register.pvIdCFDIUse)
            .input('piIdCustomer', sql.Int, register.piIdCustomer)
            .input('pvIdTaxRegimen', sql.VarChar, register.pvIdTaxRegimen)
            .input('pvZipCodes', sql.VarChar, register.pvZipCodes)
            .input('pvTaxId', sql.VarChar, register.pvTaxId)
            .input('pvName', sql.VarChar, register.pvName)
            .input('pbForeign', sql.Bit, register.pbForeign)
            .input('pvForeignTaxId', sql.VarChar, register.pvForeignTaxId)
            .input('pbStatus', sql.Bit, register.pbStatus)
            .input('pvUser', sql.VarChar, register.pvUser)
            .input('pvIP', sql.VarChar, register.pvIP)
            .execute('spCustomer_Bill_Tos_CRUD_Records')
        console.log(JSON.stringify(updateRegister.recordsets[0][0])); 
        return updateRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomersBillTos : getCustomersBillTos,
    getCustomerBillTos : getCustomerBillTos,
    insertCustomerBillTos : insertCustomerBillTos,
    updateCustomerBillTos : updateCustomerBillTos
}