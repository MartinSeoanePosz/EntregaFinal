import mailer from 'nodemailer';
import { MAILER } from '../config/indexconfig.js';

export default class MailingService {
    constructor() {
      this.client = mailer.createTransport({
        service: MAILER.service,
        port: 587,
        auth: {
          user: MAILER.user,
          pass: MAILER.pass,
        },
      });
    }
    outboundEmail = async ({ from, to, subject, html }) => {
        try {
            let result = await this.client.sendMail({
              from,
              to,
              subject,
              html,
            });
            console.log("Email sent successfully:", result);
            return result;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error; 
        }
    }
    }



