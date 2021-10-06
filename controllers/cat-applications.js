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

//Funcion para obtener un usuario mediante su id
async function getApplicationId(params){
    try{
        let pool = await sql.connect(config);
        let catApplication = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdApplication', sql.VarChar, params)
            .execute('spCat_Applications_CRUD_Records')
        return catApplication.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un registro de los catalogos del Portal
async function insertCatRegisterApplication(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdSuite', sql.SmallInt, catRegister.piIdSuite)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pvVersion', sql.VarChar, catRegister.pvVersion)
            .input('pvTechnicalDescription', sql.VarChar, catRegister.pvTechnicalDescription)
            .input('pvType', sql.VarChar, catRegister.pvType)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute("spCat_Applications_CRUD_Records")
        console.log(JSON.stringify(insertCatRegister.recordsets[0][0])); 
        return insertCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar una aplicación
async function updateCatRegisterApplication(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdApplication', sql.SmallInt, catRegister.piIdApplication)
            .input('piIdSuite', sql.SmallInt, catRegister.piIdSuite)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pvVersion', sql.VarChar, catRegister.pvVersion)
            .input('pvTechnicalDescription', sql.VarChar, catRegister.pvTechnicalDescription)
            .input('pvType', sql.VarChar, catRegister.pvType)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute("spCat_Applications_CRUD_Records")
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCatApplications : getCatApplications,
    getApplicationId: getApplicationId,
    insertCatRegisterApplication: insertCatRegisterApplication,
    updateCatRegisterApplication: updateCatRegisterApplication
}