// Dodavanje potrebnih libraryja
var nodemailer = require('nodemailer');
var mysql = require('mysql');

function send_email(){
    // povezivanje s posiljateljom
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'bot.raspored@gmail.com',
        pass: 'BOTrasPoreDBrownBIRDteAM'
      }
    });
    const util = require('util');
    // kreiranje e-mail poruke
    var mailOptions = {
      from: 'bot.raspored@gmail.com', // navesti posiljatelja
      to: 'luka.dimjasevic@gmail.com', // navesti primatelja
      subject: 'Izmjene u rasporedu sati', // dodati na kraju 'za <razred>'
      html: `
        <style>
          * {
            padding: 0;
            margin: 0;
          }

          html {
            font-family: sans-serif, "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS";
            font-weight: 400;
            color: rgb(239, 255, 238);
            padding-top: 50px;
          }

          table, tr, td, th {
            border: 1px solid rgb(255, 255, 255);
            border-collapse: collapse;
            border-style: none;
            padding: 5px;
          }

          td {
            text-align: center;
            color: rgb(73, 71, 71);
          }

          table {
            width: 250px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
          }

          table.center {
            margin-left: auto;
            margin-right: auto;
          }

          tr {
            background-color: #EEEEEE;
            border-bottom: thin solid #C3C3C3;
          }

          tr:first-child {
            background-color: #009879;
            border: none;
          }

          tr:last-child {
            border: none;
          }
        </style>
        <table class="center">
          <caption style="color:rgb(73, 71, 71);
          font-weight: bold;padding-bottom: 10px;text-align: left;"
          >IZMJENE U RASPOREDU - SRIJEDA, 13. TRAVANJA 2022.<br>POSLIJEPODNE</caption>
          <tr>
            <th>Sat</th>
            <th>Izmjena</th>
          </tr>
          <tr name="red">
            <td name="sat">-1.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;0.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;1.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;2.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;3.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;4.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;5.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;6.</td>
            <td><b name="izmjena"></b></td>
          </tr>
          <tr name="red">
            <td name="sat">&nbsp;7.</td>
            <td><b name="izmjena"></b></td>
          </tr>
        </table>
      `
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