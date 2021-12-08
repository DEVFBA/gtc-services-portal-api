const config = {
    user: "sa",
    password: "GTC-Q4T*",
    server: "129.159.99.152",
    port: 1434,
    //server: "172.16.0.220",
    database: "PortalGTC",
    options: {
        trustedconnection: false,
        enableArithAbort: true,
        encrypt: false
        //instancename: '<nombreinstancia>' En caso de que se tenga alguna instancia
    }

}
 
module.exports = config;