// Dobavi vezu prema bazi
const db = require('./../connect.js');
// Dobavi klase grešaka
const errors = require('./../../errors.js');
// Helper funkcije za master tablice
const master = require('./../helpers/master.js');
// Helper funkcije za period setove
const periodHelper = require('./../helpers/periodSet.js');


// Kreiraj novi set perioda
exports.create = async (properties, masterId) => {
    // Ako funkcija nema potrebne argumente
    if (!properties || !properties.name || !properties.uniqueName)
        throw new errors.ValidationError('Failed to create period set, insufficient properties');
    
    // Ako su periodi definirani koristi ih
    let periods = [];
    if (Array.isArray(properties.periods))
        periods = properties.periods

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();
        // Dobavi i provjeri masterId
        masterId = await master.getId(con, masterId);
        // Provjeri postoji li već period set koji ima isto unique ime
        const uniqueNameCheck = await con.query(`
            SELECT COUNT(*) AS name_exists FROM ras_period_set_version rpsv
            INNER JOIN (
                SELECT rps.master_id, rps.id, MAX(rpsv.version) AS version, rps.delete_version FROM ras_period_set rps
                INNER JOIN ras_period_set_version rpsv
                ON rps.master_id = rpsv.master_id AND rps.id = rpsv.period_set_id
                GROUP BY rps.master_id, rps.id
            ) grp
                ON grp.master_id = rpsv.master_id AND grp.id = rpsv.period_set_id AND grp.version = rpsv.version
            WHERE grp.master_id = ? AND rpsv.unique_name = ? AND delete_version IS NULL
        `, [ masterId, properties.uniqueName ]);
        // Baci grešku ako unique ime već postoji
        if (uniqueNameCheck[0].name_exists)
            throw new errors.ValidationError('Period set with same unique name already exists');

        // Pronađi koji mora biti ID novog seta
        await con.query('SELECT MAX(id) AS maxId FROM ras_period_set WHERE master_id = ?', [ masterId ]);
        const periodSetId = (con.results[0].maxId) ? con.results[0].maxId + 1 : 1;
        // Upiši novi period set
        await con.query('INSERT INTO ras_period_set (master_id, id) VALUES ?', [[[ masterId, periodSetId ]]]);
        // Kreiraj novu verziju ove master tablice
        const masterVersion = await master.getVersion(con, masterId);
        // Ubaci prvu verziju novog seta
        await con.query('INSERT INTO ras_period_set_version (master_id, period_set_id, version, name, unique_name) VALUES ?',
            [[[ masterId, periodSetId, masterVersion, properties.name, properties.uniqueName ]]]
        );

        // Ubaci prvu verziju liste perioda
        await con.query('INSERT INTO ras_period_set_item_list_version (master_id, period_set_id, version) VALUES ?',
            [[[ masterId, periodSetId, masterVersion ]]]
        );
        // Pripremi periode za upis
        const insertPeriods = [];
        for (const period of periods) {
            await con.query('SELECT COUNT(*) AS period_exists FROM ras_period WHERE delete_version IS NULL AND master_id = ? AND id = ?', [ masterId, period.id ]);

            if (!con.results[0].period_exists)
                throw new errors.ValidationError('One of given periods does not exist');

            insertPeriods.push([ masterId, periodSetId, masterVersion, period.id, period.name ]);
        }
        // Upiši periode
        if (insertPeriods.length > 0)
            await con.query('INSERT INTO ras_period_set_item (master_id, period_set_id, version, period_id, specific_name) VALUES ?', [ insertPeriods ]);
        
        // Spremi promjene
        await con.commit();
        con.release();

        return periodSetId;

    } catch (err) {
        // Ako je došlo do greške napravi rollback
        con.rollback();
        con.release();
        throw err;
    }
}


