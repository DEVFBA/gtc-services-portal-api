var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

async function getCatCountries(){
    try{
        let pool = await sql.connect(config);
        let catcountries = await pool.request().query("SELECT * FROM Cat_Countries")
        return catcountries.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCatCountries : getCatCountries
}