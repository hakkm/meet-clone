import { AUTH_ROUTES } from '@/routes';
import { Resend } from 'resend'

const resend = new Resend(process.env.AUTH_RESEND_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  console.log("sendVerificationEmail called");
  
  const confirmLink = `${process.env.NEXTAUTH_URL}/auth/new-verification?token=${token}`
    const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: "Confirm Your Email",
    html: "<p>Click the link below to confirm your email address.</p><p><a href='" + confirmLink + "'>Confirm Email</a></p>",
  });
  console.log({data, error});
  if (error) {
    console.error("Error sending email: ", error);
    throw new Error("Error sending email");
  }
}

export async function sendResetPasswordEmail(email: string, token: string) {
  console.log("mail.ts: sendResetPasswordEmail called");
  const resetLink = `${process.env.NEXTAUTH_URL}${AUTH_ROUTES.NEW_PASSWORD}?token=${token}`
  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Reset Your Password',
    html: "<p>Click the link below to reset your password.</p><p><a href='" + resetLink + "'>Reset Password</a></p>",
  });
  console.log({data, error});
  if (error) {
    console.error("Error sending email: ", error);
    throw new Error("Error sending email");
  }
}