// Postavi koji periodi se nalaze unutar određenog seta perioda
exports.setPeriods = async (periodSetId, periods, masterId) => {
    // Ako funkcija nema potrebne argumente
    if (typeof(periodSetId) !== 'number' || !Array.isArray(periods))
        throw new errors.ValidationError('Failed to create period set, insufficient properties');

    const con = new db.Connection();
    
    try {
        await con.connect();
        await con.transaction();
        // Provjeri master ID
        masterId = await master.getId(con, masterId);
        
        // Provjeri postoji li dani period set
        periodHelper.periodSetExists(con, masterId, periodSetId);

        // Dobavi novi master version
        const masterVersion = await master.getVersion(con, masterId);
        // Pripremi periode za upis
        const insertPeriods = [];
        for (const period of periods) {
            await con.query('SELECT COUNT(*) AS period_exists FROM ras_period WHERE delete_version IS NULL AND master_id = ? AND id = ?', [ masterId, period.id ]);

            if (!con.results[0].period_exists)
                throw new errors.ValidationError('One of given periods does not exist');

            insertPeriods.push([ masterId, periodSetId, masterVersion, period.id, period.name ]);
        }
        // Upiši novu verziju liste perioda za ovaj period set
        await con.query('INSERT INTO ras_period_set_item_list_version SET ?', {
            master_id: masterId, period_set_id: periodSetId, version: masterVersion
        });
        // Upiši periode u listu
        if (insertPeriods.length > 0)
            await con.query('INSERT INTO ras_period_set_item (master_id, period_set_id, version, period_id, specific_name) VALUES ?', [ insertPeriods ]);
        
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


// Dobavi sve setove perioda i periode unutar njih
exports.get = async (periodSetId, masterId) => {

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();
        // Lista svih period setova (rezultat)
        let periodSets = [];

        masterId = await master.getId(con, masterId);

        // Ako se traži točno određeni period set pogledaj jel ID valja
        if (periodSetId)
            periodHelper.periodSetExists(con, masterId, periodSetId);

        // Dobavi sve period setove
        const periodSetList = await con.query(`
            SELECT rpsv.period_set_id AS id, rpsv.name, rpsv.unique_name AS uniqueName
            FROM ras_period_set_version rpsv
            INNER JOIN (
                SELECT rps.master_id AS master_id, rps.id AS id, rps.delete_version, MAX(rpsv.version) AS version FROM ras_period_set rps
                INNER JOIN ras_period_set_version rpsv
                    ON rps.master_id = rpsv.master_id AND rps.id = rpsv.period_set_id
                GROUP BY rps.master_id, rps.id
            ) grp
                ON grp.master_id = rpsv.master_id AND grp.id = rpsv.period_set_id AND grp.version = rpsv.version
            WHERE grp.master_id = ? AND grp.delete_version IS NULL AND ?
        `, [ masterId, (periodSetId) ? { 'grp.id': periodSetId } : { toSqlString: () => { return '1 = 1'; } } ]);
        // Za svaki period set
        for (const periodSet of periodSetList) {
            // Dobavi listu perioda koji se u njemu nalaze
            const periods = await con.query(`
                SELECT perv.id, rpv.name, rpv.short, rpv.start_time AS startTime, rpv.end_time AS endTime, rpsi.specific_name AS specificName
                FROM ras_period_set_item rpsi
                INNER JOIN (
                    SELECT rps.master_id, rps.id, MAX(rpsilv.version) AS version FROM ras_period_set rps
                    INNER JOIN ras_period_set_item_list_version rpsilv
                        ON rps.master_id = rpsilv.master_id AND rps.id = rpsilv.period_set_id
                    GROUP BY rps.master_id, rps.id
                ) setv
                    ON setv.master_id = rpsi.master_id AND setv.id = rpsi.period_set_id AND setv.version = rpsi.version
                INNER JOIN (
                    SELECT rp.master_id, rp.id, rp.delete_version, MAX(rpv.version) AS version FROM ras_period rp
                    INNER JOIN ras_period_version rpv
                        ON rp.master_id = rpv.master_id AND rp.id = rpv.period_id
                    GROUP BY rp.master_id, rp.id
                ) perv
                    ON rpsi.master_id = perv.master_id AND rpsi.period_id = perv.id
                INNER JOIN ras_period_version rpv
                    ON rpv.master_id = perv.master_id AND rpv.period_id = perv.id AND rpv.version = perv.version
                WHERE setv.master_id = ? AND rpsi.period_set_id = ? AND perv.delete_version IS NULL
            `, [ masterId, periodSet.id ]);
            // Dodaj period set u array
            periodSets.push({
                ...periodSet,
                periods: periods
            });
        }

        // Ako se traži samo jedan set izmjeni rezultat
        if (periodSetId)
            periodSets = periodSets[0];

        // Spremi promjene (nema ih)
        await con.commit();
        con.release();
        // Vrati rezultat
        return periodSets;

    } catch (err) {
        // Ako je bilo problema vrati grešku
        await con.rollback();
        con.release();
        throw err;
    }
}


// Obriši dani period set
exports.delete = async (periodSetId, masterId) => {

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();
        
        masterId = await master.getId(con, masterId);

        // Provjeri postoji li dani period set
        periodHelper.periodSetExists(con, masterId, periodSetId);

        // Ako postoji kreiraj novi master version i obriši ga
        const masterVersion = await master.getVersion(con, masterId);
        await con.query('UPDATE ras_period_set SET delete_version = ? WHERE master_id = ? AND id = ?', [ masterVersion, masterId, periodSetId ]);

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
exports.edit = async (properties, periodSetId, masterId) => {

    // Ako funkcija nema potrebne argumente
    if (!properties || !properties.name || !properties.uniqueName)
        throw new errors.ValidationError('Failed to edit period set, insufficient properties');

    const con = new db.Connection();

    try {

        await con.connect();
        await con.transaction();

        masterId = await master.getId(con, masterId);

        // Provjeri postoji li dani period set
        await periodHelper.periodSetExists(con, masterId, periodSetId);
        // Dobavi novu master verziju
        const masterVersion = await master.getVersion(con, masterId);
        // Provjeri postoji li period set koji ima unique ime jednak novim unique imenu
        const uniqueNameCheck = await con.query(`
            SELECT COUNT(*) AS nameExists FROM ras_period_set_version rpsv
            INNER JOIN (
                SELECT rps.master_id, rps.id, MAX(rpsv.version) AS version, rps.delete_version FROM ras_period_set rps
                INNER JOIN ras_period_set_version rpsv
                ON rps.master_id = rpsv.master_id AND rps.id = rpsv.period_set_id
                GROUP BY rps.master_id, rps.id
            ) grp
                ON grp.master_id = rpsv.master_id AND grp.id = rpsv.period_set_id AND grp.version = rpsv.version
            WHERE grp.master_id = ? AND rpsv.unique_name = ? AND grp.id != ? AND grp.delete_version IS NULL
        `, [ masterId, properties.uniqueName, periodSetId ]);
        // Ako postoji baci grešku
        if (uniqueNameCheck[0].nameExists)
            throw new errors.ValidationError('Period set with same unique name already exists');

        // Upiši nove postavke seta
        await con.query('INSERT INTO ras_period_set_version (master_id, period_set_id, version, name, unique_name) VALUES ?', 
            [[[ masterId, periodSetId, masterVersion, properties.name, properties.uniqueName ]]]
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
