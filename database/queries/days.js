// Dobavi vezu prema bazi
const db = require('./../connect.js');
// Dobavi klase grešaka
const errors = require('./../../errors.js');
// Helper funkcije za master tablice
const master = require('./../helpers/master.js');

// Lista ispravnih vrijednosti za dan u tjednu
const validDaysOfWeek = [ 'mon', 'tue', 'wen', 'thu', 'fri', 'sat', 'sun', null ];


// Za svaki od dana postavi koji je dan u tjednu
exports.setDays = async (days, masterId) => {

    if (!Array.isArray(days))
        throw new errors.ValidationError('Days must be specified in an array');

    const con = new db.Connection();

    try {

        await con.connect();
        await con.transaction();

        masterId = await master.getId(con, masterId);

        // Provjeri svaki od dana
        for (const day of days) {
            // Ako ima nevaljanu vrijednost dana
            if (validDaysOfWeek.indexOf(day.dayOfWeek) === -1)
                throw new errors.ValidationError('Invalid value for dayOfWeek property');
            // Provjeri postoji li
            await con.query(`
                SELECT COUNT(*) AS dayExists
                FROM ras_day
                WHERE delete_version IS NULL AND master_id = ? AND id = ?
            `, [ masterId, day.id ]);
            if (!con.results[0].dayExists)
                throw new errors.ValidationError('One of given days does not exist');
        }

        // Dobavi sve trenutne dane
        const currentDays = await con.query(`
            SELECT rdv.day_id AS dayId, rdv.name, rdv.short, rdv.day_of_week AS dayOfWeek
            FROM ras_day_version rdv
            INNER JOIN (
                SELECT rd.master_id, rd.id, rd.delete_version, MAX(rdv.version) AS version
                FROM ras_day rd
                INNER JOIN ras_day_version rdv
                    ON rd.master_id = rdv.master_id AND rd.id = rdv.day_id
                GROUP BY rd.master_id, rd.id
            ) dayv
                ON rdv.master_id = dayv.master_id AND rdv.day_id = dayv.id AND rdv.version = dayv.version
            WHERE dayv.delete_version IS NULL AND dayv.master_id = ?
        `, [ masterId ]);
        // Dobavi master verziju
        const masterVersion = await master.getVersion(con, masterId);
        const insertDays = [];
        // Pripremi dane koji su se izmjenili za upis
        for (const day of currentDays) {

            const newValue = days.find((d) => d.id === day.dayId && d.dayOfWeek !== day.dayOfWeek);
            if (!newValue) continue;

            insertDays.push([ masterId, day.dayId, masterVersion, day.name, day.short, newValue.dayOfWeek ]);
        }
        // Upiši izmjenjene dane ako ih ima
        if (insertDays.length > 0)
            await con.query('INSERT INTO ras_day_version VALUES ?', [ insertDays ]);
        // Spremi promjene
        await con.commit();
        con.release();
    
    // Ako je došlo do greške napravi rollback
    } catch (err) {
        await con.rollback();
        con.release();
        throw err;
    }
    
}