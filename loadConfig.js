// Kreiraj konfiguracijsku datoteku ako ne postoji,
// kopiranjem datoteke config.sample.json

const fs = require("fs");

let configChecked = false;

exports.configCheck = () => {
    configChecked = true;

    try {
        if (!fs.existsSync("./config.json")) {
            console.log("Datoteka config.json nije pronađena");
            try {
                fs.copyFileSync("./config.sample.json", "./config.json")
            } catch {
                console.log(err)
                console.log("Nije uspjelo kreiranje datoteke config.json");
                console.log("Postoji li datoteka config.sample.json ?");
                process.exit(1);
            }
            console.log("Datoteka config.json uspješno kreirana");
            console.log("Ispunite datoteku i ponovo pokrenite aplikaciju");
            process.exit(0);
        }
    } catch (err) {
        console.log(err);
    }
}

exports.getData = () => {
    if (!configChecked)
        this.configCheck();
    let rawdata = fs.readFileSync("./config.json");
    let jsonData = JSON.parse(rawdata);
    return jsonData;
}

exports.promiseGetData = () => {
    return new Promise((resolve, reject) => {
        if (!configChecked)
            this.configCheck();
        fs.readFile("./config.json", (err, rawdata) => {
            if(err) throw err;

            let jsonData = JSON.parse(rawdata);
            resolve(jsonData);
        });
    });
}