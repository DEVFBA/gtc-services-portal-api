var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCFDIPDFRequest(params){
    try{
        let pool = await sql.connect(config);
        let cfdipdf = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spRequests_CFDI_Generic_PDF_CRUD_Records')
        return cfdipdf.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerCFDI(params){
    try{
        let pool = await sql.connect(config);
        let cfdipdf = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, params.piIdCustomer)
            .input('pvRequestCustomer', sql.VarChar, params.pvRequestCustomer)
            .execute('spRequests_CFDI_Generic_PDF_CRUD_Records')
        return cfdipdf.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCFDIPDFRequest : getCFDIPDFRequest,
    getCustomerCFDI : getCustomerCFDI
}