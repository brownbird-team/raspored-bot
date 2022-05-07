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
const dodaj_f_baza = require('./dodaj_f_4_bazu');
const daj_f_baza = require('./daj_f_4_bazu');
const f_baza = require('./f_4_bazu');

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

    if (broj != '385998711641' && broj != '385976158686' && broj != '385976644526') {
        const kontakt = await daj_f_baza.dajKontakt(broj);

        if (!kontakt) {
            await dodaj_f_baza.dodaj_broj(broj);
        }
        console.log(kontakt);

        let prefix = await daj_f_baza.daj_prefix(broj);
        prefix = prefix[0].prefix;
        

        //Pomoć korisniku
        if (msg.body == `${prefix}help`) {
            console.log("Korisnik traži pomoć");
            client.sendMessage(msg.from, `
            ${'*' + prefix + 'razred⎵<razred> (npr. 1.a)*'} = upis razreda u bazu\n
            ${'*' + prefix + 'r*'} = ispis rasporeda za vaš razred\n
            ${'*' + prefix + 'r⎵<ime svojeg razreda> (npr. 1.a)*'} = ispis rasporeda za željeni razred\n
            ${'*' + prefix + 'subscribe*'} = za odabir ako želite da vam bot šalje izmjene\n
            ${'*' + prefix + 'unsubscribe*'} = za odabir ako ne želite da vam bot šalje izmjene\n
            ${'*' + prefix + 'saljisve*'} = za odabir ako želite da vam bot šalje izmjene, čak i ako ih nema za taj dan\n
            ${'*' + prefix + 'nesaljisve*'} = za odabir ako ne želite da vam bot šalje izmjene, čak i ako ih nema za taj dan\n
            ${'*' + prefix + 'prefix⎵<prefix>*'} = za promjenu svojega prefixa. (prefix ne smije sadržavati razmake)\n
            *.resetpre* = za promjenu svojega prefixa nazad na točku.\n`);
        }

        
        //Odgovor na .prefix naredbu
        if (msg.body.startsWith(`${prefix}prefix`, 0)) {
            //if (msg.body != `${prefix}prefix `) {      
                prefix = msg.body;
                prefix = prefix.split(" ");
                prefix = prefix[1];
                //Provjera da li je prefix samo ACSII kodovi
                if (baza.onlyASCII(prefix)) {
                    novi_prefix = baza.prepareForSQL(prefix);
                    client.sendMessage(msg.from, `Vaš novi prefix je "${prefix}"`);
                    await dodaj_f_baza.dodaj_prefix(novi_prefix, broj);
                }else {
                    client.sendMessage(msg.from, `Vaš novi prefix nije validan.`);
                }
            //}
        }   
        
        //Dobivanje razreda iz naredbe .r
        let razred = msg.body;
        razred = razred.slice(-3);
        console.log(razred);

        const razred_data = await baza.dajRazredByName(razred);

        //Odgovor na .razred
        if (msg.body == `${prefix}razred ${razred}`) {
            //Dodavanje razred id
            const razred_id = razred_data.id;
            await dodaj_f_baza.dodaj_razred_id(razred_id, broj);
            client.sendMessage(msg.from, `Vaš razred je: ${razred}`);
        }

        //Daj razred id
        let user_razred_id = await dodaj_f_baza.daj_razred_id(broj);
        console.log(user_razred_id);

        let cijeli_razred = await baza.dajRazredById(user_razred_id);

        //Odgovor na .r naredbu
        if (msg.body == `${prefix}r` && user_razred_id) {
            //Dobivanje podataka o klijentovom razredu
            let izmjena = await baza.dajZadnju(cijeli_razred.id);
            console.log(izmjena);
            //Ispis izmjena korisniku
            let izmjena_test = `Za razred: ${cijeli_razred.ime}`;
            izmjena_test += `\n${izmjena.naslov}`;
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
            await dodaj_f_baza.dodaj_zadnju_poslanu(izmjena.id, broj);
        }else if (msg.body == `${prefix}r` && !user_razred_id) {
            client.sendMessage(msg.from, `Niste postavili razred`);
        }
        
        
        //Odgovor na .r <ime razreda> naredbu.
        if (msg.body == `${prefix}r ${razred}` && razred_data) {
            //Dobivanje podataka o klijentovom razredu
            let izmjena = await baza.dajZadnju(razred_data.id);
            console.log(izmjena);
            //Ispis izmjena korisniku
            let izmjena_test = `Za razred: ${razred}`;
            izmjena_test += `\n${izmjena.naslov}`;
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
            await dodaj_f_baza.dodaj_zadnju_poslanu(izmjena.id, broj);
        }
        

        
        //Da li korisnik želi ili ne želi primati izmjene
        //Odgovor na .subscribe
        let sub;
        if (msg.body == `${prefix}subscribe`) {
            client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski.```');
            console.log("Subscribe");
            sub = 1;
            await dodaj_f_baza.dodaj_salji_izmjene(sub, broj);
        }
        //Odgovor na .unsubscribe
        if (msg.body == `${prefix}unsubscribe`) {
            client.sendMessage(msg.from, '```Raspored bot vam neće od sada slati dnevne izmjene automatski.```');
            console.log("Unubscribe");
            sub = 0;
            await dodaj_f_baza.dodaj_ne_salji_izmjene(sub, broj);
        }


        //Odgovor na .saljisve
        let sve;
        if (msg.body == `${prefix}saljisve`) {
            client.sendMessage(msg.from, '```Raspored bot će vam od sada slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
            console.log("Salji sve");
            sve = 1;
            await dodaj_f_baza.dodaj_salji_izmjene_ako_ih_nema(sve, broj);
        }
        //Odgovor na .nesaljisve
        if (msg.body == `${prefix}nesaljisve`) {
            client.sendMessage(msg.from, '```Raspored bot će vam od sada neće slati dnevne izmjene automatski, čak i ako nema izmjena za taj dan.```');
            console.log("Ne salji sve");
            sve = 0;
            await dodaj_f_baza.dodaj_ne_salji_izmjene_ako_ih_nema(sve, broj);
        }

        
        let brojevi = await daj_f_baza.daj_brojeve();

        //Odgovor na .resetpre
        if (msg.body == `.resetpre`) {
            let resetirani_prefix = await f_baza.reset_prefix(broj);
            client.sendMessage(msg.from, `Resetirali ste prefix na "."`);
        }


        //Uzimanje podataka za izmjene iz baze
        let salji_izmjene = await daj_f_baza.daj_salji_izmjene(broj);
        salji_izmjene = salji_izmjene[0].salji_izmjene;
        console.log(salji_izmjene);
        let salji_sve = await daj_f_baza.daj_salji_sve(broj);
        salji_sve = salji_sve[0].salji_sve;
        console.log(salji_sve);
    }

    if (broj == '385998711641' || broj == '385976158686' || broj == '385976644526') {
        client.sendMessage(msg.from, `Za tebe nema.`);
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
    if (salji_izmjene === 1) {
        function interval() {
            client.sendMessage(msg.from, `${izmjena_test}`);
        }
        setInterval(interval, 5000);
    }
    */   
    
   
});
client.initialize();