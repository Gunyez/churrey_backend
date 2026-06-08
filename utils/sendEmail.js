import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  try {
    if (!token) {
      throw new Error("Token is missing!");
    }

    const link = `${process.env.CLIENT_URL}/verify/${token}`;

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your account",
      html: `
        <h2>Welcome to Churrey Homes</h2>

        <p>Please verify your account by clicking the button below:</p>

        <a href="${link}"
           style="
             display:inline-block;
             padding:10px 20px;
             background:black;
             color:white;
             text-decoration:none;
             border-radius:5px;
           ">
           Verify Account
        </a>

        <p>If the button doesn't work, copy this link:</p>
        <p>${link}</p>
      `,
    });

    console.log("✅ Verification email sent");
    console.log(result);

    return result;

  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);
    throw err;
  }
};

export const sendResetEmail = async (email, token) => {
  try {
    const link = `${process.env.CLIENT_URL}/reset/${token}`;

    const result = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>

        <p>Click below to reset your password:</p>

        <a href="${link}">
          Reset Password
        </a>

        <p>${link}</p>
      `,
    });

    return result;

  } catch (err) {
    console.error("❌ RESET EMAIL ERROR:", err);
    throw err;
  }
};
