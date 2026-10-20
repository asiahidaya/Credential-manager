import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transport = nodemailer.createTransport({
    service: "gmail" , auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

async function sendMail(to, subject, text) {
    await transport.sendMail({
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text
    })
}

export {sendMail};