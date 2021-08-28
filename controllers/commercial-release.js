var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCommercialRelease(){
    try{
        let pool = await sql.connect(config);
        let commercialreleases = await pool.request().query("SELECT * FROM Commercial_Release")
        return commercialreleases.recordsets
    }catch(error){
        console.log(error)
    }
}

async function insertCommercialRelease(commercialRelease){

    //Creando la tabla UDT
    var udtCommercialRelease = new sql.Table();
    // Las columnas deben corresponder con las creadas en la base de datos.   
    udtCommercialRelease.columns.add('Id_Item', sql.VarChar(50));  
    udtCommercialRelease.columns.add('Id_Country', sql.VarChar(10));
    udtCommercialRelease.columns.add('Id_Status_Commercial_Release', sql.SmallInt(2));
    udtCommercialRelease.columns.add('Final_Effective_Date', sql.DateTime(8));
    udtCommercialRelease.columns.add('Modify_By', sql.VarChar(50));
    udtCommercialRelease.columns.add('Modify_Date', sql.DateTime(8));
    udtCommercialRelease.columns.add('Modify_IP', sql.VarChar(20));

    const fecha = new Date();
    for (var i = 0; i < commercialRelease.pvcountries.length; i++) {  
      udtCommercialRelease.rows.add(commercialRelease.pvIdItem, commercialRelease.pvcountries[i].Id_Country, 1, fecha, commercialRelease.pvUser, fecha, commercialRelease.pvIP);  
    }


    console.log(udtCommercialRelease)
    try{
        let pool = await sql.connect(config);
        let insertCommercialRelease = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, commercialRelease.pvOptionCRUD)
            .input('pvIdLanguageUser', sql.VarChar, commercialRelease.pvIdLanguageUser)
            .input('pvIdItem', sql.VarChar, commercialRelease.pvIdItem)
            .input('pudtCommercialRelease', udtCommercialRelease)
            .input('pvUser', sql.VarChar, commercialRelease.pvUser)
            .input('pvIP', sql.VarChar, commercialRelease.pvIP)
            .execute('spCommercial_Release_CRUD_Records')
        console.log(JSON.stringify(insertCommercialRelease.recordsets[0][0])); 
        return insertCommercialRelease.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCommercialRelease : getCommercialRelease,
    insertCommercialRelease : insertCommercialRelease,
    //insertCategoria : insertCategoria
}