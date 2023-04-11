// Dobavi vezu prema bazi
const db = require('./../connect.js');
// Dobavi klase grešaka
const errors = require('./../../errors.js');
// Helper funkcije za master tablice
const master = require('./../helpers/master.js');
// Helper funkcije za class setove
const classHelper = require('./../helpers/classSet.js');


// Kreiraj novi set razreda
exports.create = async (properties, masterId) => {
    // Ako funkcija nema potrebne argumente
    if (!properties || !properties.name || !properties.uniqueName)
        throw new errors.ValidationError('Failed to create class set, insufficient properties');
    
    // Ako su razredi definirani koristi ih
    let classes = [];
    if (Array.isArray(properties.classes))
        classes = properties.classes

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();
        // Dobavi i provjeri masterId
        masterId = await master.getId(con, masterId);
        // Provjeri postoji li već class set koji ima isto unique ime
        const uniqueNameCheck = await con.query(`
            SELECT COUNT(*) AS name_exists FROM ras_class_set_version rcsv
            INNER JOIN (
                SELECT rcs.master_id, rcs.id, MAX(rcsv.version) AS version, rcs.delete_version FROM ras_class_set rcs
                INNER JOIN ras_class_set_version rcsv
                ON rcs.master_id = rcsv.master_id AND rcs.id = rcsv.class_set_id
                GROUP BY rcs.master_id, rcs.id
            ) grp
                ON grp.master_id = rcsv.master_id AND grp.id = rcsv.class_set_id AND grp.version = rcsv.version
            WHERE grp.master_id = ? AND rcsv.unique_name = ? AND delete_version IS NULL
        `, [ masterId, properties.uniqueName ]);
        // Baci grešku ako unique ime već postoji
        if (uniqueNameCheck[0].name_exists)
            throw new errors.ValidationError('Class set with same unique name already exists');

        // Pronađi koji mora biti ID novog seta
        await con.query('SELECT MAX(id) AS maxId FROM ras_class_set WHERE master_id = ?', [ masterId ]);
        const classSetId = (con.results[0].maxId) ? con.results[0].maxId + 1 : 1;
        // Upiši novi class set
        await con.query('INSERT INTO ras_class_set (master_id, id) VALUES ?', [[[ masterId, classSetId ]]]);
        // Kreiraj novu verziju ove master tablice
        const masterVersion = await master.getVersion(con, masterId);
        // Ubaci prvu verziju novog seta
        await con.query('INSERT INTO ras_class_set_version (master_id, class_set_id, version, name, unique_name) VALUES ?',
            [[[ masterId, classSetId, masterVersion, properties.name, properties.uniqueName ]]]
        );

        // Ubaci prvu verziju liste razreda
        await con.query('INSERT INTO ras_class_set_item_list_version (master_id, class_set_id, version) VALUES ?',
            [[[ masterId, classSetId, masterVersion ]]]
        );
        // Pripremi razrede za upis
        const insertClasses = [];
        for (const cls of classes) {
            await con.query('SELECT COUNT(*) AS classExists FROM ras_class WHERE delete_version IS NULL AND master_id = ? AND id = ?', [ masterId, cls ]);

            if (!con.results[0].classExists)
                throw new errors.ValidationError('One of given classes does not exist');

            insertClasses.push([ masterId, classSetId, masterVersion, cls ]);
        }
        // Upiši razrede
        if (insertClasses.length > 0)
            await con.query('INSERT INTO ras_class_set_item (master_id, class_set_id, version, class_id) VALUES ?', [ insertClasses ]);
        
        // Spremi promjene
        await con.commit();
        con.release();

        return classSetId;

    } catch (err) {
        // Ako je došlo do greške napravi rollback
        con.rollback();
        con.release();
        throw err;
    }
}


