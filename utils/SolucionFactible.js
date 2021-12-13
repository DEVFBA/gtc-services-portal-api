const fs                = require('fs');
const soap              = require('soap');
const path              = require('path');
const express           = require('express');

/* const {
    sendMail
  } = require('./mail.js'); */

async function timbrarFactura(xmlBase64, url, user, password) {

  const args = {
      usuario: user,
      password: password,
      cfdi: xmlBase64,
      zip: false
  }

  const response = await soap.createClientAsync(url).then( async (client) => {

    return client.timbrarAsync(args)

    }).then(async (result) => {

      if (result[0].return.status === 200) {

          return result[0].return.resultados[0];

        } else {

          return result[0].return.resultados[0];

        }

    });

  return response;

}

async function obtenerPDFTimbrado(url, uuid, user, password) {

  const argsPDF = {
    usuario: user,
    password: password,
    uuid: uuid,
    usarDisenoPersonalizado: false
  }

  const response = await soap.createClientAsync(url).then(async (client) => {

    return client.obtenerPDFAsync(argsPDF)

  }).then(async (result) => {

    if (result[0].return.status === 200) {

      return result[0].return;

    } else {

      console.log(result);

      return result[0].return;

    }

  });

  return response;

}

module.exports = {
    timbrarFactura,
    obtenerPDFTimbrado
}