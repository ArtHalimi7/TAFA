const nodemailer = require("nodemailer");

// Create a transporter using Gmail or other email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Send contact form email to admin
const sendContactEmail = async (name, email, phone, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "arthalimi989@gmail.com",
      subject: `New Contact Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #000;">New Contact Inquiry</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message}
          </p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            This email was sent from the AUTO TAFA contact form.
          </p>
        </div>
      `,
    };

    // Send to admin
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to admin from ${name}`);

    // Optional: Send confirmation email to user
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "We received your inquiry - AUTO TAFA",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #000;">Thank you for contacting AUTO TAFA</h2>
          <p>Hi ${name},</p>
          <p>We have received your inquiry and appreciate your interest in AUTO TAFA. Our team will review your message and get back to you within 24 hours.</p>
          <p>If you need immediate assistance, please don't hesitate to call us:</p>
          <p><strong>Phone:</strong> +38344666662</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
          <p style="color: #999; font-size: 12px;">
            Best regards,<br/>
            The AUTO TAFA Team
          </p>
        </div>
      `,
    };

    // Send confirmation to user
    await transporter.sendMail(confirmationMailOptions);
    console.log(`✅ Confirmation email sent to ${email}`);

    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

module.exports = {
  sendContactEmail,
};
