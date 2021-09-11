var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getUsers(params){
    try{
        let pool = await sql.connect(config);
        let users = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spSecurity_Users_CRUD_Records')
        return users.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getUsers : getUsers,
}