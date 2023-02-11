const { promiseQuery } = require("../databaseConnect.js");
const { getOption } = require("./../databaseQueries.js");

exports.broj_izmjena = async () => {
    let query = `SELECT COUNT(id) AS broj from izmjene_razred;`;
    const result = await promiseQuery(query);
    return result[0].broj;
}

exports.razredi_iz_smjene = async (smjena) => {
    let query = `SELECT * FROM general_razred WHERE smjena = '${smjena}' AND aktivan = 1`;
    const result = await promiseQuery(query);
    return result;
}

exports.tablica_postoji = async (izmjena, index) => {
    let query = `SELECT * FROM izmjene_tablica WHERE 
    naslov = '${izmjena[index].izmjene_tablica.naslov}' AND 
    smjena = '${izmjena[index].izmjene_tablica.smjena}' AND 
    prijepodne = ${izmjena[index].izmjene_tablica.prijepode}`;
    const result = await promiseQuery(query);

    return result && result.length > 0;
}

// Pogledaj ovo jos malo
exports.upis_naslova_u_bazu = async (izmjena, index) => {
    let query = `INSERT INTO izmjene_tablica (naslov,smjena,prijepodne) 
    VALUES('${izmjena[index].izmjene_tablica.naslov}','${izmjena[index].izmjene_tablica.smjena}',${izmjena[index].izmjene_tablica.prijepode})`;
    const result = await promiseQuery(query);
}

exports.dobi_id_tablice = async (izmjena, index) => {
    let query = `SELECT id FROM izmjene_tablica WHERE 
    naslov = '${izmjena[index].izmjene_tablica.naslov}' AND 
    smjena = '${izmjena[index].izmjene_tablica.smjena}' AND 
    prijepodne = ${izmjena[index].izmjene_tablica.prijepode} GROUP BY id DESC LIMIT 1`
    const result = await promiseQuery(query);
    return result[0].id;
}

exports.select_baza_izmjene = async (izmjena, index, index2, tablica_id, razred_id) => {
    let query = `SELECT * FROM izmjene_razred WHERE razred_id = ${razred_id} AND tablica_id = ${tablica_id} ORDER BY id DESC LIMIT 1`;
    const result = await promiseQuery(query);
    let isti = true;
    let j, i;
    if(result == null){
        return false;
    }
    else if(result[0] == null){
        return false;
    }
    else {
        for (i = 1; i <= 9; i++) {
            j = izmjena[index].izmjene_razred[index2][`sat${i}`] === result[0][`sat${i}`];
            if(j == false) {
                isti = false;
                break;
            }
        }
        return isti;
    }
}

exports.upis_izmjena_u_bazu = async (izmjena, index, index2, datum, tablica_id, razred_id) => {
    let query = `INSERT INTO izmjene_razred (razred_id,tablica_id,sat1,sat2,sat3,sat4,sat5,sat6,sat7,sat8,sat9,datum)
    VALUES(${razred_id},${tablica_id},'${izmjena[index].izmjene_razred[index2].sat1}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat2}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat3}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat4}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat5}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat6}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat7}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat8}'
                                        ,'${izmjena[index].izmjene_razred[index2].sat9}','${datum}')`
    const result = await promiseQuery(query);
    return result;
}

// Vrati vrijednost optiona iz baze
exports.getOption = async (option) => {
    return await getOption('izmjene_settings', option);
}

// Postavi novu vrijednost na option i kreiraj ga ako ne postoji
exports.setOption = async (option, value) => {
    return await setOption('izmjene_settings', option, value);
}
