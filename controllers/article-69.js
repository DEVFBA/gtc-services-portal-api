var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var fs = require('fs');
var XLSX = require('xlsx')
var stringify = require('csv-stringify');
const { convertArrayToCSV } = require('convert-array-to-csv');
const csvtojsonV2=require("csvtojson");
const csv=require('csvtojson')
const axios = require('axios');
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

//Para obtener todos los registros del Articulo externamente
async function getArticle69External(params){
  const data = {
    text: params.pvPassword
  }
  const res = await axios.post("http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5", data)
  var pass = res.data

  var idCustomer = Number(params.piIdCustomer)
  var idApplication = Number(params.pIdApplication)
  try{
      let pool = await sql.connect(config);
      let userLogin = await pool.request()
          .input('pvOptionCRUD', sql.VarChar, "VA")
          .input('piIdCustomer', sql.Int, idCustomer)
          .input('pIdApplication', sql.SmallInt, idApplication)
          .input('pvIdUser', sql.VarChar, params.pvIdUser)
          .input('pvPassword', sql.VarChar, pass)
          .execute('spCustomer_Application_Users_CRUD_Records')
      console.log(JSON.stringify(userLogin.recordsets[0][0]));
      if(userLogin.recordsets[0][0].Code_Type=="Error")
      {
        const regreso = {
          mensaje: userLogin.recordsets[0][0].Code_Message_User
        }
        const response = [regreso]
        return response
      }
      else{
        //return userLogin.recordsets
        try{
          let pool = await sql.connect(config);
          let routes = await pool.request()
              .input('pvOptionCRUD', sql.VarChar, "R")
              .execute('spSAT_Article_69_Load_Records')
          return routes.recordsets
        }catch(error){
            console.log(error)
        }
      }
      //console.log(token)
  }catch(error){
      console.log(error)
  }
}

