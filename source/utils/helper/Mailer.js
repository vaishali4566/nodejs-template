import nodemailer from 'nodemailer';


// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "maddison53@ethereal.email",
//     pass: "jn7jnAPss4f63QBp6D",
//   },
// });

const transporter = nodemailer.createTransport(env.SMTP_URL);

function main({ sender_email, subject, text, html }) {
    try {
        return transporter.sendMail({
            from: env.MAILER_FROM_ADDRESS,
            to: sender_email,
            subject: subject,
            text: text,
            html: html,
        });
    } catch (err) {
        throw err;
    }
}

export default main;
