const express = require('express');
const cors = require("cors");
const api = require('./api/main.js');
const staticNotFound = require('./middleware/staticNotFound.js');
const loadConfig = require('./../loadConfig');
const helpers = require('./helperFunctionsWeb.js');

// Povuci config iz datoteke
const config = loadConfig.getData();
// Kreiraj app objekt
const app = express();

app.use(cors());

// Dodaj rutu za api (komunikacija klijenta sa serverom)
app.use('/api', api);
// Dodaj rutu za posluživanje statičnik datoteka (slika i sl)
app.use('/static', express.static(__dirname + '/public', { fallthrough: false }));

// Ako statični file ne postoji handle-aj grešku
app.use(staticNotFound);

// Sve ostale rute posluži web klijenta
app.get("*", (req, res) => {
    res.sendFile('./entry/index.html', { root: __dirname });
});

// Funkcija za pokretanje web servera
exports.start = () => {
    return new Promise((resolve, reject) => {
        app.listen(config.webServer.port, () => {
            helpers.webLog(`Web server listening on port ${config.webServer.port}`);
            resolve();
        });
    });
}