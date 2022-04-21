//liberary za qr kod i whatsapp
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth, ChatTypes, LegacySessionAuth } = require('whatsapp-web.js');

//liberary za spremanje sesije
const fs = require('fs');

//liberary za spajanje na bazu
var mysql = require('mysql');
const {promiseQuery, query} = require('../databaseConnect.js');
const { get } = require('http');
const { getCharsetNumber } = require('mysql/lib/ConnectionConfig');



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
        console.log(chats[0])
    });
});

//kod za gašenje servera
process.on("SIGINT", async () => {
    console.log("(SIGINT) Shutting down...");
    await client.destroy();
    process.exit(0);
});


client.on('message', msg => {
    //Pomoć korisniku
    if (msg.body == '.help') {
        client.sendMessage(msg.from, '```.r <ime razreda> = ispis rasporeda za vaš razred.```');
    }
    
    let razred = msg.body;
    razred = razred.slice(-3);
    console.log(razred);
    /*
    if (msg.body == `.r ${razred}`) {

    }*/
   
});



client.initialize();