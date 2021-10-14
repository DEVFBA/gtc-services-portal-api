var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var fs = require('fs');
const { updateCustomerApplication } = require("./customer-applications");

//Para obtener todos los registros del Articulo 69
async function getArticle69(params){
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

//Para obtener todos los registros del Articulo 69 B
async function getArticle69B(params){
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

//Crear los registros de la tabla Articulo 69
async function insertArticle69(catRegister){
    /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
    const uploadPath = `${catRegister.pvFilesPath}`;
    //path of folder where you want to save the image.
    var localPath = `${catRegister.pvFilesPath}`;
    //Find extension of file
    const ext = catRegister.pvFile.substring(catRegister.pvFile.indexOf("/")+1, catRegister.pvFile.indexOf(";base64"));
    console.log("La extension es: "+ext)
    const fileType = catRegister.pvFile.substring("data:".length,catRegister.pvFile.indexOf("/"));
    console.log("El tipo de archivo es: "+fileType)
    //Forming regex to extract base64 data of file.
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    //Extract base64 data.
    const base64Data = catRegister.pvFile.replace(regex, "");
    //Random photo name with timeStamp so it will not overide previous images.
    var filename = `${"Articulo69_"+catRegister.pvSupuesto}.${ext}`;
    
    //Check that if directory is present or not.
    if(!fs.existsSync(`${uploadPath}`)) {
        fs.mkdirSync(`${uploadPath}`);
    }
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath);
    }
    fs.writeFileSync(localPath+filename, base64Data, 'base64');

    //Una vez que tenemos el archivo en la carpeta del servidor vamos a trabajar en ella
    fs.readFile('localPath+filename', 'utf-8', (err, data) => {
        if(err) {
          console.log('error: ', err);
        } else {
          console.log(data);
        }
    });
    
    //Hacemos la llamada al SP
    /*try{
        let pool = await sql.connect(config);
        let insertUserRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, catRegister.piIdCustomer)
            .input('pvIdUser', sql.VarChar, catRegister.pvIdUser)
            .input('pvIdRole', sql.VarChar, catRegister.pvIdRole)
            .input('pvPassword', sql.VarChar, sha256(catRegister.pvPassword))
            .input('pvName', sql.VarChar, catRegister.pvName)
            .input('pbTempPassword', sql.Bit, catRegister.pbTempPassword)
            .input('pvFinalEffectiveDate', sql.VarChar, catRegister.pvFinalEffectiveDate)
            .input('pvProfilePicPath', sql.VarChar, filename)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute('spSecurity_Users_CRUD_Records')
        console.log(JSON.stringify(insertUserRegister.recordsets[0][0]));
        //borramos el archivo
        try {
            fs.unlinkSync(localPath+filename)
            //file removed
        } catch(err) {
            console.error(err)
        }
        return insertUserRegister.recordsets
    }catch(error){
        console.log(error)
    }*/
}

//Crear los registros de la tabla articulo69b
async function insertArticle69B(catRegister){
    /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
    const uploadPath = `${catRegister.pvFilesPath}`;
    //path of folder where you want to save the image.
    var localPath = `${catRegister.pvFilesPath}`;
    //Find extension of file
    const ext = catRegister.pvFile.substring(catRegister.pvFile.indexOf("/")+1, catRegister.pvFile.indexOf(";base64"));
    console.log("La extension es: "+ext)
    const fileType = catRegister.pvFile.substring("data:".length,catRegister.pvFile.indexOf("/"));
    console.log("El tipo de archivo es: "+fileType)
    //Forming regex to extract base64 data of file.
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    //Extract base64 data.
    const base64Data = catRegister.pvFile.replace(regex, "");
    //Random photo name with timeStamp so it will not overide previous images.
    var filename = `${"Articulo69B"}.${ext}`;
    
    //Check that if directory is present or not.
    if(!fs.existsSync(`${uploadPath}`)) {
        fs.mkdirSync(`${uploadPath}`);
    }
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath);
    }
    fs.writeFileSync(localPath+filename, base64Data, 'base64');
    
    //Hacemos la llamada al SP
    /*try{
        let pool = await sql.connect(config);
        let insertUserRegister = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, catRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.Int, catRegister.piIdCustomer)
            .input('pvIdUser', sql.VarChar, catRegister.pvIdUser)
            .input('pvIdRole', sql.VarChar, catRegister.pvIdRole)
            .input('pvPassword', sql.VarChar, sha256(catRegister.pvPassword))
            .input('pvName', sql.VarChar, catRegister.pvName)
            .input('pbTempPassword', sql.Bit, catRegister.pbTempPassword)
            .input('pvFinalEffectiveDate', sql.VarChar, catRegister.pvFinalEffectiveDate)
            .input('pvProfilePicPath', sql.VarChar, filename)
            .input('pbStatus', sql.Bit, catRegister.pbStatus)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIP', sql.VarChar, catRegister.pvIP)
            .execute('spSecurity_Users_CRUD_Records')
        console.log(JSON.stringify(insertUserRegister.recordsets[0][0]));
        //borramos el archivo
        try {
            fs.unlinkSync(localPath+filename)
            //file removed
        } catch(err) {
            console.error(err)
        }
        return insertUserRegister.recordsets
    }catch(error){
        console.log(error)
    }*/
}

module.exports = {
    getArticle69 : getArticle69,
    getArticle69B : getArticle69B,
    insertArticle69 : insertArticle69,
    insertArticle69B : insertArticle69B,
}