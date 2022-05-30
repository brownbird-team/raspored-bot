const fs = require("fs");

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