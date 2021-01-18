const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// Eg: new Email(user, url).sendWelcome(); 
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Auto Sale <${process.env.EMAIL_FROM}>`
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return 1
            // return nodemailer.createTransport({
            //     service: 'SendGrid',
            //     auth: {
            //         user: process.env.SENDGRID_USERNAME,
            //         pass: process.env.SENDGRID_PASSWORD
            //     }
            // });
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    // send the actual email
    async send(template, subject) {
        // 1) Render HTML based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });


        // 2) Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        }

        // 3) Create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Auto Sale Family!')
    }

    // async sendPasswordReset() {
    //     await this.send('passwordReset', 'Your password reset token (valid only for 15 mins');
    // }
}


/* ----------------- Below code is for nodemailer basic email sending

const nodemailer = require('nodemailer');

 const sendEmail = async options =>  {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'auto-sale <hello@auto-sale.ca>',
        to: options.email,
        subject: options.subject,
        text: options.message
        // html: 
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

---------------------------------- */
