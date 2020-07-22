const sendgrid = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.API)

exports.registrationLink = (email, encryptedString) => {
  return sendgrid.send({
    to: email,
    from: 'nishanth.mailer@gmail.com',
    subject: 'Registration Link from Mentor-Hub',
    html: `Here is your link ${encryptedString}`
  })
}
exports.otpMail = (email, otp) => {
  return sendgrid.send({
    to: email,
    from: 'nishanth.mailer@gmail.com',
    subject: 'One Time Password (OTP) from Mentor-Hub',
    html: `
        Your One Time Password is <b>${otp}</b>

        Please don't disclose the OTP with anyone else.

        Thank you
    `
  })
}
