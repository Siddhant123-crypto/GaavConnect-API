const nodemailer = require("nodemailer");

const sendResetEmail = async (toEmail, token) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

        const mailOptions = {
            from: process.env.MAIL_FROM || '"GaavConnect Support" <no-reply@gaavconnect.com>',
            to: toEmail,
            subject: "Password Reset Request",
            html: `
                <h3>Hello,</h3>
                <p>You requested a password reset. Please use the link below to reset your password.</p>
                <p>This link is valid for 15 minutes.</p>
                <p>Reset Link: <a href="${resetLink}">${resetLink}</a></p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Password reset email sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};

module.exports = {
    sendResetEmail
};
