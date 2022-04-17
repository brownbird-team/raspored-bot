const puppeteer = require('puppeteer');
const {query}=require('./../databaseConnect.js')
async function scraper(raz){
    
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
