//liberary za qr kod i whatsapp
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

//liberary za spremanje sesije
const fs = require('fs');

//liberary za spajanje na bazu
var mysql = require('mysql');
const {promiseQuery, query} = require('../databaseConnect.js');
const { get } = require('http');
const { getCharsetNumber } = require('mysql/lib/ConnectionConfig');

//funkcija za dobivanja podataka iz baze
const baza = require('../databaseQueries.js');

//Novi klijent
const client = new Client({
    authStrategy: new LocalAuth()
});

//Generiranje qr koda
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

//Provjera da li je klijent spojen
client.on('ready', () => {
    console.log('Client is ready!');
    client.getChats().then(chats => {
        console.log(chats[0]);
    });
});

//kod za gašenje servera
process.on("SIGINT", async () => {
    console.log("(SIGINT) Shutting down...");
    await client.destroy();
    process.exit(0);
});


client.on('message', async msg => {
    //Pomoć korisniku
    if (msg.body == '.help') {
        client.sendMessage(msg.from, '```.r <ime razreda> = ispis rasporeda za vaš razred.```');
    }
    
    if (msg.body != '.help') {

        //Dobivanje razreda iz naredbe .r
        let razred = msg.body;
        razred = razred.slice(-3);
        console.log(razred);
        
        if (msg.body == `.r ${razred}`) {
            //Dobivanje podataka o klijentovom razredu
            const razred_data = await baza.dajRazredByName(razred);
            console.log(razred_data.id);
            let izmjena = await baza.dajZadnju(razred_data.id);
            console.log(izmjena);
            //Ispis izmjena korisniku
            let izmjena_test = `${izmjena.naslov}`;
            if (izmjena.ujutro) {
                izmjena_test += '\n*Prijepodne*';
                for (let i = 1; i < 10; i++) {
                    izmjena_test += '\n```'+`${i}. sat = ${izmjena[`sat${i}`]}`+'```';
                }
            }else {
                izmjena_test += '\n*Poslijepodne*';
                for (let i = 1; i < 10; i++) {
                    izmjena_test += '\n```'+`${ (i===-1) ? ` ` : ``}${i-2}. sat = ${izmjena[`sat${i}`]}`+'```';
                }
            }            
            client.sendMessage(msg.from, izmjena_test);
        }
    }
});
client.initialize();