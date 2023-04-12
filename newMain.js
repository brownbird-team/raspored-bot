const db = require('./database/connect');
const discord = require("./discordBot/main.js");
const fn = require('./database/queries/classInfo.js')
const start = async () =>{

    await db.databaseInit();
    let a = await fn.getClassById({ master_id:3,class_id:66});
    let b = await fn.getClassByName({ name:'2.G'});
    let c = await fn.getAllClasses({});
     console.log(a);
     console.log(b);
     console.log(c);
    await discord.startDiscordBot();
}
start()
