const { application, query } = require('express');
const express = require('express');
let path = require('path');
const port = process.env.PORT || 5000;
const {promiseQuery} = require('./../databaseConnect.js');

const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(express.static(path.join(__dirname, 'public')));

// Funkcija za upis podataka u bazu
async function insertInto(email, classID, sendAll, darkTheme) {
    sql = await promiseQuery(`INSERT INTO mail_korisnici (adresa, razred_id, salji_sve, tamna_tema) VALUES ('${email}', '${classID}', '${sendAll}', '${darkTheme}')`);
}

// API ROUTES
app.get('/form',(req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/', (req, res) => {
    let email = req.body.email;
    let classID = req.body.razred;
    let sendAll, darkTheme;
    if (req.body.saljiSve == undefined)
        sendAll = 0;
    else
        sendAll = 1;
    if (req.body.tamnaTema == undefined)
        darkTheme = 0;
    else
        darkTheme = 1;
    insertInto(email, classID, sendAll, darkTheme);
    res.sendFile(__dirname + '/public/thanks.html');
});


app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});