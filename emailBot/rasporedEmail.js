// Dodavanje potrebnih libraryja
const path = require('path');
let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');

function send_email(tableData, j, dT){
    let isEmpty = {}, selectedTemplate;
    for (let i = 1; i < 10; i++) {
        if (tableData.scheduleChanges[`sat${i}`] != "") {
            isEmpty[`sat${i}`] = true;
        } else {
            isEmpty[`sat${i}`] = false;
        }
    }
    if (dT) {
        selectedTemplate = 'raspored_dark_theme';
    } else {
        selectedTemplate = 'raspored_light_theme';
    }
    console.log(isEmpty);
    // povezivanje s posiljateljom
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bot.raspored@gmail.com',
            pass: 'BOTrasPoreDBrownBIRDteAM'
        }
    });

    const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve('./emailBot/templates'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./emailBot/templates'),
        extName: ".handlebars",
      }
      
      transporter.use('compile', hbs(handlebarOptions));

    // kreiranje e-mail poruke
    let mailOptions = {
        from: 'bot.raspored@gmail.com', // posiljatelj
        to: tableData.receiverEmail, // primatelj
        subject: `Izmjene u rasporedu sati za ${tableData.className}`,
        template: selectedTemplate,
        context: {
            class               : tableData.className,
            tableHeading        : tableData.tableHeading,
            shiftHeading        : tableData.shiftHeading,
            j                   : j,
            scheduleChangesSat1 : tableData.scheduleChanges.sat1,
            j1                  : j + 1,
            scheduleChangesSat2 : tableData.scheduleChanges.sat2,
            j2                  : j + 2,
            scheduleChangesSat3 : tableData.scheduleChanges.sat3,
            j3                  : j + 3,
            scheduleChangesSat4 : tableData.scheduleChanges.sat4,
            j4                  : j + 4,
            scheduleChangesSat5 : tableData.scheduleChanges.sat5,
            j5                  : j + 5,
            scheduleChangesSat6 : tableData.scheduleChanges.sat6,
            j6                  : j + 6,
            scheduleChangesSat7 : tableData.scheduleChanges.sat7,
            j7                  : j + 7,
            scheduleChangesSat8 : tableData.scheduleChanges.sat8,
            j8                  : j + 8,
            scheduleChangesSat9 : tableData.scheduleChanges.sat9,
            sat1                : isEmpty.sat1,
            sat2                : isEmpty.sat2,
            sat3                : isEmpty.sat3,
            sat4                : isEmpty.sat4,
            sat5                : isEmpty.sat5,
            sat6                : isEmpty.sat6,
            sat7                : isEmpty.sat7,
            sat8                : isEmpty.sat8,
            sat9                : isEmpty.sat9,
            email               : tableData.receiverEmail
        }
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