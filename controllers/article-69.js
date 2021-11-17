var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var fs = require('fs');
var XLSX = require('xlsx')
const csv=require('csvtojson')
const axios = require('axios');
var jwt = require('jsonwebtoken');
var config2 = require('../configs/config');
const { convertArrayToCSV } = require('convert-array-to-csv');

//Para obtener todos los registros del Articulo 69
async function getArticle69(params){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .input('pvIdAssumption', sql.VarChar, params.pvIdAssumption)
            .execute('spSAT_Article_69_Load_Records')
        return routes.recordsets
    }catch(error){
        console.log(error)
    }
}

//Para obtener todos los registros del Articulo externamente
async function login(req){
  const data = {
    text: req.pvPassword
  }
  const res = await axios.post("http://129.159.99.152/GTC_DEV/api/Hash/EncryptMD5", data)
  var pass = res.data

  var idCustomer = Number(req.piIdCustomer)
  var idApplication = Number(req.pIdApplication)
  try{
      let pool = await sql.connect(config);
      let userLogin = await pool.request()
          .input('pvOptionCRUD', sql.VarChar, "VA")
          .input('piIdCustomer', sql.Int, idCustomer)
          .input('pIdApplication', sql.SmallInt, idApplication)
          .input('pvIdUser', sql.VarChar, req.pvIdUser)
          .input('pvPassword', sql.VarChar, pass)
          .execute('spCustomer_Application_Users_CRUD_Records')
      console.log(JSON.stringify(userLogin.recordsets[0][0]));
      if(userLogin.recordsets[0][0].Code_Type=="Error")
      {
        const regreso = {
          error: {
            code: userLogin.recordsets[0][0].Code,
            idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
            mensaje: userLogin.recordsets[0][0].Code_Message_User
          } 
        }
        const response = [regreso]
        return response
      }
      else{
        var expiration = await config2.getExpiration69()
        var secret = await config2.getSecret69()

        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + parseInt(expiration, 10)); // 1 día antes de expirar
        const token = jwt.sign({
          id: req.pvIdUser,
          username: req.pvPassword,
          exp: parseInt(exp.getTime() / 1000),
        }, secret);

        const regreso = {
          mensaje: userLogin.recordsets[0][0].Code_Message_User,
          token: token
        }
        const response = [regreso]
        return response
      }
      //console.log(token)
  }catch(error){
      console.log(error)
  }
}

//Para obtener todos los registros del Articulo externamente
async function getArticle69External(){
  try{
    let pool = await sql.connect(config);
    let routes = await pool.request()
        .input('pvOptionCRUD', sql.VarChar, "R")
        .execute('spSAT_Article_69_Load_Records')

        if(routes.recordsets[0][0].Code_Type=="Error" || routes.recordsets[0][0].Code_Type=="Warning")
        {
          const regreso = {
            error: {
              code: userLogin.recordsets[0][0].Code,
              idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
              mensaje: userLogin.recordsets[0][0].Code_Message_User
            } 
          }
          const response = [regreso]
          return response
        }
        else {
          var aux = []
          for(var i=0; i< routes.recordsets[0].length; i++)
          {
            aux[i] = {
              RFC: routes.recordsets[0][i].RFC,
              Razon_Social: routes.recordsets[0][i].Razon_Social,
              Tipo_Persona: routes.recordsets[0][i].Tipo_Persona,
              Supuesto: routes.recordsets[0][i].Supuesto,
              Fecha_Publicacion: routes.recordsets[0][i].Fecha_Publicacion,
              Entidad_Federativa: routes.recordsets[0][i].Entidad_Federativa
            }
          }
          const regreso = {
            data: aux
          }
          const response = [regreso]
          return response
        }
    //return routes.recordsets
  }catch(error){
      console.log(error)
  }
}

//Para obtener todos los registros del Articulo 69 B externamente
async function getArticle69BExternal(){
  try{
    let pool = await sql.connect(config);
    let routes = await pool.request()
        .input('pvOptionCRUD', sql.VarChar, "R")
        .execute('spSAT_Article_69B_Load_Records')
        if(routes.recordsets[0][0].Code_Type=="Error" || routes.recordsets[0][0].Code_Type=="Warning")
        {
          const regreso = {
            error: {
              code: userLogin.recordsets[0][0].Code,
              idTransacLog: userLogin.recordsets[0][0].IdTransacLog,
              mensaje: userLogin.recordsets[0][0].Code_Message_User
            } 
          }
          const response = [regreso]
          return response
        }
        else {
          var aux = []
          for(var i=0; i< routes.recordsets[0].length; i++)
          {
            delete routes.recordsets[0][i].Register_Date
            delete routes.recordsets[0][i].Version_Load
          }
          const regreso = {
            data: routes.recordsets[0]
          }
          const response = [regreso]
          return response
        }
  }catch(error){
      console.log(error)
  }
}

