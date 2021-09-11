var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCustomers(params){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spCustomers_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomers : getCustomers,
}