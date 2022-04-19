const puppeteer = require('puppeteer');
const {promiseQuery}=require('./../databaseConnect.js')
async function scraper(raz){
    //url
    let url='https://www.tsrb.hr/'+raz[0].smjena.toLowerCase()+'-smjena/';
    console.log(url);
    
    //Spajanje na stranicu
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

    //Sprema sve spanove u jedno polje
    const svi_spanovi_scrape= await page.$x('//*/div/table/tbody/tr/td');
    const col_scrape = await page.$x("//*/div/table/tbody/tr/td/@colspan");
    const naslovi_scrape = await page.$x("/html/body/div/div/p/span");

    let svi_spanovi=[];
    let col=[];
    let naslovi=[];
    
    //Brojac za tablica.redni_broj
    let k=0;
    let control=0;
    let broj_tablica=0;
    let result=[];
    let broj_razreda=0;

    for(i in raz)
     broj_razreda++;
    //Spremanje podataka u polje
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

    //Kreiranje result polja
    for(i=0;i<broj_tablica;i++){
        
        result[i]={
            izmjene_tablica:{naslov:null,smjena:null,prijepode:null},
            izmjene_razred:[],
        }
        for(j in raz){
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
    broj_tablica=0;
    for(index in naslovi){
        if(naslovi[index].startsWith('IZMJENE U RASPOREDU')){
            result[broj_tablica].izmjene_tablica.naslov=naslovi[index];
            result[broj_tablica].izmjene_tablica.smjena=raz[0].smjena;
            broj_tablica++;
        }
    }
    //Čitanje izmjena
    let l=0;
    for(index in svi_spanovi){
        if(svi_spanovi[index].startsWith('9')){
            
            result[k].izmjene_tablica.prijepode=1;
        }
        if(svi_spanovi[index].startsWith('-1')){
            
            result[k].izmjene_tablica.prijepode=0;
        }
        else if(svi_spanovi[index]==raz[l].ime){
            
            result[k].izmjene_razred[l].razred=svi_spanovi[index];
            
            control=1;
        }
        else if(control < 10 && control > 0){
            for(j=0;j<col[index];j++){
                //izmjena[k][`sat${control}`]=svi_spanovi[index];
                result[k].izmjene_razred[l][`sat${control}`]=svi_spanovi[index];
                
                control++
            }
            if(control==10){
                l++
            }
            if(l==broj_razreda){
                l=0;
                k++
            }
        }
    }
  /*  for(i in result){
        console.log(result[i].izmjene_razred)
    }
    for(i in result){
    console.log(result[i].izmjene_tablica);
    }*/
    return result;
}
    
    
async function sql(){
    let razredi_A;
    let razredi_B;
    let izmjena;
    let upis=false
    razredi_A=await promiseQuery("SELECT * FROM general_razred WHERE smjena='A';");
    razredi_B=await promiseQuery("SELECT * FROM general_razred WHERE smjena='B';");
    console.log(razredi_A);
    izmjena=await scraper(razredi_B);
    for (index in izmjena){
        console.log(izmjena[index].izmjene_tablica.naslov);
        tablica=await promiseQuery(`SELECT * FROM izmjene_tablica WHERE 
        naslov='${izmjena[index].izmjene_tablica.naslov}' AND 
        smjena='${izmjena[index].izmjene_tablica.smjena}' AND 
        prijepodne=${izmjena[index].izmjene_tablica.prijepode}`);
        
            if(tablica==null){
                upis=true;
            }
            else if(tablica[0]==null || upis){
                upis=false;
                console.log('Upisujem: ',izmjena[index].izmjene_tablica.naslov);
                tablica_upis=await promiseQuery(`INSERT INTO izmjene_tablica (naslov,smjena,prijepodne) 
                VALUES('${izmjena[index].izmjene_tablica.naslov}','${izmjena[index].izmjene_tablica.smjena}',${izmjena[index].izmjene_tablica.prijepode})`); 
            }
            else {
                console.log('Tablica je u bazi')
        }
    }
}
sql();