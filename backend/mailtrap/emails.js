import { mailtrapClient ,sender } from "./mailtrapConfig.js"
import { VERIFICATION_EMAIL_TEMPLATE , RESET_EMAIL_TEMPLATE } from "./emailTemplates.js"

export const sendVerificationEmail = async (email , token)=>{
    const recipient = [{email}]
    try {
        const res = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "Verification Email",
            html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}" , token),
            category:"Email Verification",
        })
        console.log("Verification email sent successfully" ,res)


    } catch (error) {
        console.error(error)
        throw new Error("Failed to send verification email")
    }
}
export const sendResetPasswordEmail = async (email , token)=>{
    const recipient = [{email}]
    
    try {
        const res = await mailtrapClient.send({
            from:sender,
            to: recipient,
            subject: "reset password Email",
            html:RESET_EMAIL_TEMPLATE.replace("{verificationCode}" , token),
            category:"reset password",
        })
        console.log("password reset code sent" ,res)


    } catch (error) {
        console.error(error)
        throw new Error("Failed to send verification email")
    }
}


export const sendWelcomeEmail = async(email , name)=>{
    const recipient = [{email}]
    try {
        await mailtrapClient.send({
            from:sender,
            to: recipient,
            template_uuid: "8d8990b9-a462-4b4a-9dee-42001f425b78",
            template_variables: {
              "company_info_name": "auth company",
              "name": name
            },
            subject: "Welcome to our website",
            category:"Welcome Email",
        })
        console.log("Welcome email sent successfully")

    } catch (error) {
        console.error(error)
        throw new Error("Failed to send welcome email")
    }
}