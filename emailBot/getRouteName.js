const fs = require("fs");

if (!fs.existsSync("./emailBot/routeNames.json")) {
    console.log("[\u001b[33mEmail\033[00m]" + " Datoteka routeNames.json nije pronađena");
    try {
        fs.copyFileSync("./emailBot/routeNames.sample.json", "./emailBot/routeNames.json");
    } catch {
        console.log(err)
        console.log("[\u001b[33mEmail\033[00m]" + " Nije uspjelo kreiranje datoteke routeNames.json");
        console.log("[\u001b[33mEmail\033[00m]" + " Postoji li datoteka routeNames.sample.json ?");
        process.exit(1);
    }
    console.log("[\u001b[33mEmail\033[00m]" + " Datoteka routeNames.json uspješno kreirana");
}


exports.giveRouteName = (routeName) => {
    return new Promise(async (resolve, reject) => {
        fs.readFile("./emailBot/routeNames.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File 'routeNames' read failed:", err);
            }
            try {
                const names = JSON.parse(jsonString);
                resolve(names[`${routeName}`]);
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
    });
}

exports.giveAllRouteNames = () => {
    return new Promise(async (resolve, reject) => {
        fs.readFile("./emailBot/routeNames.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File 'routeNames' read failed:", err);
            }
            try {
                const names = JSON.parse(jsonString);
                let keys = Object.keys(names);
                let nameList = [];
                for (let i = 0; i < keys.length; i++) {
                    nameList[i] = names[keys[i]];
                }
                resolve(nameList);
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
    });
}
exports.giveAllRouteNames();