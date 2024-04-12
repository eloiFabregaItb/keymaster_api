import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.SMTP_MAIL, 
    pass: process.env.SMTP_KEY
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to,subject,html) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '🟪KeyMaster🟪', // sender address
    to: to.toLowerCase(), // list of receivers
    subject, // Subject line
    html, // html body
  });

  console.log("Email sent:", to, subject);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


// export async function sendEmail(templatePath, usr_mail, subject, templateData) {
//   try {
//       const mailOptions = {
//           from: 'SplitMeet',
//           to: usr_mail.toLowerCase(), 
//           subject: subject,
//           inReplyTo: null,
//           references: null
//       };

//       const emailTemplate = fs.readFileSync(templatePath, 'utf-8');
//       const compiledTemplate = ejs.compile(emailTemplate);
//       const html = compiledTemplate(templateData);
//       mailOptions.html = html;

//       const info = await transporter.sendMail(mailOptions);
//       console.log('Email sent:', info.response);
//   } catch (error) {
//       console.error('Error:', error.message);
//   }
// }