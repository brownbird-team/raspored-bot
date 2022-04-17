//importa puppeteer(nest ko selenium)
const puppeteer = require('puppeteer');

//Definira url i razred
let url='https://www.tsrb.hr/b-smjena/';
let raz='3.D';

//Funkcija
async function raspored(url,raz){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 0,
    });

    //Dobivanje linka od iframea
    const [iframe]= await page.$x('//*[@id="dnevne-izmjene-u-rasporedu-sati-tab"]/iframe')
    const src=await iframe.getProperty('src');
    const iframeTXT=await src.jsonValue();
    console.log({iframeTXT});

    //Odlazi na url od iframea
    await page.goto(iframeTXT);
    //sprema sve spanove u jedno polje
    const svi_spanovi_scrape= await page.$x('//*/div/table/tbody/tr/td');
    const col_scrape = await page.$x("//*/div/table/tbody/tr/td/@colspan");
    const naslovi_scrape = await page.$x("/html/body/div/div/p/span");

    let svi_spanovi=[];
    let col=[];
    let naslovi=[];
    let broj_tablica=0;

    izmjena={
        naslov:null,
        smjena:null,
        prijepode:null,
        datum:null,
        razred:raz,
        sat1:null,
        sat2:null,
        sat3:null,
        sat4:null,
        sat5:null,
        sat6:null,
        sat7:null,
        sat8:null,
        sat9:null,
        iframe:null,
    };

    for(index in svi_spanovi_scrape){
        const str_txt=await svi_spanovi_scrape[index].getProperty('textContent');
        svi_spanovi[index]=await str_txt.jsonValue();
    }
    for(index in naslovi_scrape){
        const str_txt=await naslovi_scrape[index].getProperty('textContent');
        naslovi[index]=await str_txt.jsonValue();
    }
    for(index in col_scrape){
        const str_txt=await col_scrape[index].getProperty('textContent');
        col[index]=await str_txt.jsonValue();
    }
    for(index in naslovi){
        if(naslovi[index].startsWith('IZMJENE U RASPOREDU')){
            broj_tablica++;
        }
    }
    console.log(broj_tablica);
    browser.close();
}
raspored(url,raz);