import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: "div09702@gmail.com", // MUST authenticate with primary account
        pass: process.env.EMAIL_PASS?.replace(/\s/g, "")
    }
})

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

const sendEmail = async ({
    to,
    subject,
    html
}: SendEmailOptions) => {

    try {

        await transporter.sendMail({
            from: '"MenBook" <menbook.mail@gmail.com>',

            replyTo: "menbook.mail@gmail.com",

            to,

            subject,

            html
        })

    } catch {
        //
    }
}

export default sendEmail