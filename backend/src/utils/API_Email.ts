import nodemailer from "nodemailer";



interface EmailOptions {
    to: string;
    subject: string;
    text?: string;
    html?: string;
}


const SendEmail = async (options: EmailOptions) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT as string, 10),
        secure: true,
        // auth: {
        //     user: process.env.SMTP_USER,
        //     pass: process.env.SMTP_PASSWORD,
        // },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_EMAIL_FROM,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html,
        });
        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

export default SendEmail