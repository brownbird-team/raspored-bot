const express = require('express');
const cors = require("cors");
const api = require('./api/main.js');
const staticNotFound = require('./middleware/staticNotFound.js');
const loadConfig = require('./../loadConfig');
const helpers = require('./helperFunctionsWeb.js');
const path = require('path');

// Povuci config iz datoteke
const config = loadConfig.getData();
// Kreiraj app objekt
const app = express();

// Dopusti cors kako bi drugi mogli koristiti API za izmjene
app.use(cors());

// Dodaj rutu za api (komunikacija klijenta sa serverom)
app.use('/api', api);
// Statične datoteke za email kontrolnu ploču
app.use('/static', express.static(__dirname + '/public', { fallthrough: false }));

// Ako statični file ne postoji handle-aj grešku
app.use(staticNotFound);

// Statične datoteke za admin panel
app.use('/assets', express.static(__dirname + '/../panel/dist/assets'));
// Entry point za admin panel
app.get([ '/panel', '/panel/*' ], (req, res) => {
    res.sendFile(path.resolve(__dirname + '/../panel/dist/index.html'));
});

// Sve ostale rute posluži preko email kontrolne ploče
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