const nodemailer = require("nodemailer");

class MailService {
    constructor(config) {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Активація акаунта на: " + process.env.API_URL,
            text: "",
            html: `
            <div>
              <h1>Для активації перейдіть по посиланню</h1>
              <a href="${link}">${link}</a>
          </div>`
        })
    }
}

module.exports = new MailService;