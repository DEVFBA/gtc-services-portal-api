var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getRoles(params){
    try{
        let pool = await sql.connect(config);
        let roles = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spSecurity_Roles_CRUD_Records')
        return roles.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getRoles : getRoles,
}