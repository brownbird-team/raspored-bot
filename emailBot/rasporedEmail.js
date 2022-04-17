// Dodavanje potrebnih libraryja
let nodemailer = require('nodemailer');

function send_email(receiver, message){
    // povezivanje s posiljateljom
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bot.raspored@gmail.com',
        pass: 'BOTrasPoreDBrownBIRDteAM'
      }
    });
    // kreiranje e-mail poruke
    let mailOptions = {
      from: 'bot.raspored@gmail.com', // navesti posiljatelja
      to: receiver, // navesti primatelja
      subject: 'Izmjene u rasporedu sati', // dodati na kraju 'za <razred>'
      html: message
    };
  
    // slanje e-maila
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error); // neuspjesno poslan
      } else {
        console.log('Email sent: ' + info.response);  // uspjesno poslan
      }
    });
  }

// Eksportanje funkcije
module.exports = { send_email }