var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCatApplications(params){
    try{
        let pool = await sql.connect(config);
        let catApplications = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spCat_Applications_CRUD_Records')
        return catApplications.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCatApplications : getCatApplications,
}