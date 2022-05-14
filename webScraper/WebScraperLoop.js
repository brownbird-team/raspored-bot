const strugac=require('./webScraperMain');
const schedule=require('node-schedule');
const { ReactionUserManager } = require('discord.js');
const prefix='[\u001b[31mSTRUGAC\033[00m] ';


exports.strugacRun=async(run) =>{
    stat = await exports.strugacStatus()
    
    if(stat==1 && run==true){
        console.log(prefix+'Strugac je vec pokrenut');
        return 0;
    }
    else if(stat==null && run==false){
        console.log(prefix+'Strugac je vec zaustavljen ili nije ni pokrenut');
        return 0;
    }
    else if(run==true ){
        schedule.scheduleJob('strugac','*/1 * * * *', async ()=>{
            
            await strugac.sql();
           //console.log("radi");
            
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

exports.strugacStatus=async() =>{   
    obj=schedule.scheduledJobs['strugac'];
    if(obj===undefined){
        return 0;
    }
    else{
        return 1;
    }
}

