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
const f_baza = require('./funkcije_za_bazu');

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

//Odgovaranje na naredbe
client.on('message', async msg => {
    const result = await msg.getContact();
    const broj = result.number;

    const kontakt = await f_baza.dajKontakt(broj);

    if (!kontakt) {
        await f_baza.dodaj_broj(broj);
    }
    console.log(kontakt);
    

    //Pomoć korisniku
    if (msg.body == '.help') {
        console.log("Korisnik traži pomoć");
        client.sendMessage(msg.from, '```.r <ime svojeg razreda> = ```\nispis rasporeda za vaš razred.'+'\n```.subscribe = ```\nza odabir ako želite da vam bot šalje izmjene'+'\n```.unsubscribe = ```\nza odabir ako ne želite da vam bot šalje izmjene'+'\n```.saljisve = ```\nza odabir ako želite da vam bot šalje izmjene, čak i ako ih nema za taj dan'+'\n```.nesaljisve = ```\nza odabir ako ne želite da vam bot šalje izmjene, čak i ako ih nema za taj dan');
    }    

    
    //Dobivanje razreda iz naredbe .r
    let razred = msg.body;
    razred = razred.slice(-3);
    console.log(razred);
    
    //Odgovor na .r <ime razreda> naredbu.
    if (msg.body == `.r ${razred}`) {
        //Dobivanje podataka o klijentovom razredu
        const razred_data = await baza.dajRazredByName(razred);
        let izmjena = await baza.dajZadnju(razred_data.id);
        console.log("Izmjena u rasporedu.")
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
        await f_baza.dodaj_zadnju_poslanu(izmjena.id, broj);



        //Uzimanje razred id
        const razred_id = razred_data.id;
        console.log("Razred id.");
        console.log(razred_id);
        await f_baza.dodaj_razred_id(razred_id, broj);
    }

    
    //Da li korisnik želi ili ne želi primati izmjene
    //Odgovor na .subscribe
    let sub;
    if (msg.body == '.subscribe') {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski.```');
        console.log("Subscribe");
        sub = 1;
        await f_baza.dodaj_salji_izmjene(sub, broj);
    }
    //Odgovor na .unsubscribe
    if (msg.body == '.unsubscribe') {
        client.sendMessage(msg.from, '```Raspored bot vam neće od sada slati dnevne izmjene automatski.```');
        console.log("Unubscribe");
        sub = 0;
        await f_baza.dodaj_ne_salji_izmjene(sub, broj);
    }


    //Odgovor na .saljisve
    let sve;
    if (msg.body == '.saljisve') {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
        console.log("Salji sve");
        sve = 1;
        await f_baza.dodaj_salji_izmjene_ako_ih_nema(sve, broj);
    }
    //Odgovor na .nesaljisve
    if (msg.body == '.nesaljisve') {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada neće slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
        console.log("Ne salji sve");
        sve = 0;
        await f_baza.dodaj_ne_salji_izmjene_ako_ih_nema(sve, broj);
    }

});
client.initialize();