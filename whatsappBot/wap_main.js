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
const cli = require('nodemon/lib/cli');


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

    let prefix = await f_baza.daj_prefix(broj);
    prefix = prefix[0].prefix;
    

    //Pomoć korisniku
    if (msg.body == `${prefix}help`) {
        console.log("Korisnik traži pomoć");
        client.sendMessage(msg.from, `
        ${'*' + prefix + 'r⎵<ime svojeg razreda>*'} = ispis rasporeda za vaš razred\n
        ${'*' + prefix + 'subscribe*'} = za odabir ako želite da vam bot šalje izmjene\n
        ${'*' + prefix + 'unsubscribe*'} = za odabir ako ne želite da vam bot šalje izmjene\n
        ${'*' + prefix + 'saljisve*'} = za odabir ako želite da vam bot šalje izmjene, čak i ako ih nema za taj dan\n
        ${'*' + prefix + 'nesaljisve*'} = za odabir ako ne želite da vam bot šalje izmjene, čak i ako ih nema za taj dan\n
        ${'*' + prefix + 'prefix⎵<prefix>*'} = za promjenu svojega prefixa. (prefix ne smije sadržavati razmake)\n
        *.resetpre* = za promjenu svojega prefixa nazad na točku.\n`);
    }

    
    //Odgovor na .prefix naredbu
    if (msg.body.startsWith(`${prefix}prefix`, 0)) {
        prefix = msg.body;
        prefix = prefix.split(" ");
        prefix = prefix[1];
        client.sendMessage(msg.from, `Vaš novi prefix je "${prefix}"`);
        await f_baza.dodaj_prefix(prefix, broj);
    }   
    
    
    
    //Dobivanje razreda iz naredbe .r
    let razred = msg.body;
    razred = razred.slice(-3);
    
    //Odgovor na .r <ime razreda> naredbu.
    if (msg.body == `${prefix}r ${razred}`) {
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
        await f_baza.dodaj_zadnju_poslanu(izmjena.id, broj);



        //Uzimanje razred id
        const razred_id = razred_data.id;
        await f_baza.dodaj_razred_id(razred_id, broj);
    }

    
    //Da li korisnik želi ili ne želi primati izmjene
    //Odgovor na .subscribe
    let sub;
    if (msg.body == `${prefix}subscribe`) {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski.```');
        console.log("Subscribe");
        sub = 1;
        await f_baza.dodaj_salji_izmjene(sub, broj);
    }
    //Odgovor na .unsubscribe
    if (msg.body == `${prefix}unsubscribe`) {
        client.sendMessage(msg.from, '```Raspored bot vam neće od sada slati dnevne izmjene automatski.```');
        console.log("Unubscribe");
        sub = 0;
        await f_baza.dodaj_ne_salji_izmjene(sub, broj);
    }


    //Odgovor na .saljisve
    let sve;
    if (msg.body == `${prefix}saljisve`) {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
        console.log("Salji sve");
        sve = 1;
        await f_baza.dodaj_salji_izmjene_ako_ih_nema(sve, broj);
    }
    //Odgovor na .nesaljisve
    if (msg.body == `${prefix}nesaljisve`) {
        client.sendMessage(msg.from, '```Raspored bot će vam od sada neće slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
        console.log("Ne salji sve");
        sve = 0;
        await f_baza.dodaj_ne_salji_izmjene_ako_ih_nema(sve, broj);
    }

    
    let brojevi = await f_baza.daj_brojeve();
    console.log(brojevi);

    //Odgovor na .resetpre
    if (msg.body == `.resetpre`) {
        let resetirani_prefix = await f_baza.reset_prefix(broj);
        client.sendMessage(msg.from, `Resetirali ste prefix na "."`);
    }


    
    /*
    setTimeout(async () => {
        for (let i = 0; i < brojevi.length; i++) {
            const id = await client.getNumberId(brojevi[i].broj);
            await client.sendMessage(
                id,
                "Test"
            );    
        }        
    }, 5000);
    */

    /*
    function interval() {
        client.sendMessage(broj, `${izmjena_test}`);
    }
    setInterval(interval, 5000);
    */
   
});
client.initialize();