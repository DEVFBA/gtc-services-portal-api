const nodemailer = require('nodemailer');
const path = require('path');

const {
  getApplicationSettings
} = require('../controllers/external-applications');
const logger = require('./logger');


/**
 * * Function sendMail
 * 
 * *** Params
 * *****
 * ***** @param emailTo: String with the eMails which are going to receive the mail (Comma separated: agutierrez@gtcta.mx, egutierrez@gtcta.mx).
 * ***** @param emailCC: String with the eMails which are going to receive a mail copy (Comma separated: agutierrez@gtcta.mx, egutierrez@gtcta.mx).
 * ***** @param attachments: Array of objects. Each object corresponds to an attachment with the next attributes:
 * ************ @attribute path: Path from where to take the file
 * ************ @attribute fileName: File Name for the attachment
 * ************ @example: [
 *                            {
 *                                path: 'C:\GTC\Attachments\attachment.txt'
 *                                fileName: 'attachment.txt'
 *                            },
 *                            ...
 *                        ] 
 * ***** @param options: Options Object with the next attributes:
 * ************ @attribute mailSettingsType: Indicates the way to get the Mail Settings (0 = Manual, 1 = Customer Application Settings from Application_Settings Table)
 * ************ @attribute idCustomer: Id Customer for mailSettingsType = 1
 * ************ @attribute idApplication: Id Application for mailSettingsType = 1
 * ************ @attribute mailManualSettings: Object with the Manual Settings if manualSettingsType = 0
 * ****************** @attribute mailHost
 * ****************** @attribute mailPort
 * ****************** @attribute mailUser
 * ****************** @attribute mailPassword
 * ****************** @attribute mailSubject
 * ****************** @attribute mailHTML
 * ************ @example: {
 *                            mailSettingsType: 0,
 *                            idCustomer: 0,
 *                            idApplication: 0,
 *                            mailManualSettings: {
 *                                                    mailHost: '',
 *                                                    mailPort: '',
 *                                                    mailUser: '',
 *                                                    mailPassword: '',
 *                                                    mailSubject: '',
 *                                                    mailHTML: ''
 *                                                }
 *                        }
 * 
 * @returns boolean: If success
 */
async function sendMail( emailTo, emailCC, attachments, options ) {

    try {

      logger.info('Inicia proceso de envío de correo.');
      logger.info('Correo se envía a: ' + emailTo);
      logger.info('Correo se envía con Copia a: ' + emailCC);
      logger.info('Correo se envía con adjuntos: ' + JSON.stringify(attachments));
      logger.info('Opciones de Envío de Correo: ' + JSON.stringify(options));

      let mailHost      = '';
      let mailPort      = '';
      let mailUser      = '';
      let mailPassword  = '';
      let mailSubject   = '';
      let mailHTML      = '';

      if( options.mailSettingsType === 0 ) {

        logger.info('Las configuraciones del correo se recuperan de la tabla Application_Settings.');

        const mailConfig = await getApplicationSettings( options.idApplication, options.idCustomer );
  
        mailHost              = mailConfig.MailHost;
        mailPort              = mailConfig.MailPort;
        mailUser              = mailConfig.MailUser;
        mailPassword          = mailConfig.MailPassword;
        mailSubject           = mailConfig.MailSubject;
        mailHTML              = mailConfig.mailHTML;

      } else {

        logger.info('Las configuraciones del correo se recuperan del Objeto mailManualSettings.');

        mailHost              = options.mailManualSettings.mailHost;
        mailPort              = options.mailManualSettings.mailPort;
        mailUser              = options.mailManualSettings.mailUser;
        mailPassword          = options.mailManualSettings.mailPassword;
        mailSubject           = options.mailManualSettings.mailSubject;
        mailHTML              = options.mailManualSettings.mailHTML;

      }

      const transporter = nodemailer.createTransport( {
        host: mailHost,
        port: mailPort,
        secure: false,
        auth: {
          user: mailUser,
          pass: mailPassword
        }
      } );
      
      const info = await transporter.sendMail( {
        from: mailUser,
        to: emailTo,
        cc: emailCC,
        subject: mailSubject,
        html: {
          path: mailHTML
        },
        attachments: attachments
      } );
    
      logger.info('Correo enviado: %s' + info.messageId)

      return true;

    } catch (error) {

      console.log('Error en SendMail: ', error);
      logger.error('Error en SendMail: ' + error);

      return false;
      
    }

}

module.exports = {
    sendMail
}