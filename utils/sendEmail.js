import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, token) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);
    console.log("CLIENT_URL:", process.env.CLIENT_URL);

    if (!token) {
      throw new Error("Token is missing!");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log("Verifying SMTP connection...");

    await transporter.verify();

    console.log("✅ SMTP verified");

    const link = `${process.env.CLIENT_URL}/verify/${token}`;

    console.log("🔗 Verification link:", link);

    const info = await transporter.sendMail({
      from: `"Churrey Homes" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your account",
      text: `Verify your account here: ${link}`,
      html: `
        <h2>Welcome to Churrey Homes</h2>
        <a href="${link}">Verify Account</a>
      `,
    });

    console.log("✅ Email sent");
    console.log("Message ID:", info.messageId);

  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error(err);
  }
};

// export const sendVerificationEmail = async (email, token) => {
//   try {
//     if (!token) {
//       throw new Error("Token is missing!");
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     console.log("Token", token);
    

//     const link = `${process.env.CLIENT_URL}/verify/${token}`;

//     console.log("🔗 Verification link:", link);

//     await transporter.sendMail({
//       from: `"Churrey Homes" <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: "Verify your account",
//       text: `Verify your account here: ${link}`,

//       html: `
//         <h2>Welcome to Churrey Homes</h2>
//         <p>Please verify your account by clicking the button below:</p>
        
//         <a href="${link}" 
//            style="
//              display:inline-block;
//              padding:10px 20px;
//              background:black;
//              color:white;
//              text-decoration:none;
//              border-radius:5px;
//            ">
//            Verify Account
//         </a>

//         <p>If the button doesn't work, copy this link:</p>
//         <p>${link}</p>
//       `,
//     });

//     console.log("📧 Verification email sent");

//   } catch (err) {
//     console.error("❌ EMAIL ERROR:", err.message);
//   }
// };
export const sendResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const link = `${process.env.CLIENT_URL}/reset/${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    text: `Reset your password: ${link}`, // 👈 add this
    html: `
      <h2>Password Reset</h2>
      <p>Click below to reset your password:</p>
      <a href="${link}">Reset Password</a>
    `,
  });
};
