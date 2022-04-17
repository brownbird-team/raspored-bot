// Dodavanje potrebnih libraryja
let nodemailer = require('nodemailer');

function send_email(tableData, j){
    let css = `     
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

    caption {
        color: rgb(73, 71, 71);
        font-weight: bold;
        padding-bottom: 10px;
        text-align: left;
    }
    </style>`

    htmlMessage = `
    <table class="center">
        <caption>${tableData.tableHeading}<br>${tableData.shiftHeading}</caption>
        <tr>
            <th>Sat</th>
            <th>Izmjena</th>
        </tr>
        <tr>
            <td>${j}.</td>
            <td><b>${tableData.scheduleChanges.sat1}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+1}.</td>
            <td><b>${tableData.scheduleChanges.sat2}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+2}.</td>
            <td><b>${tableData.scheduleChanges.sat3}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+3}.</td>
            <td><b>${tableData.scheduleChanges.sat4}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+4}.</td>
            <td><b>${tableData.scheduleChanges.sat5}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+5}.</td>
            <td><b>${tableData.scheduleChanges.sat6}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+6}.</td>
            <td><b>${tableData.scheduleChanges.sat7}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+7}.</td>
            <td><b>${tableData.scheduleChanges.sat8}</b></td>
        </tr>
        <tr>
            <td>&nbsp;${j+8}.</td>
            <td><b>${tableData.scheduleChanges.sat9}</b></td>
        </tr>
    </table>`
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
      from: 'bot.raspored@gmail.com', // posiljatelj
      to: tableData.receiverEmail, // primatelj
      subject: `Izmjene u rasporedu sati za ${tableData.className}`,
      html: css + htmlMessage
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