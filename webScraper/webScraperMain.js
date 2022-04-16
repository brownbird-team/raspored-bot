const puppeteer = require('puppeteer');
const {query}=require('./../databaseConnect.js')
async function scraper(raz){
    let izmjena={
        naslov:null,
        smjena:null,
        prijepode:null,
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
        iframe:null,
    };
    let izmjene_array=[];
    for(i=0;i<60;i++){
        izmjene_array.push(izmjena);
    }
    
    url='https://www.tsrb.hr/'+raz[0].smjena.toLowerCase()+'-smjena/';
    console.log(url);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'networkidle2',
        timeout: 0,
    });
    const [iframe]= await page.$x('//*[@id="dnevne-izmjene-u-rasporedu-sati-tab"]/iframe')
    const src=await iframe.getProperty('src');
    const iframeTXT=await src.jsonValue();
    await page.goto(iframeTXT);
    const svi_spanovi= await page.$x('//*/div/table/tbody/tr/td');
    const col = await page.$x("//*/div/table/tbody/tr/td/@colspan");
    for(j=0;j<raz.length;j){
        for(k=0;k<60;k++){
            for(i=0;i<svi_spanovi.length;i++){
                const str_txt=await svi_spanovi[i].getProperty('textContent');
                let str_rawTxt=await str_txt.jsonValue();
                const col_txt=await col[i].getProperty('textContent');
                let col_rawTxt=await col_txt.jsonValue();
                
        
        
                if(str_rawTxt.startsWith('IZMJENE U RASPOREDU')){
                    console.log(str_rawTxt);
                    izmjene_array[k].naslov=str_rawTxt;
                }
                if(str_rawTxt==raz[j]){
                    console.log(str_rawTxt);
                    var control=1;
                }
                else if(control < 10 && control > 0){
                    for(j=0;j<col_rawTxt;j++){
                    console.log(control,".sat =",str_rawTxt,"(",col_rawTxt,")");
                    control++;
                    }
                }
            }
        }
    }
        return izmjene_array;
    
}
async function sql(){
    let razredi_A;
    let razredi_B;
    let izmjena;
    query("SELECT * FROM general_razred WHERE smjena='A';", async function (err, razredi_A){
        if (err) throw err;
        
        query("SELECT * FROM general_razred WHERE smjena='B';",async function (err, razredi_B){
            console.log(razredi_A);
            izmjena=await scraper(razredi_A);
            console.log(izmjena[1]);
        });
      });   
      
}
sql();
