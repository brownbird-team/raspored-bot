// Dodavanje potrebnih libraryja
var nodemailer = require('nodemailer');
var mysql = require('mysql');

// Importanje rasporedMessage.js
const message = require('./rasporedMessage');

function send_email(){
    // povezivanje s posiljateljom
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bot.raspored@gmail.com',
        pass: 'BOTrasPoreDBrownBIRDteAM'
      }
    });
    // kreiranje e-mail poruke
    var mailOptions = {
      from: 'bot.raspored@gmail.com', // navesti posiljatelja
      to: 'luka.dimjasevic@gmail.com', // navesti primatelja
      subject: 'Izmjene u rasporedu sati', // dodati na kraju 'za <razred>'
      html: message.htmlMessage
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
  
  // pozivanje funkcije
  send_email();