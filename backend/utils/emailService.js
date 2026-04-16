import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Creates and configure the nodemailer transporter using credentials from .env
 */
const createTransporter = () => {
    // We check if SMTP user is defined, if not we log a grave error but avoid crashing locally right away.
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("⚠️ SMTP credentials not found in environment variables. Emails will fail to send!");
    }

    return nodemailer.createTransport({
        service: 'gmail', // Specifying Gmail service explicitly
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS, // Needs to be a Gmail App Password
        },
    });
};

/**
 * Utility to dispatch automated emails
 * @param {Object} options Options containing email parameters
 * @param {string} options.to Recipient email address
 * @param {string} options.subject Email subject line
 * @param {string} options.html HTML content of the email
 */
export const sendEmail = async ({ to, subject, html }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"BuyTogether" <${process.env.SMTP_USER || "noreply@buytogether.com"}>`,
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully: ", info.messageId);
        return info;
    } catch (error) {
        console.error("Failed to send email -> ", error.message);
        throw error;
    }
};

/**
 * Generates an automated booking token email HTML format for properties
 */
export const buildPropertyTokenEmail = (userName, propertyName, amount, status) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">Booking Confirmed!</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Congratulations! You have successfully stepped into a collective buying group for <strong>${propertyName}</strong>.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Property:</strong> ${propertyName}</p>
            <p><strong>Token Paid:</strong> ₹${amount.toLocaleString()}</p>
            <p><strong>Group Status:</strong> ${status}</p>
        </div>

        <p>We will notify you immediately once the group hits the member milestone and we can proceed with negotiations and finalizing!</p>
        
        <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 40px;">
            Safe & Secure Shopping with BuyTogether.<br/>
            This is an automated transaction receipt.
        </p>
    </div>
    `;
};

/**
 * Generates an automated booking token email HTML format for dealerships
 */
export const buildDealershipTokenEmail = (userName, vehicleName, dealershipName, amount) => {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
        <h2 style="color: #2563eb; text-align: center;">Vehicle Booking Confirmed!</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Congratulations! You have successfully stepped into a collective buying group for <strong>${vehicleName}</strong> from ${dealershipName}.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Vehicle:</strong> ${vehicleName}</p>
            <p><strong>Dealership:</strong> ${dealershipName}</p>
            <p><strong>Token Paid:</strong> ₹${amount.toLocaleString()}</p>
        </div>

        <p>We will notify you immediately once the dealership group hits the member milestone.</p>
        
        <p style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 40px;">
            Drive together, save together. - BuyTogether.<br/>
            This is an automated transaction receipt.
        </p>
    </div>
    `;
};
