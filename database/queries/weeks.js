// Dobavi vezu prema bazi
const db = require('./../connect.js');
// Dobavi klase grešaka
const errors = require('./../../errors.js');
// Helper funkcije za master tablice
const master = require('./../helpers/master.js');


// Odredi trenutni poredak tjedana u realnom vremenu
exports.setWeekOrder = async (weekIds, masterId) => {
    // Ako nije array baci se
    if (!Array.isArray(weekIds))
        throw errors.ValidationError('Invalid input for week ids');

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();

        masterId = await master.getId(con, masterId);

        // Dobavi master verziju
        const masterVersion = await master.getVersion(con, masterId);

        // Provjeri ima li duplikata među tjednima
        const weekDuplicates = weekIds.filter((weekId, index, weekArray) => weekArray.indexOf(weekId) !== index);
        if (weekDuplicates.length > 0)
            throw errors.ValidationError('There are duplicates amoung specified week ids');

        // Provjeri postoje li svi tjedni
        for (const weekId of weekIds) {
            await con.query(`
                SELECT COUNT(*) AS weekExists
                FROM ras_week
                WHERE delete_version IS NULL AND master_id = ? AND id = ?
            `, [ masterId, weekId ]);

            if (!con.results[0].weekExists)
                throw new errors.ValidationError('One of specified weeks does not exist');
        }

        // Dobavi sve tjedne koji trenutno postoje
        const allWeekData = await con.query(`
            SELECT rwv.master_id, rwv.week_id AS id, rwv.version, rwv.start_week, rwv.week_cycle, rwv.name, rwv.short
            FROM ras_week_version rwv
            INNER JOIN (
                SELECT rw.master_id, rw.id, rw.delete_version, MAX(rwv.version) AS version FROM ras_week rw
                INNER JOIN ras_week_version rwv
                    ON rw.master_id = rwv.master_id AND rw.id = rwv.week_id
                GROUP BY rw.master_id, rw.id
            ) wekv
                ON rwv.master_id = wekv.master_id AND rwv.week_id = wekv.id AND rwv.version = wekv.version
            WHERE wekv.delete_version IS NULL AND wekv.master_id = ?
        `, [ masterId ]);

        // Odredi trenutni tjedan
        let currentWeek = Math.ceil(Math.ceil(Date.now() / 1000 / 60 / 60 / 24) / 7);

        // Pripremi podatke za upis
        const insertWeeks = allWeekData.map((week) => {
            if (weekIds.indexOf(week.id) === -1)
                return [ masterId, week.id, masterVersion, null, null, week.name, week.short ];
            else
                return [ masterId, week.id, masterVersion, currentWeek++, weekIds.length, week.name, week.short ];
        });
        // Upiši podatke
        await con.query('INSERT INTO ras_week_version VALUES ?', [ insertWeeks ]);

        await con.commit();
        con.release();
    
    } catch (err) {
        // Ako je došlo do greške napravi rollback
        await con.rollback();
        con.release();
        throw err;
    }
}