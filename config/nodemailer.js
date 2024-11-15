const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.mail.ru',
    port: 465, // Secure SMTP port
    secure: true, // Use TLS
    auth: {
        user: process.env.MAIL_USER, // Your Mail.ru email
        pass: process.env.MAIL_PASS  // Your Mail.ru email password
    }
});

const sendWelcomeEmail = async (recipient) => {
    try {
        await transporter.sendMail({
            from: `"Portfolio Platform" <${process.env.MAIL_USER}>`, // Sender address
            to: recipient, // Recipient address
            subject: 'Welcome to the Portfolio Platform',
            text: 'Thank you for registering on our platform!',
            html: '<p>Thank you for registering on our platform!</p>'
        });
        console.log(`Welcome email sent to ${recipient}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
};

module.exports = { sendWelcomeEmail };
