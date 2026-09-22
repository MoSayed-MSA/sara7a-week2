import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
export async function sendEmail(to, subject, html) {
    await transporter.sendMail({
        from: `"Verify your email" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: html
    });
}