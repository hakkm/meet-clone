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