// Postavi koji razredi se nalaze unutar određenog seta razreda
exports.setClasses = async (classSetId, classes, masterId) => {
    // Ako funkcija nema potrebne argumente
    if (typeof(classSetId) !== 'number' || !Array.isArray(classes))
        throw new errors.ValidationError('Failed to create class set, insufficient properties');

    const con = new db.Connection();
    
    try {
        await con.connect();
        await con.transaction();
        // Provjeri master ID
        masterId = await master.getId(con, masterId);
        
        // Provjeri postoji li dani class set
        classHelper.classSetExists(con, masterId, classSetId);

        // Dobavi novi master version
        const masterVersion = await master.getVersion(con, masterId);
        // Pripremi razrede za upis
        const insertClasses = [];
        for (const cls of classes) {
            await con.query('SELECT COUNT(*) AS classExists FROM ras_class WHERE delete_version IS NULL AND master_id = ? AND id = ?', [ masterId, cls ]);

            if (!con.results[0].classExists)
                throw new errors.ValidationError('One of given classes does not exist');

            insertClasses.push([ masterId, classSetId, masterVersion, cls ]);
        }
        // Upiši novu verziju liste razreda za ovaj class set
        await con.query('INSERT INTO ras_class_set_item_list_version SET ?', {
            master_id: masterId, class_set_id: classSetId, version: masterVersion
        });
        // Upiši razrede u listu
        if (insertClasses.length > 0)
            await con.query('INSERT INTO ras_class_set_item (master_id, class_set_id, version, class_id) VALUES ?', [ insertClasses ]);
        
        // Spremi promjene
        await con.commit();
        con.release();

    } catch (err) {
        // Ako je došlo do greške napravi rollback
        con.rollback();
        con.release();
        throw err;
    }
}


// Dobavi sve setove razreda i razrede unutar njih
exports.get = async (classSetId, masterId) => {

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();
        // Lista svih class setova (rezultat)
        let classSets = [];

        masterId = await master.getId(con, masterId);

        // Ako se traži točno određeni class set pogledaj jel ID valja
        if (classSetId)
            classHelper.classSetExists(con, masterId, classSetId);

        // Dobavi sve class setove
        const classSetList = await con.query(`
            SELECT rcsv.class_set_id AS id, rcsv.name, rcsv.unique_name AS uniqueName
            FROM ras_class_set_version rcsv
            INNER JOIN (
                SELECT rcs.master_id AS master_id, rcs.id AS id, rcs.delete_version, MAX(rcsv.version) AS version FROM ras_class_set rcs
                INNER JOIN ras_class_set_version rcsv
                    ON rcs.master_id = rcsv.master_id AND rcs.id = rcsv.class_set_id
                GROUP BY rcs.master_id, rcs.id
            ) grp
                ON grp.master_id = rcsv.master_id AND grp.id = rcsv.class_set_id AND grp.version = rcsv.version
            WHERE grp.master_id = ? AND grp.delete_version IS NULL AND ?
        `, [ masterId, (classSetId) ? { 'grp.id': classSetId } : { toSqlString: () => { return '1 = 1'; } } ]);
        // Za svaki class set
        for (const classSet of classSetList) {
            // Dobavi listu razreda koji se u njemu nalaze
            const classes = await con.query(`
                SELECT clsv.id, rcv.name, rcv.short
                FROM ras_class_set_item rcsi
                INNER JOIN (
                    SELECT rcs.master_id, rcs.id, MAX(rcsilv.version) AS version FROM ras_class_set rcs
                    INNER JOIN ras_class_set_item_list_version rcsilv
                        ON rcs.master_id = rcsilv.master_id AND rcs.id = rcsilv.class_set_id
                    GROUP BY rcs.master_id, rcs.id
                ) setv
                    ON setv.master_id = rcsi.master_id AND setv.id = rcsi.class_set_id AND setv.version = rcsi.version
                INNER JOIN (
                    SELECT rc.master_id, rc.id, rc.delete_version, MAX(rcv.version) AS version FROM ras_class rc
                    INNER JOIN ras_class_version rcv
                        ON rc.master_id = rcv.master_id AND rc.id = rcv.class_id
                    GROUP BY rc.master_id, rc.id
                ) clsv
                    ON rcsi.master_id = clsv.master_id AND rcsi.class_id = clsv.id
                INNER JOIN ras_class_version rcv
                    ON rcv.master_id = clsv.master_id AND rcv.class_id = clsv.id AND rcv.version = clsv.version
                WHERE setv.master_id = ? AND rcsi.class_set_id = ? AND clsv.delete_version IS NULL
            `, [ masterId, classSet.id ]);
            // Dodaj class set u array
            classSets.push({
                ...classSet,
                classes: classes
            });
        }

        // Ako se traži samo jedan set izmjeni rezultat
        if (classSetId)
            classSets = classSets[0];

        // Spremi promjene (nema ih)
        await con.commit();
        con.release();
        // Vrati rezultat
        return classSets;

    } catch (err) {
        // Ako je bilo problema vrati grešku
        await con.rollback();
        con.release();
        throw err;
    }
}


