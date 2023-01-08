const puppeteer = require('puppeteer');
const {promiseQuery}=require('./../databaseConnect.js');
const baza =require('./funkcije_za_bazu');
const {uzbuna}=require('./../notifyPeople.js');
const prefix='[\u001b[31mSTRUGAC\033[00m] '
async function scraper(raz){
    //url
    let url='https://www.tsrb.hr/'+raz[0].smjena.toLowerCase()+'-smjena/';
    console.log(prefix+'Provjera:'+raz[0].smjena+' smjena');
    
    //Spajanje na stranicu
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();
    try {
        await page.goto(url, {
            waitUntil: 'networkidle2',
            timeout: 0,
         });
    } catch (error) {
        console.log(error);
        return 1;
    }
    

     //Dobivanje linka od iframea
    const [iframe]= await page.$x('//*[@id="dnevne-izmjene-u-rasporedu-sati-tab"]/iframe')
    const src=await iframe.getProperty('src');
    const iframeTXT=await src.jsonValue();
    

    //Odlazi na url od iframea
    try {
        await page.goto(iframeTXT);
    } catch (error) {
        console.log(error);
        return 1;
    }
    

    //Sprema sve spanove u jedno polje
    const svi_spanovi_scrape= await page.$x('//*/div/table/tbody/tr/td');
    const col_scrape = await page.$x("//*/div/table/tbody/tr/td/@colspan");
    const naslovi_scrape = await page.$x("/html/body/div/div/p");

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
    let ime=[];
    for(i in raz){
        ime[i]=raz[i].ime;    }
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
        else if(ime.includes(svi_spanovi[index])){
            
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
    console.log(result[i].izmjene_tablica);
    }*/
    browser.close();
    return result;
}
    
exports.sql=async() =>{

    let prije,poslje;
    let razredi_A;
    let razredi_B;
    let izmjena;
    prije=await baza.broj_izmjena();
    prije=prije[0].broj;
    razredi_A=await baza.razredi_iz_smjene('A');
    razredi_B=await baza.razredi_iz_smjene('B');
    
    izmjena=await scraper(razredi_A);
    if(izmjena===1){
        console.log("Doslo je do greske pri spajanju");
        return 1;
    }
    await sql_upis(izmjena,razredi_A);
    console.log(prefix+'Gotov (A)');
    izmjena=await scraper(razredi_B);
    if(izmjena===1){
        console.log("Doslo je do greske pri spajanju");
        return 1;
    }
    await sql_upis(izmjena,razredi_B);
    console.log(prefix+'Gotov (B)')
    poslje=await baza.broj_izmjena();
    poslje=poslje[0].broj;
    if (poslje!=prije){
        uzbuna();
    }
}
async function sql_upis(izmjena,razredi){
    let datum = "";
    const d = new Date();
    // Formiraj trenutno vrijeme/datum (mjeseci iz nekog razloga pocinju od 0)
    datum += d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    
    let upis=false;
    for (index=izmjena.length-1;index>=0;index--){
      
        tablica=await baza.tablica_postoji(izmjena,index);
        
            if(tablica==null){
                upis=true;
            }
            else if(tablica[0]==null || upis){
                upis=false;
                
                tablica_upis=await baza.upis_naslova_u_bazu(izmjena,index);
                if(tablica_upis===1){
                    console.log(prefix+"Problem sa upisom naslova u tablicu");
                    return ;
                }
            }

            tablica_id=await baza.dobi_id_tablice(izmjena,index);
            tablica_id=tablica_id[0].id;
            
            
            for(index2 in izmjena[index].izmjene_razred){
                for(i in razredi){
                    if(razredi[i].ime==izmjena[index].izmjene_razred[index2].razred){
                        razred_id=razredi[i].id;
                        
                    }
                }

               
                razred_upis=await baza.select_baza_izmjene(izmjena,index,index2);
               //console.log(razred_upis);
                
             
                
                if(razred_upis==false){
                    razred_upis_sad=await baza.upis_izmjena_u_bazu(izmjena,index,index2,datum);
                }

            else{
               
            }
            
        }
    }
    
}
//sql();