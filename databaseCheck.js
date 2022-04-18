// Funkcije za povlačenje izmjena iz baze podataka

const { query } = require('./databaseConnect.js');

// Kreiraj funkciju koja vraća listu izmjena koje su
// se dogodile od tražene izmjene za traženi razred
exports.dajIzmjene = (razred_id, zadnja_poslana) => {
    return new Promise((resolve, reject) => {
        // Povuci podatke iz tablice izmjene_razred
        query(`
            WITH
                izmjene_nove AS (
                    SELECT *
                    FROM izmjene_razred
                    WHERE razred_id = ${razred_id} AND id > ${zadnja_poslana}
                    ORDER BY id DESC
                ),
                izmjene_oznaci_zadnje AS (
                    SELECT *,
                    CASE
                        WHEN LEAD(tablica_id, 1) OVER(ORDER BY id) = tablica_id THEN 0
                        ELSE 1
                    END AS zadnja_iz_tablice
                    FROM izmjene_nove
                )
            SELECT id, razred_id, tablica_id, datum, sat1, sat2, sat3, sat4, sat5, sat6, sat7, sat8, sat9
            FROM izmjene_oznaci_zadnje
            WHERE zadnja_iz_tablice = 1
            ORDER BY id DESC
        `, (errp, razred) => {
            if (errp) throw errp;

            let izmjene = [];
            let i = 0;
            
            // Kreiraj rekurzivnu funkciju i povuci podatke iz tablice
            // izmjene_tablica za svaki podatak iz tablica izmjene_razred
            const mojeTablice = () => {
                // Ako je funkcija završila vrati listu
                if (i >= razred.length) {
                    resolve(izmjene);
                    return;
                }
                
                query(`
                    SELECT naslov, prijepodne
                    FROM izmjene_tablica
                    WHERE id = ${razred[i]["tablica_id"]}
                `, (err, tablica) => {
                    if (err) throw err;
                    
                    // Postavi vrijednosti u objekt
                    izmjene[i] = {
                        id: razred[i].id,
                        naslov: tablica[0].naslov,
                        ujutro: (tablica[0].prijepodne) ? true : false,
                        datum: razred[i].datum
                    }

                    // Dodaj polja za sate i provjeri jesu li svi sati null
                    sve_null = true
                    for(let j = 1; j < 10; j++) {
                        
                        izmjene[i][`sat${j}`] = razred[i][`sat${j}`];

                        if (sve_null && izmjene[i][`sat${j}`] != null)
                            sve_null = false;
                    }
                    izmjene[i].sve_null = sve_null;

                    // Prijeđi na sljedeći record i ponovo pokreni funkciju
                    i++;
                    mojeTablice();
                });
            }
            // Pokreni funkciju
            mojeTablice();
        });
    });
}

exports.dajZadnju = (razred_id) => {
    return new Promise((resolve, reject) => {
        query(`
            SELECT *
            FROM izmjene_razred
            WHERE razred_id = ${razred_id}
            ORDER BY id DESC
            LIMIT 1
        `, (err, razred) => {
            if (err) throw err;

            query(`
                SELECT naslov, prijepodne
                FROM izmjene_tablica
                WHERE id = ${razred[0].tablica_id}
            `, (err, tablica) => {
                if (err) throw err;

                let izmjena = {
                    id: razred[0].id,
                    naslov: tablica[0].naslov,
                    ujutro: tablica[0].prijepodne,
                    datum: razred[0].datum,
                };

                sve_null = true
                for(let i = 1; i < 10; i++) {
                    izmjena[`sat${i}`] = razred[0][`sat${i}`];

                    if(sve_null && izmjena[`sat${i}`] != null)
                        sve_null = false;
                }
                izmjena.sve_null = sve_null;
                resolve(izmjena);
            });
        });
    });
}

exports.dajRazred = (razred_id) => {
    return new Promise((resolve, reject) => {
        query(`
            SELECT *
            FROM general_razred
            WHERE id = ${razred_id}
        `, (err, result) => {
            if (err) throw err;

            razred = {
                id: result[0].id,
                ime: result[0].ime,
                smjena: result[0].smjena
            };

            resolve(razred);
        });
    });
}