// Obriši dani class set
exports.delete = async (classSetId, masterId) => {

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();
        
        masterId = await master.getId(con, masterId);

        // Provjeri postoji li dani class set
        classHelper.classSetExists(con, masterId, classSetId);

        // Ako postoji kreiraj novi master version i obriši ga
        const masterVersion = await master.getVersion(con, masterId);
        await con.query('UPDATE ras_class_set SET delete_version = ? WHERE master_id = ? AND id = ?', [ masterVersion, masterId, classSetId ]);

        // Spremi promjene
        await con.commit();
        con.release;
    
    // Ako je došlo do greške napravi rollback i vrati grešku
    } catch (err) {
        await con.rollback();
        con.release();
        throw err;
    }
}


// Izmjeni ime ili unique ime za dani set
exports.edit = async (properties, classSetId, masterId) => {

    // Ako funkcija nema potrebne argumente
    if (!properties || !properties.name || !properties.uniqueName)
        throw new errors.ValidationError('Failed to edit class set, insufficient properties');

    const con = new db.Connection();

    try {

        await con.connect();
        await con.transaction();

        masterId = await master.getId(con, masterId);

        // Provjeri postoji li dani class set
        await classHelper.classSetExists(con, masterId, classSetId);
        // Dobavi novu master verziju
        const masterVersion = await master.getVersion(con, masterId);
        // Provjeri postoji li class set koji ima unique ime jednak novim unique imenu
        const uniqueNameCheck = await con.query(`
            SELECT COUNT(*) AS nameExists FROM ras_class_set_version rcsv
            INNER JOIN (
                SELECT rcs.master_id, rcs.id, MAX(rcsv.version) AS version, rcs.delete_version FROM ras_class_set rcs
                INNER JOIN ras_class_set_version rcsv
                ON rcs.master_id = rcsv.master_id AND rcs.id = rcsv.class_set_id
                GROUP BY rcs.master_id, rcs.id
            ) grp
                ON grp.master_id = rcsv.master_id AND grp.id = rcsv.class_set_id AND grp.version = rcsv.version
            WHERE grp.master_id = ? AND rcsv.unique_name = ? AND grp.id != ? AND grp.delete_version IS NULL
        `, [ masterId, properties.uniqueName, classSetId ]);
        // Ako postoji baci grešku
        if (uniqueNameCheck[0].nameExists)
            throw new errors.ValidationError('Class set with same unique name already exists');

        // Upiši nove postavke seta
        await con.query('INSERT INTO ras_class_set_version (master_id, class_set_id, version, name, unique_name) VALUES ?', 
            [[[ masterId, classSetId, masterVersion, properties.name, properties.uniqueName ]]]
        );

        // Spremi promjene
        con.commit();
        con.release();
    
    // Ako je došlo do greške napravi rollback
    } catch (err) {
        await con.rollback();
        con.release();
        throw err;
    }
}