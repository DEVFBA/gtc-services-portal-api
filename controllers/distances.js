var config = require("../dbconfig"); //instanciamos el archivo dbconfig
const sql = require("mssql"); //necesitamos el paquete sql
const axios = require('axios');
var jwt = require('jsonwebtoken');
var config2 = require('../configs/config');

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
          var expiration = await config2.getExpirationDistances()
          var secret = await config2.getSecretDistances()
  
          const today = new Date();
          const exp = new Date(today);
          exp.setDate(today.getDate() + parseInt(expiration, 10));
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

async function getDistance(req){
  var googleAPIKey = await config2.getGoogleApiKey()

  var distances = req
  //para saber cuantos llamados a la API de coordenadas se hicieron
  var countCoordenadas=0
  //Para saber cuantos llamados a la API de distancias se hicieron
  var countDistancias=0


  var distanciasFinal =[]
  var origenesC = []
  var destinosFC = []
  for(var i=0; i<distances.distancias.length; i++)
  {
    //Para sacar el origen
    var origen = distances.distancias[i].origen
    //Para las coordenadas del origen
    var urlDistances = ""
    var origenC;
    if(origen.tipo === 0)
    {
      //console.log("El origen ya viene con coordenadas")
      //ya no se llama la api para obtener las coordenadas
      origenC = {
        latitud: origen.latitud,
        longitud: origen.longitud,
        identificadorCliente: origen.identificadorCliente
      }
      urlDistances = urlDistances + origen.latitud
      urlDistances = urlDistances + "%2C" + origen.longitud + "&destinations="
    }
    else{
      //console.log("El origen es una direccion")
      countCoordenadas++
      /*llamamos a la api para obtener las coordenadas*/

      //PASO 1: Sustituimos espacios por "+" en la direccion
      var cadena = origen.direccion
      var cadena2 = cadena.replace(/ /g, "+")

      //PASO 2: Quitamos acentos o caracteres no deseados a la cadena
      var cadena3 = cadena2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      //PASO 3: Hacemos el llamado a la API de Geocode
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cadena3}&key=${googleAPIKey}`
      try{
        let response = await axios({
            method: 'get',
            url: url,
            json: true
        })
        //PASO 3: Guardamos latitud y longitud en OrigenC
        origenC = {
          latitud: response.data.results[0].geometry.location.lat,
          longitud: response.data.results[0].geometry.location.lng,
          identificadorCliente: origen.identificadorCliente
        }

        urlDistances = urlDistances + response.data.results[0].geometry.location.lat
        urlDistances = urlDistances + "%2C" + response.data.results[0].geometry.location.lng + "&destinations="
      } catch(err){
          return {
            error: "Hubo un error, consulte con el administrador"
          }
      }
    }
    console.log("Origen " + i + ": " + origenC.latitud + ", " + origenC.longitud)
    //Guardamos los origenes
    origenesC[i] = origenC

    //Para sacar los destinos
    var destinos = distances.distancias[i].destinos
    var destinosC  = []
    for(var y=0; y<destinos.length; y++)
    {
      var destino = destinos[y]
      //console.log(destino)
      if(destino.tipo === 0)
      {
        //console.log("El destino ya viene con coordenadas")
        //ya no se llama la api para obtener las coordenadas
        destinosC[y] = {
          latitud: destino.latitud,
          longitud: destino.longitud,
          identificadorCliente: destino.identificadorCliente
        }
        if(destinos[y+1]!==undefined)
        {
          urlDistances = urlDistances + destino.latitud
          urlDistances = urlDistances + "%2C" + destino.longitud + "%7C"
        }
        else{
          urlDistances = urlDistances + destino.latitud
          urlDistances = urlDistances + "%2C" + destino.longitud
        }
        
      }
      else{
        //console.log("El destino es una direccion")
        countCoordenadas++
        //PASO 1: Sustituimos espacios por "+" en la direccion
        var cadena = destino.direccion
        var cadena2 = cadena.replace(/ /g, "+")

        //PASO 2: Quitamos acentos o caracteres no deseados a la cadena
        var cadena3 = cadena2.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        //PASO 3: Hacemos el llamado a la API de Geocode
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${cadena3}&key=${googleAPIKey}`
        try{
          let response = await axios({
              method: 'get',
              url: url,
              json: true
          })
          //PASO 3: Guardamos latitud y longitud en destinosC
          destinosC[y] = {
            latitud: response.data.results[0].geometry.location.lat,
            longitud: response.data.results[0].geometry.location.lng,
            identificadorCliente: destino.identificadorCliente
          }
          if(destinos[y+1]!==undefined)
          {
            urlDistances = urlDistances + response.data.results[0].geometry.location.lat
            urlDistances = urlDistances + "%2C" + response.data.results[0].geometry.location.lng + "%7C"
          }
          else{
            urlDistances = urlDistances + response.data.results[0].geometry.location.lat
            urlDistances = urlDistances + "%2C" + response.data.results[0].geometry.location.lng
          }
          
        } catch(err){
            return {
              error: "Hubo un error, consulte con el administrador"
            }
        }
      }

      /*DESPUES DE QUE TENGAMOS TODOS LOS DESTINOS HACEMOS LA LLAMADA A LA API DE DISTANCE MATRIX*/
      console.log("Destino " + y + ": " + destinosC[y].latitud + ", " + destinosC[y].longitud)
    }
    destinosFC[i] = destinosC
    countDistancias++
    var urlDistancesMatrix = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${urlDistances}&key=${googleAPIKey}`
    try{
        let response = await axios({
            method: 'get',
            url: urlDistancesMatrix,
            json: true
        })
        distanciasFinal[i] = response.data
    } catch(err){
          return {
            error: "Hubo un error, consulte con el administrador"
          }
    }
  }

  var distancias = []
  for(var i=0; i< distanciasFinal.length; i++)
  {
    var origen = {
      direccion: distanciasFinal[i].origin_addresses,
      latitud: origenesC[i].latitud.toString(),
      longitud: origenesC[i].longitud.toString(),
      identificadorCliente:origenesC[i].identificadorCliente.toString()
    }
    var destinos = []
    for(var j=0; j< distanciasFinal[i].destination_addresses.length; j++)
    {
      
      destinos[j] = {
        direccion: distanciasFinal[i].destination_addresses[j],
        latitud: destinosFC[i][j].latitud.toString(),
        longitud: destinosFC[i][j].longitud.toString(),
        distancia: distanciasFinal[i].rows[0].elements[j].distance.text,
        identificadorCliente: destinosFC[i][j].identificadorCliente.toString()
      }
    }
    distancias[i] = {
      origen,
      destinos
    }
  }

  console.log("Se realizaron " + countCoordenadas + " llamadas a la API de Geocode")
  console.log("Se realizaron " + countDistancias + " llamadas a la API de Distance Matrix")

  return {
      data: {
        distancias
      }
  }
}

module.exports = {
    login: login,
    getDistance: getDistance
}