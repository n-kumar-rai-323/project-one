const nodemailer = require('nodemailer');
const transporter = new nodemailer.createTransport({
    service:process.env.SMTP_SERVICE,
    auth:{
        user:process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
});
transporter.verify((error, success)=>{
    if(error){
        console.log("Email Server is not working ....");
    }else{
        console.log("Email Server connected");
    }
});

const sendEmail = async({to, subject, htmlMessage})=>{
    const info = await transporter.sendMail({
        from: `"Gmail Service" <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        html:htmlMessage,
    });
    return info;
};
module.exports = {sendEmail}