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
      html: util.format('<style>\n\
              *{\n\
                padding: 0;\n\
                margin: 0;\n\
              }\n\
              html {\n\
                font-family: sans-serif, "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS";\n\
                font-weight: 400;\n\
                color: rgb(239, 255, 238);\n\
                padding-top: 50px;\n\
              }\n\
              table, tr, td, th {\n\
                border: 1px solid rgb(255, 255, 255);\n\
                border-collapse: collapse;\n\
                border-style: none;\n\
                padding: 5px;\n\
              }\n\
              td {\n\
                text-align: center;\n\
                color: rgb(73, 71, 71);\n\
              }\n\
              table {\n\
                width: 250px;\n\
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);\n\
              }\n\
              table.center {\n\
                margin-left: auto;\n\
                margin-right: auto;\n\
              }\n\
              tr {\n\
                background-color: #EEEEEE;\n\
                border-bottom: thin solid #C3C3C3;\n\
              }\n\
              tr:first-child {\n\
                background-color: #009879;\n\
                border: none;\n\
              }\n\
              tr:last-child {\n\
                border: none;\n\
              }\n\
              </style>\n\
              <table class="center">\n\
                <caption style="color:rgb(73, 71, 71);\n\
                font-weight: bold;padding-bottom: 10px;text-align: left;"\n\
                >IZMJENE U RASPOREDU - SRIJEDA, 13. TRAVANJA 2022.<br>POSLIJEPODNE</caption>\n\
                <tr>\n\
                  <th>Sat</th>\n\
                  <th>Izmjena</th>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">-1.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;0.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;1.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;2.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;3.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;4.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;5.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;6.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
                <tr name="red">\n\
                  <td name="sat">&nbsp;7.</td>\n\
                  <td><b name="izmjena"></b></td>\n\
                </tr>\n\
              </table>\n\
              <script>\n\
                function elementIsEmpty(el) {\n\
                  return (/^(\s|&nbsp;)*$/.test(el.innerHTML));\n\
                }\n\
                function replaceCell(td, tr, sat) {\n\
                  if (!(elementIsEmpty(td))) {\n\
                    tr.style.backgroundColor = "#C3C3C3";\n\
                    tr.style.borderBottom = "2px solid #009879";\n\
                    td.style.color = "#009879";\n\
                    sat.style.color = "#009879";\n\
                    sat.style.fontWeight = "bold";\n\
                  }\n\
                }\n\
                let red = document.getElementsByName("red");\n\
                let sat = document.getElementsByName("sat");\n\
                let izmjene = document.getElementsByName("izmjena");\n\
                for (let i = 0; i < red.length; i++) {\n\
                    replaceCell(izmjene[i], red[i], sat[i]);\n\
                }\n\
              </script>')
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