var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getRoutes(params){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('pIdCustomer', sql.Int, params.pIdCustomer)
            .input('pvIdRole', sql.VarChar, params.pvIdRole)
            .execute('spSecurity_Access_CRUD_Records')
        return routes.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getRoutes : getRoutes,
}