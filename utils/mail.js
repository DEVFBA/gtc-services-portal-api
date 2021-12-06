const nodemailer = require("nodemailer");
const path = require('path');

const {
  getApplicationsSettings
} = require('../controllers/applications-settings');

async function sendMail( emailTo, attachments, idCustomer, idApplication ) {

  try {

    const mailConfig = await getApplicationsSettings( { pvOptionCRUD: 'R', piIdCustomer: idCustomer, piIdApplication: idApplication } );

    let mailHost = mailConfig[0].filter( (data) => {
    
      return data.Settings_Key === 'MailHost';
  
    });

    let mailPort = mailConfig[0].filter( (data) => {
    
      return data.Settings_Key === 'MailPort';
  
    });

    let mailUser = mailConfig[0].filter( (data) => {
    
      return data.Settings_Key === 'MailUser';
  
    });

    let mailPassword = mailConfig[0].filter( (data) => {
    
      return data.Settings_Key === 'MailPassword';
  
    });

    let mailSubject = mailConfig[0].filter( (data) => {
    
      return data.Settings_Key === 'MailSubject';
  
    });

    let mailHTML = mailConfig[0].filter( (data) => {
    
      return data.Settings_Key === 'MailHTML';
  
    });

    mailHost              = mailHost[0].Settings_Value;
    mailPort              = mailPort[0].Settings_Value;
    mailUser              = mailUser[0].Settings_Value;
    mailPassword          = mailPassword[0].Settings_Value;
    mailSubject           = mailSubject[0].Settings_Value;
    mailHTML              = mailHTML[0].Settings_Value;
    
    const transporter = nodemailer.createTransport( {
      host: mailHost,
      port: mailPort,
      secure: false,
      auth: {
        user: mailUser,
        pass: mailPassword
      }
    } );
  
    console.log(attachments);
    
    const info = await transporter.sendMail( {
      from: mailUser,
      to: emailTo,
      subject: mailSubject,
      html: {
        path: mailHTML
      },
      attachments: attachments
    } );
  
    console.log("Message sent: %s", info.messageId);

  } catch (error) {

    console.log( error );
    
  }

}

module.exports = {
    sendMail
}