//Para obtener todos los registros del Articulo 69 B
async function getArticle69B(){
    try{
        let pool = await sql.connect(config);
        let routes = await pool.request()
            .input('pvOptionCRUD', sql.VarChar, "R")
            .execute("spSAT_Article_69B_Load_Records")
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

    const data = fs.readFileSync(localPath+filename, {encoding:'latin1'});

    const jsonArray=await csv().fromString(data.toString());
    for(var i=0; i< jsonArray.length; i++)
      {
        delete jsonArray[i]['Información actualizada al 17 de septiembre de 2021']

        var rS1 = jsonArray[i]['field3'].toString()
        //console.log(rS1)
        var rS2 = rS1.replace(/,/g, '');
        var rS3 = rS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field3'] = rS3

        var aS1 = jsonArray[i]['field4'].toString()
        //console.log(rS1)
        var aS2 = aS1.replace(/,/g, '');
        var aS3 = aS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field4'] = aS3

        var bS1 = jsonArray[i]['field5'].toString()
        //console.log(rS1)
        var bS2 = bS1.replace(/,/g, '');
        var bS3 = bS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field5'] = bS3

        var cS1 = jsonArray[i]['field6'].toString()
        //console.log(rS1)
        var cS2 = cS1.replace(/,/g, '');
        var cS3 = cS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field6'] = cS3

        var dS1 = jsonArray[i]['field7'].toString()
        //console.log(rS1)
        var dS2 = dS1.replace(/,/g, '');
        var dS3 = dS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field7'] = dS3

        var eS1 = jsonArray[i]['field8'].toString()
        //console.log(rS1)
        var eS2 = eS1.replace(/,/g, '');
        var eS3 = eS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field8'] = eS3

        var fS1 = jsonArray[i]['field9'].toString()
        //console.log(rS1)
        var fS2 = fS1.replace(/,/g, '');
        var fS3 = fS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field9'] = fS3

        var gS1 = jsonArray[i]['field10'].toString()
        //console.log(rS1)
        var gS2 = gS1.replace(/,/g, '');
        var gS3 = gS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field10'] = gS3

        var hS1 = jsonArray[i]['field11'].toString()
        //console.log(rS1)
        var hS2 = hS1.replace(/,/g, '');
        var hS3 = hS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field11'] = hS3

        var iS1 = jsonArray[i]['field12'].toString()
        //console.log(rS1)
        var iS2 = iS1.replace(/,/g, '');
        var iS3 = iS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field12'] = hS3

        var jS1 = jsonArray[i]['field13'].toString()
        //console.log(rS1)
        var jS2 = jS1.replace(/,/g, '');
        var jS3 = jS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field13'] = jS3

        var kS1 = jsonArray[i]['field14'].toString()
        //console.log(rS1)
        var kS2 = kS1.replace(/,/g, '');
        var kS3 = kS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field14'] = kS3

        var lS1 = jsonArray[i]['field15'].toString()
        //console.log(rS1)
        var lS2 = lS1.replace(/,/g, '');
        var lS3 = lS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field15'] = lS3

        var mS1 = jsonArray[i]['field16'].toString()
        //console.log(rS1)
        var mS2 = mS1.replace(/,/g, '');
        var mS3 = mS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field16'] = mS3

        var nS1 = jsonArray[i]['field17'].toString()
        //console.log(rS1)
        var nS2 = nS1.replace(/,/g, '');
        var nS3 = nS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field17'] = nS3

        var oS1 = jsonArray[i]['field18'].toString()
        //console.log(rS1)
        var oS2 = oS1.replace(/,/g, '');
        var oS3 = oS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field18'] = oS3

        var pS1 = jsonArray[i]['field19'].toString()
        //console.log(rS1)
        var pS2 = pS1.replace(/,/g, '');
        var pS3 = pS2.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field19'] = pS3

        var qS1 = jsonArray[i]['field20'].toString()
        var qS2 = qS1.replace(/"/g, '');
        //console.log(rS3)
        jsonArray[i]['field20'] = qS2
      }

    jsonArray.shift();
    const csvFromArrayOfObjects = convertArrayToCSV(jsonArray);
    fs.writeFileSync(localPath+filename, csvFromArrayOfObjects, 'utf-8');

    //Hacemos la llamada al SP
    try{
      let pool = await sql.connect(config);
      let insert69B = await pool.request()
          .input('pvOptionCRUD', sql.VarChar, "L")
          .input('piIdCustomer', sql.Int, catRegister.piIdCustomer)
          .input('pvUser', sql.VarChar, catRegister.pvUser)
          .input('pvFileName', sql.VarChar, filename)
          .execute('spSAT_Article_69B_Load_Records')
      console.log(JSON.stringify(insert69B.recordsets[0][0]));
      //borramos el archivo
      try {
          fs.unlinkSync(localPath+filename)
          //file removed
      } catch(err) {
          console.error(err)
      }
      return insert69B.recordsets
    }catch(error){
        console.log(error)
    }
}

module.exports = {
    getArticle69 : getArticle69,
    getArticle69B : getArticle69B,
    insertArticle69 : insertArticle69,
    insertArticle69B : insertArticle69B,
    getArticle69External: getArticle69External,
    getArticle69BExternal: getArticle69BExternal,
    login: login
}