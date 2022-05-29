const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const handlebars = require('express-handlebars');
const database = require('./rasporedEmailFunkcije'  );

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

app.use('/email', require('./routes/home'));
app.use('/pretplata', require('./routes/subscribe'));
app.use('/postavke', require('./routes/settings'));
app.use('/prekid-pretplate', require('./routes/unsubscribe'));
app.use('/*', require('./routes/page404'));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
