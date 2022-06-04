// Dodavanje potrebnih libraryja
const path = require('path');
let nodemailer = require('nodemailer');
let hbs = require('nodemailer-express-handlebars');
const database = require('./rasporedEmailFunkcije');
const routeNames = require('./getRouteName');
const prefix = '[\u001b[33mEmail\033[00m]';

exports.sender = async(tableData, j, chooseTemplate) => {
    let isEmpty = {}, selectedTemplate, selectedContext, selectedSubject;
    const senderData = await database.getSenderEmailData();
    const username = senderData[0].adresa;
    const password = senderData[0].lozinka;
    if (chooseTemplate == 0 || chooseTemplate == 1) {
        for (let i = 1; i < 10; i++) {
            if (tableData[`sat${i}`] != "") {
                isEmpty[`sat${i}`] = true;
            } else {
                isEmpty[`sat${i}`] = false;
            }
        }
    }
    if (chooseTemplate == 1 || chooseTemplate == 0) {
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
            scheduleChangesSat1 : tableData.sat1,
            scheduleChangesSat2 : tableData.sat2,
            scheduleChangesSat3 : tableData.sat3,
            scheduleChangesSat4 : tableData.sat4,
            scheduleChangesSat5 : tableData.sat5,
            scheduleChangesSat6 : tableData.sat6, 
            scheduleChangesSat7 : tableData.sat7,
            scheduleChangesSat8 : tableData.sat8,
            scheduleChangesSat9 : tableData.sat9,
            unsubscribeRoute    : await routeNames.giveRouteName('unsubscribe'),
            urlRoute            : await routeNames.giveRouteName('url'),
            settingsRoute       : await routeNames.giveRouteName('settings')
        };
        selectedSubject = `Izmjene u rasporedu sati za ${tableData.className}`;
        selectedTemplate = 'raspored_dark_theme';
        if (!chooseTemplate) selectedTemplate = 'raspored_light_theme';
    } else if (chooseTemplate == 2 || chooseTemplate == 'postavke') {
        // dobrodoslica
        let sendAllMessage = 'sve'; 
        let messageTheme = 'tamna';
        let subscribed = 'uključena';
        selectedTemplate = 'raspored_welcome';
        if (!tableData.sendAll) sendAllMessage = 'samo aktivne';
        if (!tableData.darkTheme) messageTheme = 'svijetla';
        if (!(await database.getSubscribeState(tableData.receiverEmail))) subscribed = 'isključena';
        
        selectedContext = {email            : tableData.receiverEmail,
                           className        : tableData.className,
                           subscribed       : subscribed,
                           sendAll          : sendAllMessage,
                           theme            : messageTheme,
                           urlRoute         : await routeNames.giveRouteName('url'),
                           homeRoute        : await routeNames.giveRouteName('home'),
                           settingsRoute    : await routeNames.giveRouteName('settings'),
                           unsubscribeRoute : await routeNames.giveRouteName('unsubscribe')
        }; 
        selectedSubject = `Raspored bot ti želi dobrodošlicu!`;

        if (chooseTemplate == 'postavke') {
            selectedTemplate = 'raspored_settings';
            selectedContext = {email            : tableData.receiverEmail,
                               className        : tableData.className,
                               subscribed       : subscribed,
                               sendAll          : sendAllMessage,
                               theme            : messageTheme,
                               urlRoute         : await routeNames.giveRouteName('url'),
                               homeRoute        : await routeNames.giveRouteName('home'),
                               settingsRoute    : await routeNames.giveRouteName('settings'),
                               unsubscribeRoute : await routeNames.giveRouteName('unsubscribe')
            };
            selectedSubject = `Promijena postavki Vašeg računa`;            
        }
    } else if (chooseTemplate == 'prekid-pretplate') {
        // prekid-pretplate email
        selectedTemplate = 'raspored_unsubscribe';
        selectedContext = {email                : tableData.receiverEmail,
                           urlRoute             : await routeNames.giveRouteName('url'),
                           homeRoute            : await routeNames.giveRouteName('home'),
                           settingsRoute        : await routeNames.giveRouteName('settings'),
                           unsubscribeRoute     : await routeNames.giveRouteName('unsubscribe'),
        };
        selectedSubject = `Prekid pretplate za Vaš račun`;
    } else if (chooseTemplate == 4) {
        // pretplata email
        selectedTemplate = 'raspored_pretplata';
        selectedContext = {email            : tableData.receiverEmail,
                           urlRoute         : tableData.urlR,
                           homeRoute        : tableData.homeR,
                           subscribeRoute   : tableData.subscribeR,
                           tokenUrl         : tableData.tokenR,
                           timeExpired      : tableData.tExpired,
                           privacyRoute     : tableData.privacyR
        };
        selectedSubject = `Validacija o pretplati`;
    } else if (chooseTemplate == 'postavke-potvrda' || chooseTemplate == 'prekid-pretplate-potvrda') {
        // postavke-potvrda email
        selectedTemplate = 'raspored_settings_confirm';
        selectedContext = {email            : tableData.receiverEmail,
                           timeExpired      : tableData.tExpired,
                           urlRoute         : await routeNames.giveRouteName('url'),
                           homeRoute        : await routeNames.giveRouteName('home'),
                           settingsRoute    : await routeNames.giveRouteName('settings'),
                           tokenUrl         : tableData.tokenR,
                           unsubscribeRoute : await routeNames.giveRouteName('unsubscribe')
        };
        selectedSubject = `Validacija o promijeni postavki računa`

        if (chooseTemplate == 'prekid-pretplate-potvrda') {
            selectedTemplate = 'raspored_unsubscribe_confirm';
            selectedSubject = 'Validacija o prekidu pretplate';
        }
    } 
    // povezivanje s posiljateljom
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: username,
            pass: password
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
        from: `Raspored bot <${username}>`,
        to: tableData.receiverEmail,
        subject: selectedSubject,
        template: selectedTemplate,
        context: selectedContext
    };
    // slanje e-maila
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(prefix + ' ' + error);
        } else {
            console.log(prefix + ' E-mail poslan: ' + info.response);
        }
    });
}

exports.send_changes = async(tableData, j, chooseTemplate) => {
    console.log(prefix + ' Nova izmjena za korisnika: ' + tableData.receiverEmail + ' Razred: ' + tableData.className + '.');
    await database.updateLastSend(tableData.changeID, tableData.receiverEmail);
    await this.sender(tableData, j, chooseTemplate);
    console.log(prefix + ' Zadnja poslana: ' + tableData.changeID);
}