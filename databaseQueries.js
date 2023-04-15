// Funkcije za povlačenje izmjena iz baze podataka
const { query, promiseQuery } = require('./databaseConnect.js');
// Error klase
const errors = require('./errors.js');

// Stavi backslash ispred svih znakova koji bi mogli poremetiti
// SQL upit
exports.prepareForSQL = (input) => {
    let output = '';
    for (character of input) {
        if (character === "'" || character === "\\") {
            output += "\\" + character;
        } else {
            output += character;
        }
    }
    return output;
}

// Provjerava sastoji li se string dan funkciji od isključivo
// ASCII znakova
exports.onlyASCII = str => /^[\x00-\x7F]+$/.test(str);



// -------------------------------------------------------------------------- //
//                            Funkcije za izmjene                             //
// -------------------------------------------------------------------------- //

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
            if (errp) { reject(errp); return; }

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
                    if (err) { reject(err); return; }
                    
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
// Također možemo odabrati od koje izmjene želimo ići u rikverc
exports.dajPovijest = (razred_id, kolikoURikverc, idIzmjene) => {
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
            WHERE razred_id = ${razred_id}${(idIzmjene === undefined) ? '' : ` AND id <= ${idIzmjene}`}
            ORDER BY id DESC
            LIMIT ${kolikoURikverc} OFFSET ${kolikoURikverc - 1};
        `, (errp, result) => {
            if (errp) { reject(errp); return; }

            // Izvuci tražene podatke iz rezultata Queryja
            let ukupanBroj = result[0][0];
            let trazenaIzmjena = result[1][0];

            // Ako za dani razred ne postoji ni jedna izmjena
            // vrati broj 0 i izmjena null
            if (ukupanBroj.ukupan_broj === 0) {
                resolve({
                    broj: 0, izmjena: null
                });
                return;
            }

            // Kreiraj objekt koji je krajnji rezultat
            let objekt = {
                broj: ukupanBroj.ukupan_broj,
                izmjena: {
                    id: trazenaIzmjena.id,
                    datum: trazenaIzmjena.datum
                }
            }

            // Dodaj svojstva za sate u objekt i provjeri jesu li svi null
            let sve_null = true
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
                if (err) { reject(err); return; }
                objekt.izmjena.naslov = result[0].naslov;
                objekt.izmjena.ujutro = (result[0].prijepodne) ? true : false;
                resolve(objekt);
            });
        });
    });
}

// Kreiraj funkciju koja vraća zadnju izmjenu za traženi razred
exports.dajZadnju = async (razredId) => {
    // Povuci zadnju izmjenu za razred
    const result = await promiseQuery(`
        SELECT
            ir.razred_id,
            ir.tablica_id,
            ir.datum,
            ir.sat1, ir.sat2, ir.sat3, ir.sat4, ir.sat5, ir.sat6, ir.sat7, ir.sat8, ir.sat9,
            ir.id, it.naslov, it.prijepodne
        FROM izmjene_razred ir
        INNER JOIN izmjene_tablica it
            ON ir.tablica_id = it.id
        WHERE ir.razred_id = ?
        ORDER BY ir.id DESC
        LIMIT 1
    `, [ razredId ]);
    // Ako za razred nema izmjena vrati null
    if (result.length === 0)
        return null;
    // Napravi objekt izmjene
    const izmjena = {
        id: result[0].id,
        naslov: result[0].naslov,
        ujutro: result[0].prijepodne,
        datum: result[0].datum,
    }
    // Dodaj polja za sate i provjeri jesu li svi sati prazni
    sve_null = true
    for(let i = 1; i < 10; i++) {
        izmjena[`sat${i}`] = result[0][`sat${i}`];

        if(sve_null && izmjena[`sat${i}`] != "")
            sve_null = false;
    }   
    // Vrati podatke
    return izmjena;
}

// Kreiraj funkciju koja vraća zadnju izmjenu za traženi razred
exports.dajZadnju_old = (razred_id) => {
    return new Promise((resolve, reject) => {
        // Povuci zadnju izmjenu za razred
        query(`
            SELECT *
            FROM izmjene_razred
            WHERE razred_id = ${razred_id}
            ORDER BY id DESC
            LIMIT 1
        `, (err, razred) => {
            if (err) { reject(err); return; }

            // Povuci podatke o tablici te izmjene
            query(`
                SELECT naslov, prijepodne
                FROM izmjene_tablica
                WHERE id = ${razred[0].tablica_id}
            `, (err, tablica) => {
                if (err) { reject(err); return; }

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

// Upiši novu tablicu izmjene
exports.insertChangeTable = async (data) => {
    const result = await promiseQuery(`
        SELECT COUNT(DISTINCT(smjena)) AS shiftExists
        FROM general_razred
        WHERE aktivan = TRUE AND smjena = ?
    `, [ data.shift ]);

    if (!result[0].shiftExists)
        throw new errors.ValidationError('Given shift does not exist');
    
    const res = await promiseQuery(
        'INSERT INTO izmjene_tablica (naslov, smjena, prijepodne) VALUES ?',
        [[[ data.heading, data.shift, !!data.morning ]]]
    );

    return res.insertId;
}

// Izmjeni već postojeću tablicu izmjena
exports.updateChangeTable = async (data) => {
    const updateObject = {};

    if (typeof(data.heading) === 'string')
        updateObject.naslov = data.heading;
    if (typeof(data.shift) === 'string')
        updateObject.smjena = data.shift;
    if (typeof(data.morning) === 'boolean')
        updateObject.prijepodne = data.morning;
    
    if (Object.keys(updateObject).length === 0)
        return;

    await promiseQuery(
        'UPDATE izmjene_tablica SET ? WHERE id = ?',
        [ updateObject, data.id ]
    );
}

// Dobavi sve tablice izmjena
exports.getChangeTables = async () => {
    const result = await promiseQuery(`
        SELECT id, naslov AS heading, smjena AS shift, prijepodne AS morning
        FROM izmjene_tablica
        ORDER BY id DESC
    `);

    return result.map((tab) => {
        tab.morning = !!tab.morning;
        return tab;
    });
}

// Dohvati trenutnu izmjenu tablice izmjene
exports.getChange = async (tableId) => {
    // Dobavi tablicu
    const info = await promiseQuery(`
        SELECT id, naslov AS header, smjena AS shift, prijepodne AS morning
        FROM izmjene_tablica
        WHERE id = ?
    `, [ tableId ]);
    // Dobavi zadnju verziju sadržaja tablice
    const changes = await promiseQuery(`
        SELECT ir.id, ir.datum AS changeDate, ir.razred_id AS classId,
            gr.ime AS className, gr.smjena AS classShift, ir.sat1, ir.sat2, 
            ir.sat3, ir.sat4, ir.sat5, ir.sat6, ir.sat7, ir.sat8, ir.sat9
        FROM izmjene_razred ir
        INNER JOIN (
            SELECT tablica_id, razred_id, MAX(id) AS id
            FROM izmjene_razred
            GROUP BY tablica_id, razred_id
        ) irv
            ON ir.tablica_id = irv.tablica_id AND ir.razred_id = irv.razred_id AND ir.id = irv.id
        INNER JOIN general_razred gr
            ON gr.id = ir.razred_id	
        WHERE ir.tablica_id = ?
        ORDER BY gr.ime ASC
    `, [ tableId ]);
    
    if (info.length === 0)
        throw new errors.NotFoundError('Given table does not exist');
    
    return {
        ...(info[0]),
        classes: changes,
    };
}

exports.setChange = async (data) => {

    const result = await promiseQuery(`
        SELECT COUNT(*) AS changeExists
        FROM izmjene_tablica
        WHERE id = ?
    `, [ data.id ]);

    if (!result[0].changeExists)
        throw new errors.NotFoundError('Failed to save changes, given change table does not exist');

    // Dobavi zadnju verziju sadržaja tablice
    const changes = await promiseQuery(`
        SELECT ir.id, ir.datum AS changeDate, ir.razred_id AS classId,
            gr.ime AS className, gr.smjena AS classShift, ir.sat1, ir.sat2, 
            ir.sat3, ir.sat4, ir.sat5, ir.sat6, ir.sat7, ir.sat8, ir.sat9
        FROM izmjene_razred ir
        INNER JOIN (
            SELECT tablica_id, razred_id, MAX(id) AS id
            FROM izmjene_razred
            GROUP BY tablica_id, razred_id
        ) irv
            ON ir.tablica_id = irv.tablica_id AND ir.razred_id = irv.razred_id AND ir.id = irv.id
        INNER JOIN general_razred gr
            ON gr.id = ir.razred_id	
            
        WHERE ir.tablica_id = ?
    `, [ data.id ]);
    
    const newChange = new Map();
    for (const cls of data.classes)
        newChange.set(cls.classId, cls);

    const insertChanges = [];

    for (const cls of changes) {
        
        const newCls = newChange.get(cls.classId);

        if (!newCls)
            continue;

        for (let i = 1; i <= 9; i++)
            if (newCls[`sat${i}`] !== cls[`sat${i}`]) {
                insertChanges.push(
                    [ cls.classId, data.id, (new Date()), newCls.sat1, newCls.sat2, newCls.sat3, newCls.sat4, newCls.sat5, newCls.sat6, newCls.sat7, newCls.sat8, newCls.sat9 ]
                );
                break;
            }  

        newChange.delete(cls.classId);
    }

    for (const cls of newChange.values()) {
        insertChanges.push(
            [ cls.classId, data.id, (new Date()), cls.sat1, cls.sat2, cls.sat3, cls.sat4, cls.sat5, cls.sat6, cls.sat7, cls.sat8, cls.sat9 ]
        );
    }

    if (insertChanges.length > 0)
        await promiseQuery(
            'INSERT INTO izmjene_razred (razred_id, tablica_id, datum, sat1, sat2, sat3, sat4, sat5, sat6, sat7, sat8, sat9) VALUES ?',
            [ insertChanges ]
        );
}



// -------------------------------------------------------------------------- //
//                       Funkcije za sistemske postavke                       //
// -------------------------------------------------------------------------- //

// Vraća vrijednost optiona iz baze iz dane tablice ili null ako option
// nije definiran, tablica mora biti oblika settings tablica krairanih
// pri inicijalizaciji baze
exports.getOption = async (tableName, option) => {
    const query = `SELECT * FROM ${tableName} WHERE option = '${option}'`;
    let result = await promiseQuery(query);
    let value;
    if(result.length === 0) {
        value = null;
    } else {
        value = result[0].value;
    }
    return value;
}

// Postavlja vrijednost optiona u bazi ili ga kreira ako ne postoji u danoj tablici,
// tablica mora biti oblika settings tablica kreiranih pri inicijalizaciji baze
exports.setOption = async (tableName, option, value) => {
    const check = await exports.getOption(tableName, option);
    let query;
    if(check !== null) {
        query = `UPDATE ${tableName} SET value = '${value}' WHERE option = '${option}'`;
    } else {
        query = `INSERT INTO ${tableName} (option, value) VALUES ('${option}', '${value}')`;
    }
    await promiseQuery(query);
    return 'done';
}

// Briše danu postavku (option) is dane tablice sa postavkama
exports.deleteOption = async (tableName, option) => {
    const query = `DELETE FROM ${tableName} WHERE option = '${option}'`;
    await promiseQuery(query);
    return 'done';
}

// Provjerava jesu li svi potrebni optioni iz liste kreirani u danoj tablici,
// lista je lista objekata { name: 'ime', value: 'vrijednost', defaultOk: true }
// čija svojstva su ime optiona, vrijednost optiona, i je li u redu ako je vrijednost
// optiona jednaka zadanoj vrijednosti optiona
// Funkcija vraća true ako je sve u redu, a false ako neki optioni imaju zadanu vrijednost
// iako nebi smjeli
// logFunction je pozvana za ispis opisa trenutne operacije
exports.checkOptions = async (tableName, optionsList, logFunction) => {
    let allOk = true;

    for (let i in optionsList) {
        const value = await this.getOption(tableName, optionsList[i].name);

        if (value === null) {
            if (logFunction)
                logFunction(
                    `Record "${optionsList[i].name}" not found in table ` +
                    `"${tableName}" inserting record and setting it to "${optionsList[i].value}"`
                );
            await this.setOption(tableName, optionsList[i].name, optionsList[i].value);
            if (!optionsList[i].defaultOk)
                allOk = false;
        } else if (value === optionsList[i].value && !optionsList[i].defaultOk) {
            allOk = false;
        }
    }

    return allOk;
}



// -------------------------------------------------------------------------- //
//                       Funkcije za razrede i smjene                         //
// -------------------------------------------------------------------------- //

// Kreiraj funkciju koja vraća podatke za traženi razred po ID-u
exports.dajRazredById = (razred_id) => {
    return new Promise((resolve, reject) => {
        if (!razred_id) {
            resolve(null);
            return;
        }

        query(`
            SELECT *
            FROM general_razred
            WHERE id = ${razred_id}
        `, (err, result) => {
            if (err) { reject(err); return; }

            let razred
            if (result.length === 0) {
                razred = null; 
            } else {
                razred = {
                    id: result[0].id,
                    ime: result[0].ime,
                    smjena: result[0].smjena,
                    aktivan: (result[0].aktivan === 1)
                };
            }
            resolve(razred);
        });
    });
}

// Kreiraj funkciju koja vraća podatke za traženi razred po imenu
exports.dajRazredByName = (razred_ime) => {
    return new Promise((resolve, reject) => {
        if (razred_ime === undefined || razred_ime === null) {
            resolve(null);
            return;
        }
        if (!exports.onlyASCII(razred_ime)) {
            resolve(null);
            return;
        }
        query(`
            SELECT *
            FROM general_razred
            WHERE ime = '${exports.prepareForSQL(razred_ime.toUpperCase())}'
        `, (err, result) => {
            if (err) { reject(err); return; }

            let razred
            if (result.length === 0) {
                razred = null;
            } else {
                razred = {
                    id: result[0].id,
                    ime: result[0].ime,
                    smjena: result[0].smjena,
                    aktivan: (result[0].aktivan === 1)
                };
            }
            resolve(razred);
        });
    });
}

// Kreiraj funkciju koja vraća listu svih razreda iz baze
exports.dajRazrede = async () => {
    const result = await promiseQuery('SELECT * FROM general_razred ORDER BY ime ASC');
    const resultsFormated = [];

    if (!result)
        return [];

    result.forEach((razred) => {
        resultsFormated.push({
            id: razred.id,
            name: razred.ime,
            shift: razred.smjena,
            active: (razred.aktivan) ? true : false,
        });
    });

    return resultsFormated;
}

// Kreiraj funkciju koja vraća listu svih razreda iz baze
exports.dajAktivneRazrede = async () => {
    const result = await promiseQuery('SELECT * FROM general_razred WHERE aktivan = 1 ORDER BY ime ASC');
    const resultsFormated = [];

    if (!result)
        return [];

    result.forEach((razred) => {
        resultsFormated.push({
            id: razred.id,
            name: razred.ime,
            shift: razred.smjena,
        });
    });

    return resultsFormated;
}

exports.dajRazred = this.dajRazredById;

// Dohvati sve postojeće smjene iz baze
exports.dajShifts = async () => {
    // Dobavi sve smjene iz baze
    const result = await promiseQuery(`
        SELECT DISTINCT smjena FROM general_razred
        WHERE aktivan = 1
    `);
    // Posloži ih u array
    const smjene = result.map((s) => s.smjena);
    // Vrati smjene
    return smjene;
}

// Dohvati sve razrede u odabranoj smjeni
exports.dajRazredByShift = async (smjena) => {
    // Dobavi sve razrede koji su dio dane smjene
    const result = await promiseQuery(`
        SELECT id, ime AS name FROM general_razred
        WHERE aktivan = TRUE AND smjena = ?
        ORDER BY ime ASC
    `, [ smjena ]);

    return result
}

// Unesi dani razred
exports.insertRazred = async (data) => {
    // Provjeri postoji li već aktivan razred s danim imenom
    const results = await promiseQuery(`
        SELECT COUNT(*) AS razredExists
        FROM general_razred
        WHERE aktivan = TRUE AND ime = ?
    `, [ data.name ]);
    // AKo postoji javi grešku
    if (results[0].razredExists)
        throw new errors.ConflictError('Failed to create class, because class with the same name already exists');
    // U suprotnom ga upiši
    const result = await promiseQuery(
        'INSERT INTO general_razred (ime, smjena, aktivan) VALUES ?',
        [[[ data.name, data.shift, true ]]]
    );

    return result.insertId;
}

// Pobriši dani razred prema ID-u
exports.deleteRazred = async (id) => {
    await promiseQuery(
        'UPDATE general_razred SET aktivan = FALSE WHERE id = ?',
        [ id ]
    );
}