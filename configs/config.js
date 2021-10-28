var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getExpiration(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][6].Value
    }catch(error){
        console.log(error)
    }
}

async function getExpirationDistances(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][13].Value
    }catch(error){
        console.log(error)
    }
}

async function getExpiration69(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][12].Value
    }catch(error){
        console.log(error)
    }
}

async function getSecret69(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][11].Value
    }catch(error){
        console.log(error)
    }
}

async function getSecretDistances(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][14].Value
    }catch(error){
        console.log(error)
    }
}

async function getSecret(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][5].Value
    }catch(error){
        console.log(error)
    }
}

async function getGoogleApiKey(){
    try{
        let pool = await sql.connect(config);
        let generalParameters = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute('spCat_General_Parameters_CRUD_Records')
        return generalParameters.recordsets[0][15].Value
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    llave: "miclaveultrasecreta123*",
    getExpiration: getExpiration,
    getSecret: getSecret,
    getSecret69 : getSecret69,
    getExpiration69 : getExpiration69,
    getSecretDistances : getSecretDistances,
    getExpirationDistances : getExpirationDistances,
    getGoogleApiKey : getGoogleApiKey
}