//Para obtener todos los registros del Articulo 69 B externamente
async function getArticle69BExternal(params){
  const data = {
    text: params.pvPassword
  }
  const res = await axios.post("http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5", data)
  var pass = res.data

  var idCustomer = Number(params.piIdCustomer)
  var idApplication = Number(params.pIdApplication)
  try{
      let pool = await sql.connect(config);
      let userLogin = await pool.request()
          .input('pvOptionCRUD', sql.VarChar, "VA")
          .input('piIdCustomer', sql.Int, idCustomer)
          .input('pIdApplication', sql.SmallInt, idApplication)
          .input('pvIdUser', sql.VarChar, params.pvIdUser)
          .input('pvPassword', sql.VarChar, pass)
          .execute('spCustomer_Application_Users_CRUD_Records')
      console.log(JSON.stringify(userLogin.recordsets[0][0]));
      if(userLogin.recordsets[0][0].Code_Type=="Error")
      {
        const regreso = {
          mensaje: userLogin.recordsets[0][0].Code_Message_User
        }
        const response = [regreso]
        return response
      }
      else{
        //return userLogin.recordsets
        try{
          let pool = await sql.connect(config);
          let routes = await pool.request()
              .input('pvOptionCRUD', sql.VarChar, "R")
              .execute('spSAT_Article_69B_Load_Records')
          return routes.recordsets
        }catch(error){
            console.log(error)
        }
      }
      //console.log(token)
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
    //console.log("La extension es: "+ext)
    const fileType = catRegister.pvFile.substring("data:".length,catRegister.pvFile.indexOf("/"));
    //console.log("El tipo de archivo es: "+fileType)
    //Forming regex to extract base64 data of file.
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    //Extract base64 data.
    const base64Data = catRegister.pvFile.replace(regex, "");
    //Random photo name with timeStamp so it will not overide previous images.
    var filename = `${"Articulo69_"+catRegister.pvIdAssumption}.${"csv"}`;
    
    //Check that if directory is present or not.
    if(!fs.existsSync(`${uploadPath}`)) {
        fs.mkdirSync(`${uploadPath}`);
    }
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath);
    }
    fs.writeFileSync(localPath+filename, base64Data, 'base64');

    //Una vez que tenemos el archivo en la carpeta del servidor vamos a trabajar en ella
    

    
    //let file = fs.readFileSync(localPath+filename, 'utf-8');
    //console.log(file)
    var config = {
        type: 'array',
        cellDates: true,
        WTF: false,
        cellStyles: true,
        dateNF : 'dd/mm/yy',
        cellINF: true
    }
    var workbook = XLSX.readFile(localPath+filename, config);
    var sheet_name_list = workbook.SheetNames;
    sheet_name_list.forEach(function(y) {
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var tt = 0;
            for (var i = 0; i < z.length; i++) {
                if (!isNaN(z[i])) {
                    tt = i;
                    break;
                }
            };
            var col = z.substring(0,tt);
            var row = parseInt(z.substring(tt));
            var value = worksheet[z].v;

            //store header names
            if(row == 1 && value) {
                headers[col] = value;
                continue;
            }

            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();

        var date;
        var month;
        var year;
        var fecha = "";
        for(var i=0; i< data.length; i++)
        {
          date = data[i]["FECHAS DE PRIMERA PUBLICACION"].getDate()
          month = data[i]["FECHAS DE PRIMERA PUBLICACION"].getMonth()
          year = data[i]["FECHAS DE PRIMERA PUBLICACION"].getFullYear()

          if(month < 10 && date < 10)
          {
            fecha = "0" + date + "/0" + (month+1) + "/" + year;  
          }
          else if(date < 10)
          {
            fecha = "0" + date + "/" + (month+1) + "/" + year;
          }
          else if(month < 10) 
          {  
            fecha = "" + date + "/0" + (month+1) + "/" + year;
          }
          else{
            fecha = "" + date + "/" + (month+1) + "/" + year;
          }
          data[i]["FECHAS DE PRIMERA PUBLICACION"] = fecha

          //Reemplazar comas y comillas
          var rS1 = data[i]["RAZÓN SOCIAL"]
          var rS2 = rS1.replace(/,/g, '');
          var rS3 = rS2.replace(/"/g, '');
          data[i]["RAZÓN SOCIAL"] = rS3

          var eF = data[i]["ENTIDAD FEDERATIVA"]
          var eF2 = eF.replace(/,/g, '');
          var eF3 = eF2.replace(/"/g, '');
          data[i]["ENTIDAD FEDERATIVA"] = eF3
        }
        
        const csvFromArrayOfObjects = convertArrayToCSV(data);
        //console.log(csvFromArrayOfObjects)
        fs.writeFileSync(localPath+filename, csvFromArrayOfObjects, 'utf-8');
    });
    
    //Hacemos la llamada al SP

    try{
        let pool = await sql.connect(config);
        let insert69 = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "L")
            .input('piIdCustomer', sql.Int, catRegister.piIdCustomer)
            .input('pvUser', sql.VarChar, catRegister.pvUser)
            .input('pvIdAssumption', sql.VarChar, catRegister.pvIdAssumption)
            .input('pvFileName', sql.VarChar, filename)
            .execute('spSAT_Article_69_Load_Records')
        console.log(JSON.stringify(insert69.recordsets[0][0]));
        //borramos el archivo
        try {
            fs.unlinkSync(localPath+filename)
            //file removed
        } catch(err) {
            console.error(err)
        }
        return insert69.recordsets
    }catch(error){
        console.log(error)
    }
}

