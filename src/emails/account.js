const Mailer = require('../services/mailer');

const sendWelcomeEmail = (email, name) => {
  const welcomeMailer = new Mailer('welcome');
  welcomeMailer.sendMsg(email, { name });
}

const sendCalcelationEmail = (email, name) => {
  const calcelationMailer = new Mailer('cancelation');
  calcelationMailer.sendMsg(email, { name });
}

module.exports = { sendWelcomeEmail, sendCalcelationEmail };
