var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
var fs = require('fs');
var XLSX = require('xlsx')
const csv=require('csvtojson')
const axios = require('axios');
var jwt = require('jsonwebtoken');
var config2 = require('../configs/config');
const { convertArrayToCSV } = require('convert-array-to-csv');
let csvToJson = require('convert-csv-to-json');


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
        /*try {
            fs.unlinkSync(localPath+filename)
            //file removed
        } catch(err) {
            console.error(err)
        }*/
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
    console.log(localPath+filename)
    fs.writeFileSync(localPath+filename, base64Data, 'base64');

    //Una vez que tenemos el archivo en la carpeta del servidor vamos a trabajar en ella
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
          if(z !== "A1" || z !== "A2")
          {
              if(z[0] === '!') continue;
              //parse out the column, row, and value
              var tt = 0;
              for (var i = 0; i < z.length; i++) {
                  if (!isNaN(z[i])) {
                      tt = i;
                      break;
                  }
                  //tt=i
              };
              var col = z.substring(0,tt);
              var row = parseInt(z.substring(tt));
              var value = worksheet[z].v;

              //store header names
              if(row == 3 && value) {
                  headers[col] = value;
                  continue;
              }
              //console.log(data[row])
              if(!data[row]) data[row]={};
              data[row][headers[col]] = value;
          }
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        data.shift();
        data.shift();
        
       
      for(var i=0; i< data.length; i++)
      {
        var rfc = data[i]['RFC']

        var nC;
        var rS1 = data[i]['Nombre del Contribuyente'].toString()
        var rS2 = rS1.replace(/,/g, '');
        var rS3 = rS2.replace(/'/g, '');
        nC = rS3;
        //data[i]['Nombre del Contribuyente'] = rS3

        var sC;
        if(data[i]['Situación del contribuyente'] === undefined)
        {
          sC = ' '
        }
        else {
          var aS1 = data[i]['Situación del contribuyente'].toString()
          var aS2 = aS1.replace(/,/g, '');
          var aS3 = aS2.replace(/"/g, '');
          //data[i]['Situación del contribuyente'] = aS3
          sC = aS3
        }  
        
        var nFO;
        if(data[i]['Número y fecha de oficio global de presunción SAT'] === undefined)
        {
          nFO = ' '
        }
        else {
          var bS1 = data[i]['Número y fecha de oficio global de presunción SAT'].toString()
          //console.log(rS1)
          var bS2 = bS1.replace(/,/g, '');
          var bS3 = bS2.replace(/"/g, '');
          //data[i]['Número y fecha de oficio global de presunción SAT'] = bS3
          nFO = bS3
        }
        
        var pPS;
        if(data[i]['Publicación página SAT presuntos'] === undefined)
        {
          pPS = ' '
        }
        else
        {
          
          var cS1 = data[i]['Publicación página SAT presuntos'].toString()
          /*var date = cS1.getDate()
          var month = cS1.getMonth() + 1
          var year = cS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          //console.log(rS1)
          /*var cS2 = cS1.replace(/,/g, '');
          var cS3 = cS2.replace(/"/g, '');
          //console.log(rS3)
          //data[i]['Publicación página SAT presuntos'] = cS3*/
          pPS = cS1;
        } 
       

        var nFG;
        if(data[i]['Número y fecha de oficio global de presunción DOF'] === undefined)
        {
          nFG = ' '
        }
        else
        { 
          var dS1 = data[i]['Número y fecha de oficio global de presunción DOF'].toString()
          //console.log(rS1)
          var dS2 = dS1.replace(/,/g, '');
          var dS3 = dS2.replace(/"/g, '');
          //console.log(rS3)
          //data[i]['Número y fecha de oficio global de presunción DOF'] = dS3
          nFG = dS3
        }
        
        var pDP;
        if(data[i]['Publicación DOF presuntos'] === undefined)
        {
          pDP = ' '
        }
        else
        {
          var eS1 = data[i]['Publicación DOF presuntos']
          /*var date = eS1.getDate()
          var month = eS1.getMonth() + 1
          var year = eS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pDP = eS1
        }
        
        var nFGC;
        if(data[i]['Número y fecha de oficio global de contribuyentes que desvirtuaron SAT'] === undefined)
        {
          nFGC = ' '
        }
        else
        {
          var fS1 = data[i]['Número y fecha de oficio global de contribuyentes que desvirtuaron SAT'].toString()
          //console.log(rS1)
          var fS2 = fS1.replace(/,/g, '');
          var fS3 = fS2.replace(/"/g, '');
          //console.log(rS3)
          //data[i]['Número y fecha de oficio global de definitivos SAT'] = fS3
          nFGC = fS3
        }

        var pPSD;
        if(data[i]['Publicación página SAT desvirtuados'] === undefined)
        {
          pPSD = ' '
        }
        else
        {
          var gS1 = data[i]['Publicación página SAT desvirtuados']
          /*var date = gS1.getDate()
          var month = gS1.getMonth() + 1
          var year = gS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pPSD = gS1;
        }
       
        var nFGCD;
        if(data[i]['Número y fecha de oficio global de contribuyentes que desvirtuaron DOF'] === undefined)
        {
          nFGCD = ' '
        }
        else 
        {
          var hS1 = data[i]['Número y fecha de oficio global de contribuyentes que desvirtuaron DOF'].toString()
          //console.log(rS1)
          var hS2 = hS1.replace(/,/g, '');
          var hS3 = hS2.replace(/"/g, '');
          //console.log(rS3)
          nFGCD = hS3
        }
        
        var pDD;
        if(data[i]['Publicación DOF desvirtuados'] === undefined)
        {
          pDD = ' '
        }  
        else
        {
          var iS1 = data[i]['Publicación DOF desvirtuados']
          /*var date = iS1.getDate()
          var month = iS1.getMonth() + 1
          var year = iS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pDD = iS1;
        }
        
        var nFOG;
        if(data[i]['Número y fecha de oficio global de definitivos SAT'] === undefined)
        {
          nFOG =  ' '
        }  
        else 
        {
          var jS1 = data[i]['Número y fecha de oficio global de definitivos SAT'].toString()
          //console.log(rS1)
          var jS2 = jS1.replace(/,/g, '');
          var jS3 = jS2.replace(/"/g, '');
          //console.log(rS3)
          nFOG = jS3;
        }
        
        var pPSDEF;
        if(data[i]['Publicación página SAT definitivos'] === undefined)
        {
          pPSDEF = ' '
        }
        else 
        {
          var kS1 = data[i]['Publicación página SAT definitivos']
          /*var date = kS1.getDate()
          var month = kS1.getMonth() + 1
          var year = kS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pPSDEF = kS1
        }
       
        var nFOGD;
        if(data[i]['Número y fecha de oficio global de definitivos DOF'] === undefined)
        {
          nFOGD = ' '
        }
        else
        {
          var lS1 = data[i]['Número y fecha de oficio global de definitivos DOF'].toString()
          //console.log(rS1)
          var lS2 = lS1.replace(/,/g, '');
          var lS3 = lS2.replace(/"/g, '');
          nFOGD = lS3;
        }
        
        var pDDEF;
        if(data[i]['Publicación DOF definitivos'] === undefined)
        {
          pDDEF = ' '
        }
        else
        {
          var mS1 = data[i]['Publicación DOF definitivos']
          /*var date = mS1.getDate()
          var month = mS1.getMonth() + 1
          var year = mS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pDDEF = mS1;
        }

        var nFOGS;
        if(data[i]['Número y fecha de oficio global de sentencia favorable SAT'] === undefined)
        {
          nFOGS = ' '
        }
        else 
        {
          var nS1 = data[i]['Número y fecha de oficio global de sentencia favorable SAT'].toString()
          //console.log(rS1)
          var nS2 = nS1.replace(/,/g, '');
          var nS3 = nS2.replace(/"/g, '');
          nFOGS = nS3;
        }

        var pPSS;
        if(data[i]['Publicación página SAT sentencia favorable'] === undefined)
        {
          pPSS = ' '
        }
        else 
        {
          
          var oS1 = data[i]['Publicación página SAT sentencia favorable']
          //var date = oS1.getDate()
          //var month = oS1.getMonth() + 1
          //var year = oS1.getFullYear()
          //var finalDate2 = ""

          /*if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pPSS = oS1
        }
        
        var nFOGSF;
        if(data[i]['Número y fecha de oficio global de sentencia favorable DOF'] === undefined)
        {
          nFOGSF = ' '
        }
        else 
        {
          var pS1 = data[i]['Número y fecha de oficio global de sentencia favorable DOF'].toString()
          var pS2 = pS1.replace(/,/g, '');
          var pS3 = pS2.replace(/"/g, '');
          nFOGSF = pS3
        }
       
        var pDSF;
        if(data[i]['Publicación DOF sentencia favorable'] === undefined)
        {
          pDSF = ' '
        }
        else
        {
          var qS1 = data[i]['Publicación DOF sentencia favorable']
          /*var date = qS1.getDate()
          var month = qS1.getMonth() + 1
          var year = qS1.getFullYear()
          var finalDate2 = ""

          if(month < 10 && date < 10)
          {
              finalDate2 =  "0" + date + "/0" + month + "/" + year;  
          }
          else if(date < 10)
          {
              finalDate2 = "0" + date + "/" + month + "/" + year;
          }
          else if(month < 10) 
          {  
              finalDate2 =  date + "/0" + month + "/" + year;
          }
          else{
              finalDate2 = date + "/" + month + "/" + year;
          }*/
          pDSF = qS1
        } 

        var obj = {
          "No" : data[i]['No'],
          "RFC" : rfc,
          "Nombre del Contribuyente" : nC,
          "Situación del contribuyente" : sC,
          "Número y fecha de oficio global de presunción SAT" : nFO,
          "Publicación página SAT presuntos" : pPS,
          "Número y fecha de oficio global de presunción DOF" : nFG,
          "Publicación DOF presuntos" : pDP,
          "Número y fecha de oficio global de contribuyentes que desvirtuaron SAT" : nFGC,
          "Publicación página SAT desvirtuados" : pPSD,
          "Número y fecha de oficio global de contribuyentes que desvirtuaron DOF" : nFGCD,
          "Publicación DOF desvirtuados" : pDD,
          "Número y fecha de oficio global de definitivos SAT" : nFOG,
          "Publicación página SAT definitivos" : pPSDEF,
          "Número y fecha de oficio global de definitivos DOF" : nFOGD,
          "Publicación DOF definitivos" : pDDEF,
          "Número y fecha de oficio global de sentencia favorable SAT" : nFOGS,
          "Publicación página SAT sentencia favorable" : pPSS, 
          "Número y fecha de oficio global de sentencia favorable DOF" :nFOGSF,
          "Publicación DOF sentencia favorable" : pDSF
        }
        data[i] = obj;
      }
      const csvFromArrayOfObjects = convertArrayToCSV(data);
      //console.log(csvFromArrayOfObjects)
      fs.writeFileSync(localPath+filename, csvFromArrayOfObjects, 'utf-8');
    });

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
      /*try {
          fs.unlinkSync(localPath+filename)
          //file removed
      } catch(err) {
          console.error(err)
      }*/
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