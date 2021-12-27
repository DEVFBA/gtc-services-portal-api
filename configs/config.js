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

// Secret - Expiration Timbrado

async function getExpirationTimbrado(){
    try{
        let pool = await sql.connect(config);
        let expiration = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdParameter', sql.Int, 18)
            .execute('spCat_General_Parameters_CRUD_Records')
        return expiration.recordset[0].Value
    }catch(error){
        console.log(error)
    }
}

async function getSecretTimbrado(){
    try{
        let pool = await sql.connect(config);
        let secret = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdParameter', sql.Int, 17)
            .execute('spCat_General_Parameters_CRUD_Records')
        return secret.recordset[0].Value
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
    getGoogleApiKey : getGoogleApiKey,
    getExpirationTimbrado: getExpirationTimbrado,
    getSecretTimbrado: getSecretTimbrado,
    DB_USER: process.env.DB_USER || 'sa',
    DB_PASSWORD: process.env.DB_PASSWORD || 'GTC-D3v*',
    DB_SERVER: process.env.DB_SERVER || '129.159.99.152',
    DB_PORT: process.env.DB_PORT || 1433,
    DB_DATABASE: process.env.DB_DATABASE || 'PortalGTC',
}