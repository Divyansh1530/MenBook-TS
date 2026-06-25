import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

interface SendEmailOptions {
    to:string;
    subject:string;
    html:string;
}

const sendEmail = async ({
    to,
    subject,
    html
}:SendEmailOptions) => {

    try {

        await transporter.sendMail({

            from: process.env.EMAIL_USER!,

            to,

            subject,

            html
        })

        console.log(
            "Email sent successfully"
        )

    } catch (error:unknown) {

        console.log(
            "Email Error:",
            error
        )
    }
}

export default sendEmail