//Crear los registros de la tabla articulo69b
async function insertArticle69B(catRegister){
    /*path of the folder where your project is saved. (In my case i got it from config file, root path of project).*/
    const uploadPath = `${catRegister.pvFilesPath}`;
    //path of folder where you want to save the image.
    var localPath = `${catRegister.pvFilesPath}`;
    //Find extension of file
    const ext = catRegister.pvFile.substring(catRegister.pvFile.indexOf("/")+1, catRegister.pvFile.indexOf(";base64"));
    //console.log("La extension es: "+ext)
    const fileType = catRegister.pvFile.substring("data:".length,catRegister.pvFile.indexOf("/"));
    //console.log("El tipo de archivo es: "+fileType)
    //Forming regex to extract base64 data of file.
    const regex = new RegExp(`^data:${fileType}\/${ext};base64,`, 'gi');
    //Extract base64 data.
    const base64Data = catRegister.pvFile.replace(regex, "");
    //Random photo name with timeStamp so it will not overide previous images.
    var filename = `${"Articulo69_B"}.${"csv"}`;
    
    //Check that if directory is present or not.
    if(!fs.existsSync(`${uploadPath}`)) {
        fs.mkdirSync(`${uploadPath}`);
    }
    if (!fs.existsSync(localPath)) {
        fs.mkdirSync(localPath);
    }
    fs.writeFileSync(localPath+filename, base64Data, 'base64');

    //Una vez que tenemos el archivo en la carpeta del servidor vamos a trabajar en ella
    

    
    //let file = fs.readFileSync(localPath+filename, 'utf-8');
    //console.log(file)
    /*var config = {
        type: 'array',
        cellDates: true,
        WTF: false,
        cellStyles: true,
        dateNF : 'dd/mm/yy',
        cellINF: true,
        sheets:3
    }
    var workbook = XLSX.readFile(localPath+filename);
    var sheet_name_list = workbook.SheetNames;
    var data = XLSX.utils.sheet_to_json(workbook.Sheets.Sheet1, {range:2})
    console.log(data.length)
    var date;
        var month;
        var year;
        var fecha = "";

        var date2;
        var month2;
        var year2;
        var fecha2 = "";

        var date3;
        var month3;
        var year3;
        var fecha3 = "";

        var date4;
        var month4;
        var year4;
        var fecha4 = "";

        var date5;
        var month5;
        var year5;
        var fecha5 = "";

        var date6;
        var month6;
        var year6;
        var fecha6 = "";

        var date7;
        var month7;
        var year7;
        var fecha7 = "";

        var date8;
        var month8;
        var year8;
        var fecha8 = "";
        for(var i=0; i< data.length; i++)
        {
          date = data[i]["Publicación página SAT presuntos"].getDate()
          month = data[i]["Publicación página SAT presuntos"].getMonth()
          year = data[i]["Publicación página SAT presuntos"].getFullYear()

          if(month < 10 && date < 10)
          {
            fecha = "0" + date + "/0" + (month+1) + "/" + year;  
          }
          else if(date < 10)
          {
            fecha = "0" + date + "/" + (month+1) + "/" + year;
          }
          else if(month < 10) 
          {  
            fecha = "" + date + "/0" + (month+1) + "/" + year;
          }
          else{
            fecha = "" + date + "/" + (month+1) + "/" + year;
          }
          data[i]["Publicación página SAT presuntos"] = fecha

          date2 = data[i]["Publicación DOF presuntos"].getDate()
          month2 = data[i]["Publicación DOF presuntos"].getMonth()
          year2 = data[i]["Publicación DOF presuntos"].getFullYear()

          if(month2 < 10 && date2 < 10)
          {
            fecha2 = "0" + date2 + "/0" + (month2+1) + "/" + year2;  
          }
          else if(date2 < 10)
          {
            fecha2 = "0" + date2 + "/" + (month2+1) + "/" + year2;
          }
          else if(month2 < 10) 
          {  
            fecha2 = "" + date2 + "/0" + (month2+1) + "/" + year2;
          }
          else{
            fecha2 = "" + date2 + "/" + (month2+1) + "/" + year2;
          }
          data[i]["Publicación DOF presuntos"] = fecha2

          date3 = data[i]["Publicación página SAT desvirtuados"].getDate()
          month3 = data[i]["Publicación página SAT desvirtuados"].getMonth()
          year3 = data[i]["Publicación página SAT desvirtuados"].getFullYear()

          if(month3 < 10 && date3 < 10)
          {
            fecha3 = "0" + date3 + "/0" + (month3+1) + "/" + year3;  
          }
          else if(date3 < 10)
          {
            fecha3 = "0" + date3 + "/" + (month3+1) + "/" + year3;
          }
          else if(month3 < 10) 
          {  
            fecha3 = "" + date3 + "/0" + (month3+1) + "/" + year3;
          }
          else{
            fecha3 = "" + date3 + "/" + (month3+1) + "/" + year3;
          }
          data[i]["Publicación página SAT desvirtuados"] = fecha3

          date4 = data[i]["Publicación DOF desvirtuados"].getDate()
          month4 = data[i]["Publicación DOF desvirtuados"].getMonth()
          year4 = data[i]["Publicación DOF desvirtuados"].getFullYear()

          if(month4 < 10 && date4 < 10)
          {
            fecha4 = "0" + date4 + "/0" + (month4+1) + "/" + year4;  
          }
          else if(date4 < 10)
          {
            fecha4 = "0" + date4 + "/" + (month4+1) + "/" + year4;
          }
          else if(month4 < 10) 
          {  
            fecha4 = "" + date4 + "/0" + (month4+1) + "/" + year4;
          }
          else{
            fecha4 = "" + date4 + "/" + (month4+1) + "/" + year4;
          }
          data[i]["Publicación DOF desvirtuados"] = fecha4

          date5 = data[i]["Publicación página SAT definitivos"].getDate()
          month5 = data[i]["Publicación página SAT definitivos"].getMonth()
          year5 = data[i]["Publicación página SAT definitivos"].getFullYear()

          if(month5 < 10 && date5 < 10)
          {
            fecha5 = "0" + date5 + "/0" + (month5+1) + "/" + year5;  
          }
          else if(date5 < 10)
          {
            fecha5 = "0" + date5 + "/" + (month5+1) + "/" + year5;
          }
          else if(month5 < 10) 
          {  
            fecha5 = "" + date5 + "/0" + (month5+1) + "/" + year5;
          }
          else{
            fecha5 = "" + date5 + "/" + (month5+1) + "/" + year5;
          }
          data[i]["Publicación página SAT definitivos"] = fecha5

          date6 = data[i]["Publicación DOF definitivos"].getDate()
          month6 = data[i]["Publicación DOF definitivos"].getMonth()
          year6 = data[i]["Publicación DOF definitivos"].getFullYear()

          if(month6 < 10 && date6 < 10)
          {
            fecha6 = "0" + date6 + "/0" + (month6+1) + "/" + year6;  
          }
          else if(date6 < 10)
          {
            fecha6 = "0" + date6 + "/" + (month6+1) + "/" + year6;
          }
          else if(month6 < 10) 
          {  
            fecha6 = "" + date6 + "/0" + (month6+1) + "/" + year6;
          }
          else{
            fecha6 = "" + date6 + "/" + (month6+1) + "/" + year6;
          }
          data[i]["Publicación DOF definitivos"] = fecha6

          date7 = data[i]["Publicación página SAT sentencia favorable"].getDate()
          month7 = data[i]["Publicación página SAT sentencia favorable"].getMonth()
          year7 = data[i]["Publicación página SAT sentencia favorable"].getFullYear()

          if(month7 < 10 && date7 < 10)
          {
            fecha7 = "0" + date7 + "/0" + (month7+1) + "/" + year7;  
          }
          else if(date7 < 10)
          {
            fecha7 = "0" + date7 + "/" + (month7+1) + "/" + year7;
          }
          else if(month7 < 10) 
          {  
            fecha7 = "" + date7 + "/0" + (month7+1) + "/" + year7;
          }
          else{
            fecha7 = "" + date7 + "/" + (month7+1) + "/" + year7;
          }
          data[i]["Publicación página SAT sentencia favorable"] = fecha7

          date8 = data[i]["Publicación página SAT sentencia favorable"].getDate()
          month8 = data[i]["Publicación página SAT sentencia favorable"].getMonth()
          year8 = data[i]["Publicación página SAT sentencia favorable"].getFullYear()

          if(month8 < 10 && date8 < 10)
          {
            fecha8 = "0" + date8 + "/0" + (month8+1) + "/" + year8;  
          }
          else if(date8 < 10)
          {
            fecha8 = "0" + date8 + "/" + (month8+1) + "/" + year8;
          }
          else if(month8 < 10) 
          {  
            fecha8 = "" + date8 + "/0" + (month8+1) + "/" + year8;
          }
          else{
            fecha8 = "" + date8 + "/" + (month8+1) + "/" + year8;
          }
          data[i]["Publicación página SAT sentencia favorable"] = fecha8

          //Reemplazar comas y comillas
          if(i<11560 && i>11550)
          {
            console.log(data[i])
          }

          
         //console.log(data[i]['Nombre del Contribuyente'])
          var rS1 = data[i]['Nombre del Contribuyente'].toString()
          //console.log(rS1)
          var rS2 = rS1.replace(/,/g, '');
          var rS3 = rS2.replace(/"/g, '');
          //console.log(rS3)
          data[i]['Nombre del Contribuyente'] = rS3
        }
        //console.log(data)
        const csvFromArrayOfObjects = convertArrayToCSV(data);
        //console.log(csvFromArrayOfObjects)
        fs.writeFileSync(localPath+filename, csvFromArrayOfObjects, 'utf-8');*/
        const options = {
          noheader: true,
          headers: ["Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header"]
        }
        const jsonArray=await csv().fromFile(localPath+filename, options);
        
        for(var i=0; i< jsonArray.length; i++)
        {
          delete jsonArray[i]['Informaci�n actualizada al 17 de septiembre de 2021']
          if(i<10)
          {
            ///console.log(jsonArray[i])
          }
        }
        jsonArray.shift();
        console.log(jsonArray[0])
        //jsonArray.shift();
        const csvFromArrayOfObjects = convertArrayToCSV(jsonArray);
        //console.log(csvFromArrayOfObjects)
        fs.writeFileSync(localPath+filename, csvFromArrayOfObjects, 'utf-8');
        //console.log(jsonArray)
}

module.exports = {
    getArticle69 : getArticle69,
    getArticle69B : getArticle69B,
    insertArticle69 : insertArticle69,
    insertArticle69B : insertArticle69B,
    getArticle69External: getArticle69External,
    getArticle69BExternal: getArticle69BExternal
}