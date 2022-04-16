const puppeteer = require('puppeteer');
const {query}=require('./../databaseConnect.js')
async function scraper(raz){
    
    let izmjena=[];
    for(i=0;i<60;i++){
        izmjena[i]={
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
    console.log(iframeTXT);
    const svi_spanovi= await page.$x('//*/div/table/tbody/tr/td');
    const col = await page.$x("//*/div/table/tbody/tr/td/@colspan");
    
    
    let j=0;
        for(k=0;k<60;k=k){
            
            for(i=0;i<svi_spanovi.length;i++){
                
                const str_txt=await svi_spanovi[i].getProperty('textContent');
                let str_rawTxt=await str_txt.jsonValue();
                const col_txt=await col[i].getProperty('textContent');
                let col_rawTxt=await col_txt.jsonValue();
                
        
        
                if(str_rawTxt.startsWith('IZMJENE U RASPOREDU')){
                    
                    izmjena[k].naslov=str_rawTxt;
                    
                }
                if(str_rawTxt==raz[j].ime){
                    
                    console.log(str_rawTxt,k);
                    izmjena[k].razred=str_rawTxt;
                    
                    var control=1;
                }
                else if(control < 10 && control > 0){
                    for(l=0;l<col_rawTxt;l++){
                        
                        izmjena[k][`sat${l+1}`] = str_rawTxt;
                        
                    control++;
                    if(control==10){
                        
                        k++;
                        control=0;
                       
                    }
                    }
                }
                
            }
            console.log(izmjena[0]);
            j++;
            
        }
        
       
    console.log(izmjena[0])
        
    return izmjena;
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
            console.log(izmjena);
        });
      });   
      
}
sql();
