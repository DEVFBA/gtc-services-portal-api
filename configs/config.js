var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getExpiration(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
            //console.log(generalParameters.recordsets[0][6].Value)
        return generalParameters.recordsets[0][6].Value
    }catch(error){
        console.log(error)
    }
}

async function getSecret(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spSAT_Article_69B_Load_Records')
            //console.log(generalParameters.recordsets[0][6].Value)
        return generalParameters.recordsets[0][5].Value
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    llave: "miclaveultrasecreta123*",
    getExpiration: getExpiration,
    getSecret: getSecret
}