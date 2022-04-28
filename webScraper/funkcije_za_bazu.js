const { promiseQuery } = require("./../databaseConnect.js");

exports.razredi_iz_smjene=(smjena) =>{
    return new Promise(async (resolve) =>{
        let query=`SELECT * FROM general_razred WHERE smjena='${smjena}' AND aktivan=1`;
        result=await promiseQuery(query);
        resolve(result);
    });
}
exports.tablica_postoji=(izmjena,index) =>{
    return new Promise(async (resolve) =>{
        let query=`SELECT * FROM izmjene_tablica WHERE 
        naslov='${izmjena[index].izmjene_tablica.naslov}' AND 
        smjena='${izmjena[index].izmjene_tablica.smjena}' AND 
        prijepodne=${izmjena[index].izmjene_tablica.prijepode}`;
        result=await promiseQuery(query);
        resolve(result);
    });
}
exports.upis_naslova_u_bazu=(izmjena,index) =>{
    return new Promise(async (resolve) =>{
        let query=`INSERT INTO izmjene_tablica (naslov,smjena,prijepodne) 
        VALUES('${izmjena[index].izmjene_tablica.naslov}','${izmjena[index].izmjene_tablica.smjena}',${izmjena[index].izmjene_tablica.prijepode})`;
        result=await promiseQuery(query);
        resolve("Upis gotov");
    });
}
exports.dobi_id_tablice=(izmjena,index) =>{
    return new Promise(async (resolve) =>{
        let query=`SELECT id FROM izmjene_tablica WHERE 
        naslov='${izmjena[index].izmjene_tablica.naslov}' AND 
        smjena='${izmjena[index].izmjene_tablica.smjena}' AND 
        prijepodne=${izmjena[index].izmjene_tablica.prijepode} GROUP BY id DESC LIMIT 1`
        result=await promiseQuery(query);
        resolve(result);
    });
}
exports.select_baza_izmjene=(izmjena,index,index2) =>{
    return new Promise(async (resolve) =>{
        let query=`SELECT * FROM izmjene_razred WHERE razred_id=${razred_id} AND tablica_id=${tablica_id} 
        AND sat1='${izmjena[index].izmjene_razred[index2].sat1}' AND sat2='${izmjena[index].izmjene_razred[index2].sat2}' AND 
        sat3='${izmjena[index].izmjene_razred[index2].sat3}' AND sat4='${izmjena[index].izmjene_razred[index2].sat4}' AND 
        sat5='${izmjena[index].izmjene_razred[index2].sat5}' AND sat6='${izmjena[index].izmjene_razred[index2].sat6}' AND 
        sat7='${izmjena[index].izmjene_razred[index2].sat7}' AND sat8='${izmjena[index].izmjene_razred[index2].sat8}' AND 
        sat9='${izmjena[index].izmjene_razred[index2].sat9}' GROUP BY id DESC LIMIT 1`;
        result=await promiseQuery(query);
        resolve(result);
    });
}
exports.upis_izmjena_u_bazu=(izmjena,index,index2,datum) =>{
    return new Promise(async (resolve) =>{
        let query=`INSERT INTO izmjene_razred (razred_id,tablica_id,sat1,sat2,sat3,sat4,sat5,sat6,sat7,sat8,sat9,datum)
        VALUES(${razred_id},${tablica_id},'${izmjena[index].izmjene_razred[index2].sat1}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat2}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat3}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat4}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat5}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat6}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat7}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat8}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat9}','${datum}')`
        result=await promiseQuery(query);
        resolve(result);
    });
}