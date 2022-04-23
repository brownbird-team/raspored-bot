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

                        if (sve_null && izmjene[i][`sat${j}`] != "")
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

// Kreiraj funkciju koja omogućuje pregled povijesti izmjena
// za određeni razred, kao drugi argument funkciji dajemo broj tablica
// koliko želimo ići u prošlost
exports.dajPovijest = (razred_id, kolikoURikverc) => {
    return new Promise((resolve, reject) => {
        // Provjeri je li kolikoURikverc 0
        if (kolikoURikverc < 1) throw new Error("Argument kolikoURikverc ne može biti manji od 1");
        // Povuci podatke iz tablice izmjene_razred
        query(`
            SELECT COUNT(id) AS ukupan_broj
            FROM izmjene_razred
            WHERE razred_id = ${razred_id}
            ORDER BY id DESC;

            SELECT id, razred_id, tablica_id, datum, sat1, sat2, sat3, sat4, sat5, sat6, sat7, sat8, sat9
            FROM izmjene_razred
            WHERE razred_id = ${razred_id}
            ORDER BY id DESC
            LIMIT ${kolikoURikverc} OFFSET ${kolikoURikverc - 1};
        `, (errp, result) => {
            if (errp) throw errp;

            // Izvuci tražene podatke iz rezultata Queryja
            ukupanBroj = result[0][0];
            trazenaIzmjena = result[1][0];
            
            // Kreiraj objekt koji je krajnji rezultat
            objekt = {
                broj: ukupanBroj.ukupan_broj,
                izmjena: {
                    id: trazenaIzmjena.id,
                    datum: trazenaIzmjena.datum
                }
            }

            // Dodaj svojstva za sate u objekt i provjeri jesu li svi null
            sve_null = true
            for(let j = 1; j < 10; j++) {
                
                objekt.izmjena[`sat${j}`] = trazenaIzmjena[`sat${j}`];

                if (sve_null && objekt.izmjena[`sat${j}`] != "")
                    sve_null = false;
            }
            objekt.izmjena.sve_null = sve_null;

            // Povuci naslov i smjenu tablice
            query(`
                SELECT naslov, prijepodne
                FROM izmjene_tablica
                WHERE id = ${trazenaIzmjena.tablica_id}
            `, (err, result) => {
                if (err) throw err;
                objekt.izmjena.naslov = result[0].naslov;
                objekt.izmjena.ujutro = (result[0].prijepodne) ? true : false;
                resolve(objekt);
            });
        });
    });
}

// Kreiraj funkciju koja vraća zadnju izmjenu za traženi razred
exports.dajZadnju = (razred_id) => {
    return new Promise((resolve, reject) => {
        // Povuci zadnju izmjenu za razred
        query(`
            SELECT *
            FROM izmjene_razred
            WHERE razred_id = ${razred_id}
            ORDER BY id DESC
            LIMIT 1
        `, (err, razred) => {
            if (err) throw err;

            // Povuci podatke o tablici te izmjene
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
                
                // Dodaj polja za sate i provjeri jesu li svi sati null
                sve_null = true
                for(let i = 1; i < 10; i++) {
                    izmjena[`sat${i}`] = razred[0][`sat${i}`];

                    if(sve_null && izmjena[`sat${i}`] != "")
                        sve_null = false;
                }
                izmjena.sve_null = sve_null;
                resolve(izmjena);
            });
        });
    });
}

// Kreiraj funkciju koja vraća podatke za traženi razred po ID-u
exports.dajRazredById = (razred_id) => {
    return new Promise((resolve, reject) => {
        query(`
            SELECT *
            FROM general_razred
            WHERE id = ${razred_id}
        `, (err, result) => {
            if (err) throw err;

            let razred
            if (result.length === 0) {
                razred = null; 
            } else {
                razred = {
                    id: result[0].id,
                    ime: result[0].ime,
                    smjena: result[0].smjena,
                    aktivan: result[0].aktivan
                };
            }
            resolve(razred);
        });
    });
}

// Kreiraj funkciju koja vraća podatke za traženi razred po imenu
exports.dajRazredByName = (razred_ime) => {
    return new Promise((resolve, reject) => {
        query(`
            SELECT *
            FROM general_razred
            WHERE ime = '${razred_ime.toUpperCase()}'
        `, (err, result) => {
            if (err) throw err;

            let razred
            if (result.length === 0) {
                razred = null;
            } else {
                razred = {
                    id: result[0].id,
                    ime: result[0].ime,
                    smjena: result[0].smjena,
                    aktivan: result[0].aktivan
                };
            }
            resolve(razred);
        });
    });
}

exports.dajRazred = this.dajRazredById;