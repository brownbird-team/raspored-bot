//importa puppeteer(nest ko selenium)
const puppeteer = require('puppeteer');

//Definira url i razred
let url='https://www.tsrb.hr/a-smjena/';
let raz='2.D';

//Funkcija
async function raspored(url,raz){

    //Launcha puppeteer i odlazi na url
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    //Dobivanje linka od iframea
    const [iframe]= await page.$x('//*[@id="dnevne-izmjene-u-rasporedu-sati-tab"]/iframe')
    const src=await iframe.getProperty('src');
    const iframeTXT=await src.jsonValue();
    console.log({iframeTXT});

    //Odlazi na url od iframea
    await page.goto(iframeTXT);
    //sprema sve spanove u jedno polje
    const svi_spanovi= await page.$$('span');
    //Ispisuje raspored
    for(i=0;i<svi_spanovi.length;i++){
        const str_txt=await svi_spanovi[i].getProperty('textContent');
        let str_rawTxt=await str_txt.jsonValue();
        if(str_rawTxt.startsWith('IZMJENE U RASPOREDU')){
            console.log(str_rawTxt);
        }
        if(str_rawTxt==raz){
            console.log(str_rawTxt);
            var control=1;
        }
        else if(control < 10 && control > 0){
            console.log(control,".sat =",str_rawTxt);
            control++;
        }
    }
        browser.close();
}
raspored(url,raz);