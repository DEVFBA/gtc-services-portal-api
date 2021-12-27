var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

//Para obtener los catálogos tanto del portal como el SAT
async function getCatalogs(params){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .input('piIdCatalogType', sql.Int, params.piIdCatalogType)
            .execute('spCat_Catalogs_CRUD_Records')
        return routes.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para obtener un registro en específico de algún catálogo
async function getCatalog(params){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute(params.pSpCatalog)
        return routes.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para obtener la descripción de un Código de cualquier catálogo SAT
async function getCatalogIdDescription( params ){

    try{

        let description = '';

        let pSpCatalog = 'sp' + params.table + '_CRUD_Records';

        let pool = await sql.connect( config );

        let data = await pool.request()
            .input( 'pvOptionCRUD', sql.VarChar, params.pvOptionCRUD )
            .input( 'pvIdCatalog', sql.VarChar, params.pvIdCatalog )
            .execute( pSpCatalog );

        data.recordsets[0][0]? description = data.recordsets[0][0].Short_Desc:description = 'Code Not Found!';

        return description;

    }catch( error ){

        console.log( error );
        return 'Get Description Error!';

    }

}

//Crear un registro de los catalogos del Portal
async function insertCatRegisterPortal(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdSuite', sql.SmallInt, catRegister.piIdSuite)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(insertCatRegister.recordsets[0][0])); 
        return insertCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los catalogos del Portal
async function updateCatRegisterPortal(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdSuite', sql.SmallInt, catRegister.piIdSuite)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un registro de los catálogos del SAT
async function insertCatRegisterSAT(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(insertCatRegister.recordsets[0][0])); 
        return insertCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un registro de los catálogos del SAT
async function insertCatRegisterSATAssumptions(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piFirstRow', sql.SmallInt, catRegister.piFirstRow)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(insertCatRegister.recordsets[0][0])); 
        return insertCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los catálogos del SAT
async function updateCatRegisterSAT(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los catálogos del SAT Assumptions
async function updateCatRegisterSATAssumptions(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piFirstRow', sql.SmallInt, catRegister.piFirstRow)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para obtener ubicaciones de acuerdo al codigo postal - Catalogo Zip Codes
async function getUbicZipCode(params){
    try{
        let pool = await sql.connect(config);
        let zipcodes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvZip_Code', sql.VarChar, params.pvZip_Code)
            .execute('spSAT_Cat_Zip_Codes_Counties_CRUD_Records')
        return zipcodes.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para obtener ubicaciones de acuerdo al codigo postal - Catalogo Zip Codes
async function getUbicZipCodeCounty(params){
    //console.log(params)
    try{
        let pool = await sql.connect(config);
        let zipcodes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvIdState', sql.VarChar, params.pvIdState)
            .input('pvIdCounty', sql.VarChar, params.pvIdCounty)
            .execute('spSAT_Cat_Zip_Codes_Counties_CRUD_Records')
        return zipcodes.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCatalogs : getCatalogs,
    getCatalog : getCatalog,
    insertCatRegisterPortal: insertCatRegisterPortal,
    insertCatRegisterSAT:insertCatRegisterSAT,
    insertCatRegisterSATAssumptions:insertCatRegisterSATAssumptions,
    updateCatRegisterPortal: updateCatRegisterPortal,
    updateCatRegisterSAT: updateCatRegisterSAT,
    updateCatRegisterSATAssumptions: updateCatRegisterSATAssumptions,
    getUbicZipCode : getUbicZipCode,
    getUbicZipCodeCounty : getUbicZipCodeCounty,
    getCatalogIdDescription: getCatalogIdDescription
}