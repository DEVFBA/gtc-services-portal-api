var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql

var fs = require('fs');

const logger = require('../utils/logger');

const {
    execStoredProcedure
} =  require('../utils/mssql-database');

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

async function getCustomerById(id){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('piIdCustomer', sql.VarChar, id)
            .execute('spCustomers_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomer(name){
    try{
        let pool = await sql.connect(config);
        let customers = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvName', sql.VarChar, name)
            .execute('spCustomers_CRUD_Records')
        return customers.recordsets
    }catch(error){
        console.log(error)
    }
}

async function getCustomerByTaxId(taxId, country){

    try{

        const sqlParams = [
            {
                name: 'pvOptionCRUD',
                type: sql.VarChar(1),
                value: 'R'
            }
        ]

        logger.info('***Función getCustomerByTaxId***' );
        logger.info('***Recuperando el ID del Cliente del RFC ' + taxId + '.***' );

        let customers = await execStoredProcedure( 'spCustomers_CRUD_Records', sqlParams );

        const taxIdCustomers = customers[0].filter((customer) => {
            return (customer.Tax_Id === taxId && customer.Id_Country === country);
        });

        const taxIdCustomerId = taxIdCustomers[0].Id_Customer;

        logger.info('El Customer Id para el RFC es: ' + taxIdCustomerId );
        
        return taxIdCustomerId;

    }catch(error){

        console.log(error);
        logger.error('Error en función getCustomerByTaxId.');

        return false;

    }

}

// Get Customer Name
async function getCustomerName(idCustomer){

    try{

        let pool = await sql.connect(config);

        let customerData = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('piIdCustomer', sql.VarChar, idCustomer)
            .execute('spCustomers_CRUD_Records');

        let name = ''

        customerData.recordsets[0][0]? name = customerData.recordsets[0][0].Name : name = 'Customer Not Found!';

        return name;

    } catch( error ){

        console.log(error);

        return 'Error when retrieving Customer Data';

    }

} 

//Get Full Address
async function getFullAddress(idCustomer){

    try{

        let pool = await sql.connect(config);

        let customerData = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, 'R')
            .input('piIdCustomer', sql.VarChar, idCustomer)
            .execute('spCustomers_CRUD_Records');

        if( customerData.recordsets[0][0] ){

            const street            = customerData.recordsets[0][0].Street;
            const extNumber         = customerData.recordsets[0][0].Ext_Number;
            const intNumber         = customerData.recordsets[0][0].Int_Number;
            const city              = customerData.recordsets[0][0].City;
            const zipCode           = customerData.recordsets[0][0].Zip_Code;
            const country           = customerData.recordsets[0][0].Id_Country;

            const fullAddress       = `${street} ${extNumber} ${intNumber} ${city} C.P: ${zipCode}, ${country}`

            return fullAddress;

        } else {

            return 'Customer Not Found!';

        }

    } catch( error ){

        console.log(error);

        return 'Error when retrieving Customer Data';

    }

} 

//Crear un cliente
async function insertCustomerRegister(userRegister){
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
        var date = new Date();
        var day = date.getDate()
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var name = userRegister.pvIdCountry + userRegister.pvTaxId + day  + month + year + hour + minutes + seconds
        filename =  `${name}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath
        try{
            let pool = await sql.connect(config);
            let insertCustomer = await pool.request()
                .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
                .input('pvIdCountry', sql.VarChar, userRegister.pvIdCountry)
                .input('pvIdTaxRegimen', sql.VarChar, userRegister.pvIdTaxRegimen)
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
                .input('pvLogo', sql.VarChar, filename)
                .input('pbStampingMaster', sql.Bit, 0)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvUser', sql.Bit, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spCustomers_CRUD_Records')
            console.log(JSON.stringify(insertCustomer.recordsets[0][0])); 
            return insertCustomer.recordsets
        }catch(error){
            console.log(error)
        }
    }
    else{
        try{
            let pool = await sql.connect(config);
            let insertCustomer = await pool.request()
                .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
                .input('pvIdCountry', sql.VarChar, userRegister.pvIdCountry)
                .input('pvIdTaxRegimen', sql.VarChar, userRegister.pvIdTaxRegimen)
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
                .input('pbStampingMaster', sql.Bit, 0)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvUser', sql.Bit, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spCustomers_CRUD_Records')
            console.log(JSON.stringify(insertCustomer.recordsets[0][0])); 
            return insertCustomer.recordsets
        }catch(error){
            console.log(error)
        }
    }  
}

//Actualizar un cliente
async function updateCustomerRegister(userRegister){
    var localPath=""
    var filename = ``

    //Si la imagen no viene vacia la guardamos en carpeta
    if(userRegister.pvChangeImage !== false)
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
        var date = new Date();
        var day = date.getDate()
        var month = date.getMonth() + 1
        var year = date.getFullYear()
        var hour = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds()
        var name = userRegister.pvIdCountry + userRegister.pvTaxId + day  + month + year + hour + minutes + seconds
        filename =  `${name}.${ext}`;
        
        //Check that if directory is present or not.
        if(!fs.existsSync(`${uploadPath}`)) {
            fs.mkdirSync(`${uploadPath}`);
        }
        if (!fs.existsSync(localPath)) {
            fs.mkdirSync(localPath);
        }
        fs.writeFileSync(localPath+filename, base64Data, 'base64');
        //return {filename, localPath};

        try{
            let pool = await sql.connect(config);
            let updateCustomer = await pool.request()
                .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
                .input('piIdCustomer', sql.VarChar, userRegister.piIdCustomer)
                .input('pvIdCountry', sql.VarChar, userRegister.pvIdCountry)
                .input('pvIdTaxRegimen', sql.VarChar, userRegister.pvIdTaxRegimen)
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
                .input('pvLogo', sql.VarChar, filename)
                .input('pbStampingMaster', sql.Bit, 0)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvUser', sql.Bit, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spCustomers_CRUD_Records')
            console.log(JSON.stringify(updateCustomer.recordsets[0][0])); 
            return updateCustomer.recordsets
        }catch(error){
            console.log(error)
        }
    }
    else{
        try{
            let pool = await sql.connect(config);
            let updateCustomer = await pool.request()
                .input('pvOptionCRUD', sql.VarChar, userRegister.pvOptionCRUD)
                .input('piIdCustomer', sql.VarChar, userRegister.piIdCustomer)
                .input('pvIdCountry', sql.VarChar, userRegister.pvIdCountry)
                .input('pvIdTaxRegimen', sql.VarChar, userRegister.pvIdTaxRegimen)
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
                .input('pvLogo', sql.VarChar, userRegister.pvLogo)
                .input('pbStampingMaster', sql.Bit, 0)
                .input('pbStatus', sql.Bit, userRegister.pbStatus)
                .input('pvUser', sql.Bit, userRegister.pvUser)
                .input('pvIP', sql.VarChar, userRegister.pvIP)
                .execute('spCustomers_CRUD_Records')
            console.log(JSON.stringify(updateCustomer.recordsets[0][0])); 
            return updateCustomer.recordsets
        }catch(error){
            console.log(error)
        }
    }
    
}

module.exports = {
    getCustomers : getCustomers,
    insertCustomerRegister : insertCustomerRegister,
    updateCustomerRegister : updateCustomerRegister,
    getFullAddress : getFullAddress,
    getCustomerName : getCustomerName,
    getCustomer : getCustomer, 
    getCustomerById : getCustomerById,
    getCustomerByTaxId : getCustomerByTaxId
}