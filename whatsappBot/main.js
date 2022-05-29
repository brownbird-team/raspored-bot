const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');

//liberary za bazu
const fs = require('fs');
const { wapLog } = require('./helperFunctionsWap.js');
const baza = require('./databaseQueriesWap.js');

//Novi klijent
const client = new Client({
    authStrategy: new LocalAuth()
});

// Pogledaj imena svih datoteka koje završavaju na .js u commands folderu
client.commands = [];
commandFiles = fs.readdirSync('./whatsappBot/commands').filter(file => file.endsWith('.js'));

// Dodaj svake naredbe u client.commands array
for (file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.push(command);
}

//Generiranje qr koda
client.on('qr', qr => {
    wapLog('Generiram QR code ...');
    qrcode.generate(qr, {small: true});
});

//Provjera da li je klijent spojen
client.on('ready', () => {
    wapLog('Klijent je spreman !');
    // Ispiši ime zadnjeg chata
    client.getChats().then(chats => {
        wapLog('Zadnji chat je: ' + chats[0].name);
    });
});

//kod za gašenje servera
process.on("SIGINT", async () => {
    wapLog("(SIGINT) Shutting down...");
    await client.destroy();
    process.exit(0);
});

client.on('message', async (msg) => {
    console.log(msg.body);
    // Pronađi chat i kontakt gdje je poruka poslana
    const chat = await msg.getChat();
    const kontakt = await msg.getContact();
    // Seenaj poruke u tom chatu
    await chat.sendSeen();

    // Definiraj primarni ključ u bazi za ovaj chat
    let bazaId;
    if (chat.isGroup) {
        bazaId = chat.id.user;
    } else {
        bazaId = kontakt.number;
    }

    // Zatraži podatke iz baze za taj ključ
    bazaVal = await baza.dajKontakt(bazaId);

    // Ako ključ ne postoji dodaj ga i zatraži opet
    if (!bazaVal) {
        await baza.dodajKontakt(bazaId);
        bazaVal = await baza.dajKontakt(bazaId);
    }

    // Ako je poruka listResponse obradi ju na poseban način
    if (msg.type === 'list_response') {
        // Pretraži koja naredba podržava id odabranog retka
        const listCommand = client.commands.find(cmd =>
            cmd.hasList && msg.selectedRowId.startsWith(cmd.listIdPrefix)
        );
        // Ako naredba postoji
        if (listCommand) {
            // Ako naredba zahtjeva admin ovlasti a korisnik ih nema pošalji grešku
            if (listCommand.adminOnly && chat.isGroup && !chat.participants.some(member => member.id.user === kontakt.id.user && member.isAdmin)) {
                client.sendMessage(msg.from, 'Ovaj izbornik smiju koristiti samo Administratori grupe');
                return;
            } else {
                // Pokreni obradu naredbe
                listCommand.executeListResponse(msg, bazaVal, client);
            }
        }
        // Inače samo ignoriraj
        return;
    }

    // Izvuci prefix, naredba bez i sa prefixom iz msg.body
    const prefix = bazaVal.prefix;
    const prefixCommand = msg.body.split(' ')[0];
    const primaryCommand = prefixCommand.slice(prefix.length);

    // Potraži postoji li tražena naredba
    const command = client.commands.find(cmd => {
        // Ako je naredba namijenjana da bude izvršena bez prefixa
        if (cmd.noPrefix) {
            return cmd.name === prefixCommand || cmd.aliases.includes(prefixCommand);
        // ili sa prefixom
        } else if (prefixCommand.startsWith(prefix)) {
            return cmd.name === primaryCommand || cmd.aliases.includes(primaryCommand);
        } else {
            return false;
        }
    });

    // Ako tražena naredba ne postoji zanemari
    if (!command) return;
    // Ako je naredba namijenjena samo za grupe, a chat nije grupa, zanemari
    if (command.type === 'group' && !chat.isGroup) return;
    // Ako je naredba namijenjena samo za private, a chat nije private, zanemari
    if (command.type === 'private' && chat.isGroup) return;
    
    // Ako su za naredbu potrebne admin ovlasti a korisnik ih nema pošalji grešku
    if (command.adminOnly && chat.isGroup && !chat.participants.some(member => member.id.user === kontakt.id.user && member.isAdmin)) {
        client.sendMessage(msg.from, 'Ovu naredbu mogu koristiti samo Administratori grupe');
        return;
    }

    // Ako je sve prošlo OK izvrši naredbu
    command.execute(msg, bazaVal, client);
});

// Pokreni klijenta
client.initialize();