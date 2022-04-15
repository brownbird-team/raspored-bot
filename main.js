const { query, database } = require("./databaseConnect.js");

// Tetni Query samo da isprobamo
query(`USE ${database.name}; SHOW TABLES`, (err, result) => {
    console.log("\nTest Query - Lista svih tablica u bazi:\n");
    for(let i = 0; i < result[1].length; i++) {
        console.log(result[1][i][`Tables_in_${database.name}`]);
    }
});