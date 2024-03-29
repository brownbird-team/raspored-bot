const puppeteer = require('puppeteer');
const baza = require('./databaseQueriesScraper');
const { uzbuna } = require('./../notifyPeople.js');
const { scraperLog } = require('./helperFunctionsScraper.js');
const errors = require('./../errors.js');
const config = require('./../loadConfig.js');

const debugMode = config.getData().debugMode;

async function scraper(raz) {
    // url
    const url = await baza.getOption(`urlSmjena${raz[0].smjena}`);

    if (debugMode) scraperLog('Running check for '+raz[0].smjena+' shift');
    
    // Spajanje na stranicu
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    try {
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0,
         });
    } catch (error) {
        throw new errors.ScraperError(`Error occurred while scraping main web page for shift ${raz[0].smjena}`, error);
    }

    // Dobivanje linka od iframea
    const [iframe] = await page.$x('//*[@id="dnevne-izmjene-u-rasporedu-sati-tab"]/iframe')
    const src = await iframe.getProperty('src');
    const iframeTXT = await src.jsonValue();
    

    //Odlazi na url od iframea
    try {
        await page.goto(iframeTXT);
    } catch (error) {
        throw new errors.ScraperError(`Error occurred while scraping main izmjene page for shift ${raz[0].smjena}`, error);
    }
    

    // Napravi niz svih polja tablica
    const svi_spanovi_scrape= await page.$x('//*/div/table/tbody/tr/td');
    // Spremi colspan za svako polje tablica
    const col_scrape = await page.$x("//*/div/table/tbody/tr/td/@colspan");
    // Napravi niz svih paragrafa na stranici
    const naslovi_scrape = await page.$x("/html/body/div/div/p");

    let svi_spanovi=[];  // Sadržaj svakog od polja tablica
    let col=[];          // Colspan svakog polja tablica
    let naslovi=[];      // Naslov svake od tablica
    
    let k = 0;                      // Koju tablicu trenutno obrađujemo (brojač za tablica.redni_broj)
    let control = 0;                // Broji na kojoj smo čeliji danog reda
    let broj_tablica = 0;           // Koliko ukupno tablica imamo
    let result = [];                // Krajnji objekt sa rezultatom pretrage
    let broj_razreda = raz.length;  // Koliko ukupno razreda imamo

    // Izvuci ime svakog od razreda
    let ime = [];
    for (let i in raz){
        ime[i] = raz[i].ime;
    }
    
    // Izvuci tekstualni sadržaj svakog od elemenata koje je dobavio scraper
    for (let index in svi_spanovi_scrape){
        const str_txt=await svi_spanovi_scrape[index].getProperty('textContent');
        svi_spanovi[index]=await str_txt.jsonValue();
    }
    for (let index in naslovi_scrape){
        const str_txt=await naslovi_scrape[index].getProperty('textContent');
        naslovi[index]=await str_txt.jsonValue();
    }
    for (let index in col_scrape){
        const str_txt=await col_scrape[index].getProperty('textContent');
        col[index]=await str_txt.jsonValue();
    }
    // Za svaki od paragrafa provjeri je li naslov
    // ako je, povećaj broj tablica
    for (let index in naslovi){
        if(naslovi[index].startsWith('IZMJENE U RASPOREDU')){
            broj_tablica++;
        }
    }

    // Inicijaliziraj vrijednosti svakog objekta u result polju
    for(let i = 0; i < broj_tablica; i++){
        
        result[i]={
            izmjene_tablica:{naslov:null,smjena:null,prijepode:null},
            izmjene_razred:[],
        }
        for(let j in raz){
            result[i].izmjene_razred[j]={
                datum:null,
                razred:null,
                sat1:null,
                sat2:null,
                sat3:null,
                sat4:null,
                sat5:null,
                sat6:null,
                sat7:null,
                sat8:null,
                sat9:null,
            }
        }
    }
    // Postavi naslov i smjenu svake od tablica
    broj_tablica = 0;
    for(let index in naslovi){
        if(naslovi[index].startsWith('IZMJENE U RASPOREDU')){
            result[broj_tablica].izmjene_tablica.naslov=naslovi[index];
            result[broj_tablica].izmjene_tablica.smjena=raz[0].smjena;
            broj_tablica++;
        }
    }

    // Čitanje izmjena iz prikupljenih podataka

    // Trenutni razred
    let l = 0;
    // Za svaku od čelija u tablicama
    for(let index in svi_spanovi){
        // Ako sadržaj ćelije počinje s 9 znači da je jutarnja smjena
        if(svi_spanovi[index].startsWith('9')){
            result[k].izmjene_tablica.prijepode=1;
        }
        // Ako počinje s -1 popodnevna je
        else if(svi_spanovi[index].startsWith('-1')){
            result[k].izmjene_tablica.prijepode=0;
        }
        // Ako je sadržaj dane čelije ime jednog od razreda
        else if(ime.includes(svi_spanovi[index])){
            // Postavi da se trenutno gledaju izmjene za razred tog imena
            result[k].izmjene_razred[l].razred=svi_spanovi[index];
            // Sljedeće ćelije su ćelije sa izmjenama
            control=1;
        }
        // Ako trenutno gledamo za čelije s izmjenama
        else if(control < 10 && control > 0){
            // Ako se čelija proteže kroz više sati sadržaj čelije dodaj za svaki sat
            for(let j = 0; j < col[index]; j++){
                result[k].izmjene_razred[l][`sat${control}`]=svi_spanovi[index];
                control++
            }
            // Ako smo obradili svih 9 sati izmjena, pređi na sljedeći razred
            if(control==10){
                l++
            }
            // Ako smo obradili sve razrede ove tablice, počni od prvog razreda i pređi
            // na sljedeću tablicu
            if(l==broj_razreda){
                l=0;
                k++
            }
        }
        // Ako smo obradili sve tablice prekini
        if (k >= broj_tablica)
            break;
    }

    browser.close();
    return result;
}

