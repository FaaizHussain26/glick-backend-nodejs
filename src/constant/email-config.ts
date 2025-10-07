import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.BREVO_EMAIL,
    pass: process.env.BREVO_PASSWORD,
  },
});


export const appConfig = {
  inactivityThreshold: 10 * 60 * 1000, 
  checkInterval: '*/5 * * * *', 
  batchLimit: 100,
};