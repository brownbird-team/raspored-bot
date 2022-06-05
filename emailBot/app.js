const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const handlebars = require('express-handlebars');
const database = require('./rasporedEmailFunkcije');
const routeNames = require('./getRouteName');

let path = require('path');

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
}));
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded( {extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit: '1mb'}));

const step = 43200000;
const checkTokenState = () => {
    setTimeout(async () => {
        let tokenList1 = await database.getTokens('mail_korisnici');
        let tokenList2 = await database.getTokens('mail_privremeni_korisnici');
        for (token in tokenList1) {
            try {
                await database.checkToken(tokenList1[token], 'mail_korisnici');
            } catch {
                continue;
            }
        }
        for (token in tokenList2) {
            try {
                await database.checkToken(tokenList2[token], 'mail_privremeni_korisnici');
                await database.deleteTempData(tokenList2[token]);                
            } catch {
                continue;
            }
        }
        checkTokenState();
    }, step);
}
checkTokenState();

/*=============== API ROUTES ===============*/

let initialize = async() => {
    let rNames = await routeNames.giveAllRouteNames();
    app.use(`/${rNames[0]}`, require('./routes/home'));
    app.use(`/${rNames[0]}/${rNames[1]}`, require('./routes/subscribe'));
    app.use(`/${rNames[0]}/${rNames[2]}`, require('./routes/settings'));
    app.use(`/${rNames[0]}/${rNames[3]}`, require('./routes/unsubscribe'));
    app.use(`/${rNames[0]}/${rNames[4]}`, require('./routes/privacyPolicy'));
    app.use('/*', require('./routes/page404'));
}
initialize();

app.listen(port, () => {
    console.log("[\u001b[33mEmail\033[00m]" + ` Server started at ${require("./routeNames.json").url}`);
});
