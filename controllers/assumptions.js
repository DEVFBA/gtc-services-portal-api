var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getAssumptions(){
    try{
        let pool = await sql.connect(config);
        let catApplications = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spSAT_Cat_Assumptions_CRUD_Records')
        return catApplications.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getAssumptions : getAssumptions,
}