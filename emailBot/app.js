const { application, query } = require('express');
const express = require('express');
let path = require('path');
const port = process.env.PORT || 5000;
const {promiseQuery} = require('./../databaseConnect.js');
const database = require('./rasporedEmailFunkcije');
let token = require('./createToken');
const app = express();


async function insertInto(email, classID, token, date, sendAll, darkTheme) {
    sql = await promiseQuery(`INSERT INTO mail_korisnici (adresa, razred_id, token, zadnji_token, salji_sve, tamna_tema) VALUES ('${email}', '${classID}','${token}', '${date}', '${sendAll}', '${darkTheme}')`);
}

async function getTokensFromDatabase() {
    dbTokens = await promiseQuery('SELECT token FROM mail_korisnici');
    for (t in dbTokens) {
        await getTokens(dbTokens[t].token);
    }
};

async function getTokens(t) {
    app.get('/unsubscribe/' + t, (req, res) => {
        res.sendFile(__dirname + '/public/unsubscribe.html');
    });
}

app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit: '1mb'}));
// API ROUTES

getTokensFromDatabase();

app.get('/form',(req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', (req, res) => {
    let email = req.body.email;
    let classID = req.body.razred;
    let sendAll, darkTheme;
    let active_token = token.token();
    const d = new Date();
    let date = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    if (req.body.saljiSve == undefined)
        sendAll = 0;
    else
        sendAll = 1;
    if (req.body.tamnaTema == undefined)
        darkTheme = 0;
    else
        darkTheme = 1;
    insertInto(email, classID, active_token, date, sendAll, darkTheme);
    res.sendFile(__dirname + '/public/thanks.html');
    app.get('/unsubscribe/' + active_token, (req, res) => {
        res.sendFile(__dirname + '/public/unsubscribe.html');
    });
});

app.post('/unsubscribe', async(req, res) => {
    await database.setUnsubscribe(req.body.token);
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
