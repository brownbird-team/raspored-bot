let send = require("./rasporedEmail");
let mysql = require("mysql");
const Connection = require("mysql/lib/Connection");
let conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "lukadim",
    database: "rasporedgit"
});
/*
const mysql = require("mysql");
const { configCheck, getData } = require("../configCheck.js");

configCheck();
const database = getData().database;

const conn = mysql.createConnection({
    host: database.host,
    port: database.port,
    user: database.user,
    password: database.pass,
    multipleStatements: true,
    database: database.name
});
*/
let css = `     
        <style>
        * {
        padding: 0;
        margin: 0;
        }

        html {
        font-family: sans-serif, "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS";
        font-weight: 400;
        color: rgb(239, 255, 238);
        padding-top: 50px;
        }

        table, tr, td, th {
        border: 1px solid rgb(255, 255, 255);
        border-collapse: collapse;
        border-style: none;
        padding: 5px;
        }

        td {
        text-align: center;
        color: rgb(73, 71, 71);
        }

        table {
        width: 250px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }

        table.center {
        margin-left: auto;
        margin-right: auto;
        }

        tr {
        background-color: #EEEEEE;
        border-bottom: thin solid #C3C3C3;
        }

        tr:first-child {
        background-color: #009879;
        border: none;
        }

        tr:last-child {
        border: none;
        }
        </style>`

let test;
/*let htmlMessage = `
    <style>
        * {
        padding: 0;
        margin: 0;
        }

        html {
        font-family: sans-serif, "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS";
        font-weight: 400;
        color: rgb(239, 255, 238);
        padding-top: 50px;
        }

        table, tr, td, th {
        border: 1px solid rgb(255, 255, 255);
        border-collapse: collapse;
        border-style: none;
        padding: 5px;
        }

        td {
        text-align: center;
        color: rgb(73, 71, 71);
        }

        table {
        width: 250px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
        }

        table.center {
        margin-left: auto;
        margin-right: auto;
        }

        tr {
        background-color: #EEEEEE;
        border-bottom: thin solid #C3C3C3;
        }

        tr:first-child {
        background-color: #009879;
        border: none;
        }

        tr:last-child {
        border: none;
        }
    </style>
    <table class="center">
        <caption style="color:rgb(73, 71, 71);
        font-weight: bold;padding-bottom: 10px;text-align: left;"
        >IZMJENE U RASPOREDU - SRIJEDA, 13. TRAVANJA 2022.<br>POSLIJEPODNE</caption>
        <tr>
            <th>Sat</th>
            <th>Izmjena</th>
        </tr>
        <tr name="red">
            <td name="sat">-1.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;0.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;1.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;2.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;3.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;4.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;5.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;6.</td>
            <td><b name="izmjena"></b></td>
        </tr>
        <tr name="red">
            <td name="sat">&nbsp;7.</td>
            <td><b name="izmjena"></b></td>
        </tr>
    </table>`
*/
conn.connect(function(error){
    if (error) throw error;
    console.log("Connected");

    // query za mail_korisnici
    mailKorisnici = `SELECT * FROM mail_korisnici`;
    conn.query(mailKorisnici, function(error, result) {
        if (error) throw error;
        console.log("Duljina objekta: " + result.length);

        for (let i = 0; i < result.length; i++) {
            let tableData = {};
            let satiUjutro = {};
            let satiPopodne = {};
            
            if (result[i].unsubscribed == 0) {  // provjera da li korisnik prima izmjene
                // korisnik prima izmjene
                if (result[i].salji_sve == 0) {
                    // korisnik ne zeli da mu dolaze sve izmjene
                    tableData.receiverEmail = result[i].adresa;
                    tableData.razredID = result[i].razred_id;

                    // query za general_razred
                    generalRazred = `SELECT * FROM general_razred WHERE id = '${tableData.razredID}'`;
                    conn.query(generalRazred, function(error, result){
                        if (error) throw error;

                        if (result[0].aktivan == 1) {
                            console.log(`Razred ${result[0].ime} je aktivan.`);

                            // query za izmjene_razred
                            izmjeneRazred = `SELECT id,razred_id,tablica_id,sat1,sat2,sat3,sat4,sat5,sat6,sat7,sat8,sat9 
                            FROM izmjene_razred WHERE razred_id = '${tableData.razredID}'`;

                            conn.query(izmjeneRazred, function(error, result) {
                                if (error) throw error;
                                tableData.tablicaID = result[0].tablica_id;
                                
                                for (let j = 1; j < 10; j++)
                                    satiUjutro[`sat${j}`] = result[0][`sat${j}`];
                                    
                                for (let j = -1, k = 1; k < 10; j++, k++)
                                    if (j == -1)
                                        satiPopodne[`sat_${j+2}`] = result[0][`sat${k}`];
                                    else
                                        satiPopodne[`sat${j}`] = result[0][`sat${k}`];

                                // query za izmjene_tablica
                                izmjeneTablica = `SELECT * FROM izmjene_tablica WHERE id = '${tableData.tablicaID}'`;

                                conn.query(izmjeneTablica, function(error, result) {
                                    if (error) throw error;
                                    
                                    tableData.naslovTablice = result[0].naslov;
                                    tableData.ujutro = result[0].prijepodne;

                                    if (tableData.ujutro == 0){
                                        // razred je popodne
                                        tableData.izmjeneSati = satiPopodne;
                                        tableData.naslovSmjene = "POSLIJEPODNE";
                                        html = `
                                        <table class="center">
                                            <caption style="color:rgb(73, 71, 71);
                                            font-weight: bold;padding-bottom: 10px;text-align: left;"
                                            >${tableData.naslovTablice}<br>${tableData.naslovSmjene}</caption>
                                            <tr>
                                                <th>Sat</th>
                                                <th>Izmjena</th>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">-1.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat_1}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;0.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat0}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;1.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat1}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;2.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat2}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;3.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat3}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;4.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat4}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;5.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat5}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;6.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat6}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;7.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat7}</b></td>
                                            </tr>
                                        </table>`
                                        message = css + html;
                                        send.send_email(tableData.receiverEmail, message);
                                        
                                    } else {
                                        // razred je ujutro
                                        tableData.izmjeneSati = satiUjutro;
                                        tableData.naslovSmjene = "PRIJEPODNE";
                                        html = `
                                        <table class="center">
                                            <caption style="color:rgb(73, 71, 71);
                                            font-weight: bold;padding-bottom: 10px;text-align: left;"
                                            >${tableData.naslovTablice}<br>${tableData.naslovSmjene}</caption>
                                            <tr>
                                                <th>Sat</th>
                                                <th>Izmjena</th>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">1.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat1}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;2.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat2}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;3.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat3}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;4.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat4}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;5.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat5}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;6.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat6}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;7.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat7}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;8.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat8}</b></td>
                                            </tr>
                                            <tr name="red">
                                                <td name="sat">&nbsp;9.</td>
                                                <td><b name="izmjena">${tableData.izmjeneSati.sat9}</b></td>
                                            </tr>
                                        </table>`
                                        message = css + html;
                                        send.send_email(tableData.receiverEmail, message);
                                    }
                                });    
                            });
                        } else {
                            console.log(`Razred ${result[0].ime} nije aktivan.`);
                        }
                    }); 
                } else {
                    // korisnik zeli da mu dolaze sve izmjene

                }
            } else { 
                // korisnik ne prima izmjene

            }
        }
    });
});
