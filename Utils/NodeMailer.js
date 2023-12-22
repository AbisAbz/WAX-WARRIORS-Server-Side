const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, verificationLink) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      service: 'gmail',
      port: 465,
      secure: true,
      auth: {
        user: "waxwarriors529@gmail.com",
        pass: "qgwuedimbpslyivr",
      },
    });

    // Define your HTML content 
    let htmlContent;

    if (!verificationLink) {
      if (!subject) {
        console.log("iam in the not subject")
         htmlContent = `
        <div>
     <h2>Wax Warrior Property Rejection</h2>
       <p>We regret to inform you that your email verification request has been rejected.</p>
       <p>If you believe this is in error or have any concerns, please contact our support team.</p>
       <p>Thank you for your understanding.</p>
     </div>
      `;
      } else {
        console.log("iam in the subject", subject)
         htmlContent = `
        <div>
          <h2>Wax Warrior Property Rejection</h2>
          <p>${subject}</p>
          <p>If you believe this is in error or have any concerns, please contact our support team.</p>
          <p>Thank you for your understanding.</p>
        </div>
      `;

      }

    } else {
      console.log("iam in the verification link")
       htmlContent = `
      <div>
        <p>Welcome to Mr. Wash!</p>
        <p>To verify your email, please click the following link:</p>
        <p><a href="${verificationLink}" target="_blank">Verify Email</a></p>
      </div>
    `;
    }
    await transporter.sendMail({
      from: "waxwarriors529@gmail.com",
      to: email,
      subject: subject,
      html: htmlContent,
    }).then(() => {
      console.log("Email sent successfully");
    })
    return true
     
  } catch (error) {
    console.error("Email not sent");
    return false
    console.error(error);
  }
};

module.exports = sendEmail;
