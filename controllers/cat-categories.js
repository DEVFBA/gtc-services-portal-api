var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCategoria(){
    try{
        let pool = await sql.connect(config);
        let categorias = await pool.request().query("SELECT * FROM Cat_Categories")
        return categorias.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCategoriaId(cat_id){
    try{
        let pool = await sql.connect(config);
        let categorias = await pool.request()
            .input('input_parameter', sql.VarChar, cat_id)
            .query("SELECT * FROM Cat_Categories WHERE Id_Category= @input_parameter")
        return categorias.recordsets
    }catch(error){
        console.log(error)
    }
}

async function insertCategoria(categoria){
    try{
        let pool = await sql.connect(config);
        let insertcate = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, categoria.pvOptionCRUD)
            .input('pvIdLanguageUser', sql.VarChar, categoria.pvIdLanguageUser)
            .input('pvIdCategory', sql.VarChar, categoria.pvIdCategory)
            .input('pvShortDesc', sql.VarChar, categoria.pvShortDesc)
            .input('pvLongDesc', sql.VarChar, categoria.pvLongDesc)
            .input('pbStatus', sql.Bit, categoria.pbStatus)
            .input('pvUser', sql.VarChar, categoria.pvUser)
            .input('pvIP', sql.VarChar, categoria.pvIP)
            .execute("spCat_Categories_CRUD_Records")
        return insertcate.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCategoria : getCategoria,
    getCategoriaId : getCategoriaId,
    insertCategoria : insertCategoria
}