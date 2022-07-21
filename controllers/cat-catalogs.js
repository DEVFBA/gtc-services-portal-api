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

//Para obtener la descripción larga de un Código de cualquier catálogo SAT
async function getCatalogIdDescription( params ){

    try{

        let description = '';

        let pSpCatalog = 'sp' + params.table + '_CRUD_Records';

        let pool = await sql.connect( config );

        let data = await pool.request()
            .input( 'pvOptionCRUD', sql.VarChar, params.pvOptionCRUD )
            .input( 'pvIdCatalog', sql.VarChar, params.pvIdCatalog )
            .execute( pSpCatalog );

        data.recordsets[0][0]? description = data.recordsets[0][0].Long_Desc:description = 'Code Not Found!';

        return description;

    }catch( error ){

        console.log( error );
        return 'Get Description Error!';

    }

}

//Para obtener la descripción Corta de un Código de cualquier catálogo SAT
async function getCatalogIdShortDescription( params ){

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

//Para obtener el nombre del banco de acuerdo a su Tax Id
async function getNameBank( params ){

    try{

        let description = '';

        let pSpCatalog = 'sp' + params.table + '_CRUD_Records';

        let pool = await sql.connect( config );

        let data = await pool.request()
            .input( 'pvOptionCRUD', sql.VarChar, params.pvOptionCRUD )
            .input( 'pvTaxId', sql.VarChar, params.pvTaxId )
            .execute( pSpCatalog );

        data.recordsets[0][0]? description = data.recordsets[0][0].Short_Desc:description = 'Code Not Found!';

        return description;

    }catch( error ){

        console.log( error );
        return 'Get Description Error!';

    }

}

//Para obtener una clave producto por id
async function getKeyProduct(id){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvIdCatalog', sql.VarChar, id)
            .execute('spSAT_Cat_Product_Service_Codes_CRUD_Records')
        return routes.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para obtener una custom uom por id
async function getCustomUoM(id){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvIdCatalog', sql.VarChar, id)
            .execute('spSAT_Cat_UoM_Codes_CRUD_Records')
        return routes.recordsets
    }catch(error){
        console.log(error)
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

//Crear un registro de los catalogos del Portal Groupers
async function insertCatRegisterPortalGrouper(catRegister){
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

//Actualizar un registro de los catalogos del Portal Groupers
async function updateCatRegisterPortalGrouper(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', "U")
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

//Crear un registro de los catálogos del SAT Estados
async function insertCatRegisterSATStates(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCountry', sql.VarChar, catRegister.pvIdCountry)
            .input('pvIdState', sql.VarChar, catRegister.pvIdState)
            .input('pvDescription', sql.VarChar, catRegister.pvDescription)
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

//Crear un registro de los catálogos del SAT Localidades
async function insertCatRegisterSATLocations(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCountry', sql.VarChar, catRegister.pvIdCountry)
            .input('pvIdState', sql.VarChar, catRegister.pvIdState)
            .input('pvIdLocation', sql.VarChar, catRegister.pvIdLocation)
            .input('pvDescription', sql.VarChar, catRegister.pvDescription)
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

//Crear un registro de los catálogos del SAT Municipios
async function insertCatRegisterSATMunicipalities(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCountry', sql.VarChar, catRegister.pvIdCountry)
            .input('pvIdState', sql.VarChar, catRegister.pvIdState)
            .input('pvIdMunicipality', sql.VarChar, catRegister.pvIdMunicipality)
            .input('pvDescription', sql.VarChar, catRegister.pvDescription)
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

//Crear un registro de los catálogos del SAT Monedas
async function insertCatRegisterSATCurrencies(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piDecimals', sql.Int, catRegister.piDecimals)
            .input('pfVariationPercent', sql.Float, catRegister.pfVariationPercent)
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

//Crear un registro de los catálogos del SAT Regimenes Fiscales
async function insertCatRegisterSATTaxRegimes(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbLegalPerson', sql.Bit, catRegister.pbLegalPerson)
            .input('pbLegalEntity', sql.Bit, catRegister.pbLegalEntity)
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

//Crear un registro de los catálogos del SAT Impuestos
async function insertCatRegisterSATTaxes(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbWithholding', sql.Bit, catRegister.pbWithholding)
            .input('pbTransfer', sql.Bit, catRegister.pbTransfer)
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

//Crear un registro de los catálogos del SAT Fracciones Arancelarias
async function insertCatRegisterSATTariffFractions(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvIdCustomUoMs', sql.VarChar, catRegister.pvIdCustomUoMs)
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

//Crear un registro de los catálogos del SAT Tasa O Cuota
async function insertCatRegisterSATTaxFee(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdTax', sql.VarChar, catRegister.pvIdTax)
            .input('pvIdFactorType', sql.VarChar, catRegister.pvIdFactorType)
            .input('pbFixed', sql.Bit, catRegister.pbFixed)
            .input('pfMinimumValue', sql.Float, catRegister.pfMinimumValue)
            .input('pfMaximumValue', sql.Float, catRegister.pfMaximumValue)
            .input('pbWithholding', sql.Bit, catRegister.pbWithholding)
            .input('pbTransfer', sql.Bit, catRegister.pbTransfer)
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

//Crear un registro de los catálogos del SAT Clave Producto Servicio
async function insertCatRegisterSATKeyProduct(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piVATTransfer', sql.VarChar, catRegister.piVATTransfer)
            .input('piIEPSTransfer', sql.VarChar, catRegister.piIEPSTransfer)
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


//Crear un registro de los catálogos del SAT Tipo de Persona
async function insertCatRegisterSATEntityType(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piTaxIdLengt', sql.VarChar, catRegister.piTaxIdLengt)
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

//Crear un registro de los tax regimens cfdi uses
async function insertTaxRegimensCFDIUses(catRegister){
    try{
        let pool = await sql.connect(config);
        let insertCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "C")
            .input('pvIdTaxRegimen', sql.VarChar, catRegister.pvIdTaxRegimen)
            .input('pvIdCFDIUse', sql.VarChar, catRegister.pvIdCFDIUse)
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

//Actualizar un registro de los catálogos del SAT Estados
async function updateCatRegisterSATStates(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCountry', sql.VarChar, catRegister.pvIdCountry)
            .input('pvIdState', sql.VarChar, catRegister.pvIdState)
            .input('pvDescription', sql.VarChar, catRegister.pvDescription)
            .input('pbStatus', sql.SmallInt, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los catálogos del SAT Estados
async function updateCatRegisterSATLocations(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCountry', sql.VarChar, catRegister.pvIdCountry)
            .input('pvIdState', sql.VarChar, catRegister.pvIdState)
            .input('pvIdLocation', sql.VarChar, catRegister.pvIdLocation)
            .input('pvDescription', sql.VarChar, catRegister.pvDescription)
            .input('pbStatus', sql.SmallInt, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los catálogos del SAT Estados
async function updateCatRegisterSATMunicipalities(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCountry', sql.VarChar, catRegister.pvIdCountry)
            .input('pvIdState', sql.VarChar, catRegister.pvIdState)
            .input('pvIdMunicipality', sql.VarChar, catRegister.pvIdMunicipality)
            .input('pvDescription', sql.VarChar, catRegister.pvDescription)
            .input('pbStatus', sql.SmallInt, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute(catRegister.pSpCatalog)
        console.log(JSON.stringify(updateCatRegister.recordsets[0][0])); 
        return updateCatRegister.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un registro de los catálogos del SAT Estados
async function updateCatRegisterSATCurrencies(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piDecimals', sql.Int, catRegister.piDecimals)
            .input('pfVariationPercent', sql.Float, catRegister.pfVariationPercent)
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

//Actualizar un registro de los catálogos del SAT Regimenes Fiscales
async function updateCatRegisterSATTaxRegimes(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbLegalPerson', sql.Bit, catRegister.pbLegalPerson)
            .input('pbLegalEntity', sql.Bit, catRegister.pbLegalEntity)
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

//Actualizar un registro de los catálogos del SAT Impuestos
async function updateCatRegisterSATTaxes(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('pbWithholding', sql.Bit, catRegister.pbWithholding)
            .input('pbTransfer', sql.Bit, catRegister.pbTransfer)
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

//Actualizar un registro de los catálogos del SAT Fracciones Arancelarias
async function updateCatRegisterSATTariffFractions(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvIdCustomUoMs', sql.VarChar, catRegister.pvIdCustomUoMs)
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

//Actualizar un registro de los catálogos del SAT Fracciones Arancelarias
async function updateCatRegisterSATTaxFee(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdTax', sql.VarChar, catRegister.pvIdTax)
            .input('pvIdFactorType', sql.VarChar, catRegister.pvIdFactorType)
            .input('pbFixed', sql.Bit, catRegister.pbFixed)
            .input('pfMinimumValue', sql.Float, catRegister.pfMinimumValue)
            .input('pfMaximumValue', sql.Float, catRegister.pfMaximumValue)
            .input('pbWithholding', sql.Bit, catRegister.pbWithholding)
            .input('pbTransfer', sql.Bit, catRegister.pbTransfer)
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

//Actualizar un registro de los catálogos del SAT Clave producto servicio
async function updateCatRegisterSATKeyProduct(catRegister){
    console.log(catRegister)
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piVATTransfer', sql.VarChar, catRegister.piVATTransfer)
            .input('piIEPSTransfer', sql.VarChar, catRegister.piIEPSTransfer)
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

//Actualizar un registro de los catálogos del SAT Tipo de entidad
async function updateCatRegisterSATEntityType(catRegister){
    console.log(catRegister)
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdCatalog', sql.VarChar, catRegister.pvIdCatalog)
            .input('pvShortDesc', sql.VarChar, catRegister.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, catRegister.pvLongDesc)
            .input('piTaxIdLengt', sql.VarChar, catRegister.piTaxIdLengt)
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

//Crear un registro de los tax regimens cfdi uses
async function updateTaxRegimensCFDIUses(catRegister){
    try{
        let pool = await sql.connect(config);
        let updateCatRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "U")
            .input('pvIdTaxRegimen', sql.VarChar, catRegister.pvIdTaxRegimen)
            .input('pvIdCFDIUse', sql.VarChar, catRegister.pvIdCFDIUse)
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
    insertCatRegisterPortalGrouper : insertCatRegisterPortalGrouper,
    insertCatRegisterSAT:insertCatRegisterSAT,
    insertCatRegisterSATAssumptions:insertCatRegisterSATAssumptions,
    updateCatRegisterPortal: updateCatRegisterPortal,
    updateCatRegisterSAT: updateCatRegisterSAT,
    updateCatRegisterSATAssumptions: updateCatRegisterSATAssumptions,
    getUbicZipCode : getUbicZipCode,
    getUbicZipCodeCounty : getUbicZipCodeCounty,
    getCatalogIdDescription: getCatalogIdDescription,
    getCatalogIdShortDescription : getCatalogIdShortDescription,
    getNameBank : getNameBank,
    insertCatRegisterSATStates : insertCatRegisterSATStates,
    updateCatRegisterSATStates : updateCatRegisterSATStates,
    insertCatRegisterSATLocations : insertCatRegisterSATLocations,
    updateCatRegisterSATLocations : updateCatRegisterSATLocations,
    insertCatRegisterSATMunicipalities : insertCatRegisterSATMunicipalities,
    updateCatRegisterSATMunicipalities : updateCatRegisterSATMunicipalities,
    insertCatRegisterSATCurrencies : insertCatRegisterSATCurrencies,
    updateCatRegisterSATCurrencies : updateCatRegisterSATCurrencies,
    insertCatRegisterSATTaxRegimes : insertCatRegisterSATTaxRegimes,
    updateCatRegisterSATTaxRegimes : updateCatRegisterSATTaxRegimes,
    insertCatRegisterSATTaxes : insertCatRegisterSATTaxes,
    updateCatRegisterSATTaxes : updateCatRegisterSATTaxes,
    insertCatRegisterSATTariffFractions: insertCatRegisterSATTariffFractions,
    updateCatRegisterSATTariffFractions: updateCatRegisterSATTariffFractions,
    insertCatRegisterSATTaxFee : insertCatRegisterSATTaxFee,
    updateCatRegisterSATTaxFee : updateCatRegisterSATTaxFee,
    insertCatRegisterSATKeyProduct : insertCatRegisterSATKeyProduct,
    updateCatRegisterSATKeyProduct : updateCatRegisterSATKeyProduct,
    getKeyProduct : getKeyProduct, 
    updateCatRegisterPortalGrouper : updateCatRegisterPortalGrouper,
    getCustomUoM : getCustomUoM,
    insertCatRegisterSATEntityType : insertCatRegisterSATEntityType, 
    updateCatRegisterSATEntityType : updateCatRegisterSATEntityType,
    insertTaxRegimensCFDIUses : insertTaxRegimensCFDIUses, 
    updateTaxRegimensCFDIUses : updateTaxRegimensCFDIUses
}