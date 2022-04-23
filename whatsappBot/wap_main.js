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
        client.sendMessage(msg.from, '```.r <ime razreda> = ```\nispis rasporeda za vaš razred.'+'\n```.subscribe = ```\nza odabir ako želite da vam bot šalje izmjene'+'\n```.unsubscribe = ```\nza odabir ako ne želite da vam bot šalje izmjene');

        //Uzimanje broja od korisnika
        client.getChats().then(chats => {
        const podatak = chats[0].id.user;
        console.log(podatak);
        });
    }

    //Korisnikov prefix
    const prefix = ".";
    
    //Dobivanje razreda iz naredbe .r
    let razred = msg.body;
    razred = razred.slice(-3);
    console.log(razred);
    
    //Odgovor na .r <ime razreda> naredbu.
    if (msg.body == `.r ${razred}`) {
        //Dobivanje podataka o klijentovom razredu
        const razred_data = await baza.dajRazredByName(razred);
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

        //Uzimanje razred id
        const razred_id = razred_data.id;
        console.log(razred_id);
    }

    
    //Da li korisnik želi ili ne želi primati izmjene
    //Odgovor na .subscribe
    let sub;
    if (msg.body == '.subscribe') {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski.```');
        sub = 1;
    }
    //Odgovor na .unsubscribe
    if (msg.body == '.unsubscribe') {
        client.sendMessage(msg.from, '```Raspored bot vam neće od sada slati dnevne izmjene automatski.```');
        sub = 0;
    }


    
        
    
    
});
client.initialize();