async function sql_upis(izmjena, razredi) {
    // Sada
    const now = new Date();
    // Formiraj trenutno vrijeme/datum (mjeseci iz nekog razloga pocinju od 0)
    const datum = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
    
    // Za svaku tablicu izmjena
    for (let index = izmjena.length - 1; index >= 0; index--) {
        // Provjeri postoji li tablica
        const tablica = await baza.tablica_postoji(izmjena, index);
        
        // Ako tablica ne postoji
        if (!tablica) {
            // Upiši tablicu u bazu
            await baza.upis_naslova_u_bazu(izmjena,index);
        }

        // Dobavi ID tablice
        const tablica_id = await baza.dobi_id_tablice(izmjena,index);
        
        // Za svaki razred u toj tablici
        for (let index2 in izmjena[index].izmjene_razred) {
            let razred_id;
            // Dobavi razred id
            for(let i in razredi) {
                if(razredi[i].ime == izmjena[index].izmjene_razred[index2].razred){
                    razred_id = razredi[i].id;
                }
            }

            // Provjeri je li razred upisan
            const razred_upis = await baza.select_baza_izmjene(izmjena, index, index2, tablica_id, razred_id);
            // Ako nije upiši ga
            if (razred_upis == false) {
                razred_upis_sad = await baza.upis_izmjena_u_bazu(izmjena, index, index2, datum, tablica_id, razred_id);
            }
        }
    }
}

exports.run = async () => {
    let prije, poslje;  // Broj izmjena prije i poslije upisa novih
    let razredi_A;      // Array razreda A smjene
    let razredi_B;      // Array razreda B smjene
    let izmjena;        // Izmjene razreda trenutne smjene

    // Provjeri trenutan broj izmjena
    prije = await baza.broj_izmjena();
    // Dobavi razrede A smjene
    razredi_A = await baza.razredi_iz_smjene('A');
    // Dobavi razrede B smjene
    razredi_B = await baza.razredi_iz_smjene('B');
    
    // Pogledaj na Web za izmjene A smjene
    izmjena = await scraper(razredi_A);
    // Upiši izmjene u bazu
    await sql_upis(izmjena, razredi_A);
    if (debugMode) scraperLog('Done (A)');

    // Pogledaj na Web za izmjene A smjene
    izmjena = await scraper(razredi_B);
    // Upiši izmjene u bazu
    await sql_upis(izmjena, razredi_B);
    if (debugMode) scraperLog('Done (B)')

    // Provjeri broj izmjena nakon upisa
    poslje = await baza.broj_izmjena();
    // Ako se broj izmjena prije i nakon upisa razlikuje pokreni funkcije
    // koje šalju notifikacije korisnicima
    if (poslje != prije){
        uzbuna();
    }
}