// Dodavanje potrebnih libraryja
const path = require('path');
let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');

function send_email(tableData, j, cT){
    let isEmpty = {}, selectedTemplate, selectedContext, selectedSubject;

    if (cT != 2) {
        for (let i = 1; i < 10; i++) {
            if (tableData.scheduleChanges[`sat${i}`] != "") {
                isEmpty[`sat${i}`] = true;
            } else {
                isEmpty[`sat${i}`] = false;
            }
        }
    }
    if (cT == 1 || cT == 0) {
        // tamna ili svijetla tema 
        selectedContext = {
            j                   : j,
            j1                  : j + 1,
            j2                  : j + 2,
            j3                  : j + 3,
            j4                  : j + 4,
            j5                  : j + 5,
            j6                  : j + 6,
            j7                  : j + 7,
            j8                  : j + 8,
            sat1                : isEmpty.sat1,
            sat2                : isEmpty.sat2,
            sat3                : isEmpty.sat3,
            sat4                : isEmpty.sat4,
            sat5                : isEmpty.sat5,
            sat6                : isEmpty.sat6,
            sat7                : isEmpty.sat7,
            sat8                : isEmpty.sat8,
            sat9                : isEmpty.sat9,
            class               : tableData.className,
            tableHeading        : tableData.tableHeading,
            shiftHeading        : tableData.shiftHeading,
            email               : tableData.receiverEmail,
            token               : tableData.token,
            scheduleChangesSat1 : tableData.scheduleChanges.sat1,
            scheduleChangesSat2 : tableData.scheduleChanges.sat2,
            scheduleChangesSat3 : tableData.scheduleChanges.sat3,
            scheduleChangesSat4 : tableData.scheduleChanges.sat4,
            scheduleChangesSat5 : tableData.scheduleChanges.sat5,
            scheduleChangesSat6 : tableData.scheduleChanges.sat6, 
            scheduleChangesSat7 : tableData.scheduleChanges.sat7,
            scheduleChangesSat8 : tableData.scheduleChanges.sat8,
            scheduleChangesSat9 : tableData.scheduleChanges.sat9};
        selectedSubject = `Izmjene u rasporedu sati za ${tableData.className}`;
        if (cT)
            selectedTemplate = 'raspored_dark_theme';
        else
            selectedTemplate = 'raspored_light_theme';
    } else {
        // dobrodoslica
        let sendAllMessage, darkThemeMessage;
        selectedTemplate = 'raspored_welcome';
        if (tableData.sendAll)
            sendAllMessage = 'Uključeno';
        else
            sendAllMessage = 'Isključeno';
        if (tableData.darkTheme)
            darkThemeMessage = 'Uključeno';
        else
            darkThemeMessage = 'Isključeno';
        selectedContext = {email        : tableData.receiverEmail,
                           token        : tableData.token,
                           class        : tableData.className, 
                           sendAll      : sendAllMessage,
                           darkTheme    : darkThemeMessage}; 
        selectedSubject = `Raspored bot ti želi dobrodošlicu!`;
    }
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
        subject: selectedSubject,
        template: selectedTemplate,
        context: selectedContext
    };
    // slanje e-maila
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error); // neuspjesno poslan
        } else {
            console.log('[\u001b[33mEmail\033[00m] Email sent: ' + info.response);  // uspjesno poslan
        }
    });
}

// Eksportanje funkcije
module.exports = { send_email }