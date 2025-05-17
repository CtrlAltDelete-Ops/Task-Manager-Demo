const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const senderGmail = "engismailamin1524@gmail.com";

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: senderGmail,
    subject: "Welcome email",
    text: `${name}, welcome to the Task Manager Application`,
  });
};

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: senderGmail,
    subject: "We're Sorry to See You Go",
    text: `${name}, You have successfully deleted your Task Manager account.\nThis is very distressing for us and we hope you will create another one as soon as possible.\n\n We would also like to know why you have deleted the account, so we can improve and become better and better every day! `,
  });
};

module.exports = { sendWelcomeEmail, sendCancelationEmail }