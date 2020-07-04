const sgMail = require('@sendgrid/mail');
const sendgridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridApiKey);

class Mailer {
  constructor(templateName, fromEmail = 'no-reply@company.com') {
    this.fromEmail = fromEmail;
    this.templateName = templateName;
  }

  static get templates() {
    return {
      welcome    : "d-8d8af84647ae44d38c463a841def933a",
      cancelation: "d-5d41272dac8f4f54b773052d0ffad66e",
    };
  }

  sendMsg(toEmail, templateData = {}) {
    const msg = {
      to: toEmail,
      from: this.fromEmail,
      // subject: 'not necessary (using template)',
      templateId: this.constructor.templates[this.templateName],
      //extract the custom fields
      dynamic_template_data: templateData
    };

    //send the email
    sgMail.send(msg, (error, _result) => {
      if (error) {
        console.log(error.response.body.errors);
      } else {
        console.log("Email sent!");
      }
    });
  }
}

module.exports = Mailer;
