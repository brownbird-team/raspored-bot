const strugac=require('./webScraperMain');
const schedule=require('node-schedule');
const { ReactionUserManager } = require('discord.js');
const prefix='[\u001b[31mSTRUGAC\033[00m] ';
let provjera=0;
async function strugacRun(run){
    stat = await strugacStatus()
    console.log(stat);
    if(stat==1){
        console.log(prefix+'Job je vec pokrenut');
        return 0;
    }
    else if(run==true ){
        schedule.scheduleJob('strugac','*/1 * * * *', async ()=>{
            strugacRun(true);
           // await strugac.sql();
           console.log("radi");
            provjera++;
        });
        console.log(prefix+'Srugac je pokrenut');
    }
    else if(run==false){
        schedule.cancelJob('strugac');
        console.log(prefix+'Srugac je zaustavljen');
    }
    else{
        console.log(prefix+'ERROR Funkcija prima argumente true ili false');
    }
    
}
async function strugacStatus (){
    obj=schedule.scheduledJobs['strugac'];
    if(obj===undefined){
        return 0;
    }
    else{
        return 1;
    }
}
strugacRun(true);
