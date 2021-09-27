var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
const publicIp = require('public-ip');

var fs = require('fs');

async function getCustomers(params){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, params.pvOptionCRUD)
            .execute('spCustomers_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear un cliente
async function insertCustomerRegister(userRegister){
    
    const ip = await publicIp.v4();
    var localPath=""
    var filename = ""

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvLogo !== "")
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath = `${userRegister.pathLogo}`;
        //path of folder where you want to save the image.
        localPath = `${userRegister.pathLogo}`;
        //Find extension of file
        const ext = userRegister.pvLogo.substring(userRegister.pvLogo.indexOf("/")+1, userRegister.pvLogo.indexOf(";base64"));
        const fileType = userRegister.pvLogo.substring("data:".length,userRegister.pvLogo.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvLogo.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        filename = `${userRegister.pvIdCountry}${userRegister.pvTaxId}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath
    }
    

    try{
        let pool = await sql.connect(config);
        let insertCustomer = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
            .input('pvIdCountry', sql.VarChar, userRegister.pvIdCountry)
            .input('pvName', sql.VarChar, userRegister.pvName)
            .input('pvTaxId', sql.VarChar, userRegister.pvTaxId)
            .input('pvStreet', sql.VarChar, userRegister.pvStreet)
            .input('pvExtNumber', sql.VarChar, userRegister.pvExtNumber)
            .input('pvIntNumber', sql.VarChar, userRegister.pvIntNumber)
            .input('pvCity', sql.VarChar, userRegister.pvCity)
            .input('pvZipCode', sql.VarChar, userRegister.pvZipCode)
            .input('pvContactPerson', sql.VarChar, userRegister.pvContactPerson)
            .input('pvPhone1', sql.VarChar, userRegister.pvPhone1)
            .input('pvPhone2', sql.VarChar, userRegister.pvPhone2)
            .input('pvWebPage', sql.VarChar, userRegister.pvWebPage)
            .input('pvLogo', sql.VarChar, localPath+filename)
            .input('pbStatus', sql.Bit, userRegister.pbStatus)
            .input('pvIP', sql.VarChar, ip)
            .execute('spCustomers_CRUD_Records')
        console.log(JSON.stringify(insertCustomer.recordsets[0][0])); 
        return insertCustomer.recordsets
    }catch(error){
        console.log(error)
    }
}

//Actualizar un cliente
async function updateCustomerRegister(userRegister){
    
    const ip = await publicIp.v4();
    var localPath=""
    var filename = ``

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvLogo !== "")
    {
        /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
        const uploadPath =  `${userRegister.pathLogo}`;
        //path of folder where you want to save the image.
        localPath =  `${userRegister.pathLogo}`;
        //Find extension of file
        const ext = userRegister.pvLogo.substring(userRegister.pvLogo.indexOf("/")+1, userRegister.pvLogo.indexOf(";base64"));
        const fileType = userRegister.pvLogo.substring("data:".length,userRegister.pvLogo.indexOf("/"));
        //Forming regex to extract base64 data of file.
        const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
        //Extract base64 data.
        const base64Data = userRegister.pvLogo.replace(regex, "");
        const rand = Math.ceil(Math.random()*1000);
        //Random photo name with timeStamp so it will not overide previous images.
        filename = `${userRegister.pvIdCountry}${userRegister.pvTaxId}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath};
    }
    
    console.log(localPath+filename)
    try{
        let pool = await sql.connect(config);
        let updateCustomer = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
            .input('piIdCustomer', sql.VarChar, userRegister.piIdCustomer)
            .input('pvIdCountry', sql.VarChar, userRegister.pvIdCountry)
            .input('pvName', sql.VarChar, userRegister.pvName)
            .input('pvTaxId', sql.VarChar, userRegister.pvTaxId)
            .input('pvStreet', sql.VarChar, userRegister.pvStreet)
            .input('pvExtNumber', sql.VarChar, userRegister.pvExtNumber)
            .input('pvIntNumber', sql.VarChar, userRegister.pvIntNumber)
            .input('pvCity', sql.VarChar, userRegister.pvCity)
            .input('pvZipCode', sql.VarChar, userRegister.pvZipCode)
            .input('pvContactPerson', sql.VarChar, userRegister.pvContactPerson)
            .input('pvPhone1', sql.VarChar, userRegister.pvPhone1)
            .input('pvPhone2', sql.VarChar, userRegister.pvPhone2)
            .input('pvWebPage', sql.VarChar, userRegister.pvWebPage)
            .input('pvLogo', sql.VarChar, localPath+filename)
            .input('pbStatus', sql.Bit, userRegister.pbStatus)
            .input('pvIP', sql.VarChar, ip)
            .execute('spCustomers_CRUD_Records')
        console.log(JSON.stringify(updateCustomer.recordsets[0][0])); 
        return updateCustomer.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getCustomers : getCustomers,
    insertCustomerRegister : insertCustomerRegister,
    updateCustomerRegister : updateCustomerRegister
}