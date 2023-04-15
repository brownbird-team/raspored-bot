// Dobavi vezu prema bazi
const db = require('../connect.js');
// Dobavi klase grešaka
const errors = require('../../errors.js');
// Helper funkcije za master tablice
const master = require('../helpers/master.js');
// Helper funkcije za period setove
const periodSetHelpers = require('../helpers/periodSet.js');
// Helper funkcije za class setove
const classSetHelpers = require('../helpers/classSet.js');

const findDate = async (con, date, masterId, masterVersion) => {

    const days = [ 'sun', 'mon', 'tue', 'wen', 'thu', 'fri', 'sat' ];
    const dayOfWeek = days[date.getDay()];

    // Dobavi koji dani u tjednu postoje
    await con.query(`
        SELECT rdv.day_id AS id, rdv.name, rdv.short, rdv.day_of_week AS dayOfWeek
        FROM ras_day_version rdv
        INNER JOIN (
            SELECT rd.master_id, rd.id, rd.delete_version, MAX(rdv.version) AS version
            FROM ras_day rd
            INNER JOIN ras_day_version rdv
                ON rdv.master_id = rd.master_id AND rdv.day_id = rd.id
            WHERE rdv.version <= ? AND (rd.delete_version IS NULL OR rd.delete_version > ?)
            GROUP BY rd.master_id, rd.id
        ) dayv
            ON dayv.master_id = rdv.master_id AND dayv.id = rdv.day_id AND dayv.version = rdv.version
        WHERE rdv.master_id = ? AND rdv.day_of_week IS NOT NULL
    `, [ masterVersion, masterVersion, masterId ]);

    const day = con.results.find((d) => d.dayOfWeek === dayOfWeek)
    if (!day)
        throw new errors.ValidationError('Given day does not have matching day of week in schedule');

    const currentWeek = Math.ceil(Math.ceil(date.getTime() / 1000 / 60 / 60 / 24) / 7);

    await con.query(`
        SELECT rwv.week_id AS id, rwv.name, rwv.short
        FROM ras_week_version rwv
        INNER JOIN (
            SELECT rw.master_id, rw.id, rw.delete_version, MAX(rwv.version) AS version
            FROM ras_week rw
            INNER JOIN ras_week_version rwv
                ON rwv.master_id = rw.master_id AND rwv.week_id = rw.id
            WHERE rwv.version <= ? AND (rw.delete_version IS NULL OR rw.delete_version > ?)
            GROUP BY rw.master_id, rw.id
        ) wekv
            ON wekv.master_id = rwv.master_id AND wekv.id = rwv.week_id AND wekv.version = rwv.version
        WHERE rwv.master_id = ? AND rwv.start_week IS NOT NULL
            AND (? - rwv.start_week) % rwv.week_cycle = 0;
    `, [ masterVersion, masterVersion, masterId, currentWeek ]);

    if (con.results.length === 0)
        throw new errors.ValidationError('Is seems that schedule does not have any weeks configured for this date');

    const week = con.results[0];
    
    return { day: day, week: week };
}


exports.create = async (periodSetId, classSetId, changeDate) => {
    // Provjeri jesu svi argumenti na broju
    if (!periodSetId && !classSetId && !changeDate)
        throw new errors.ValidationError('Failed to create daily change, some arguments are missing');

    // Ako datum ne valja
    const changeDateObject = new Date(changeDate);
    if (isNaN(changeDateObject))
        throw new errors.ValidationError('Invalid date specified');

    const con = new db.Connection();

    try {
        // Spoji se
        await con.connect();
        await con.transaction();

        const masterId = await master.getId(con);
        const masterVersion = await master.getCurrentVersion(con, masterId);

        // Provjeri postoji li dani period set
        await periodSetHelpers.periodSetExists(con, masterId, periodSetId);
        // Provjeri postoji li dani class set
        await classSetHelpers.classSetExists(con, masterId, classSetId);

        // Upiši novu izmjenu
        await con.query('INSERT INTO ras_change (change_type, master_id, master_version, change_date) VALUES ?',
            [[[ 'subject', masterId, masterVersion, changeDateObject ]]]
        );
        const changeId = con.results.insertId;
        // Upiši za subject tip izmjene
        await con.query('INSERT INTO ras_subject_change (change_id, master_id, change_type, class_set_id, period_set_id) VALUES ?',
            [[[ changeId, masterId, 'subject', classSetId, periodSetId ]]]
        );
        // Spremi promjene
        await con.commit();
        con.release();

    // Ako je došlo do greške napravi rollback
    } catch (err) {
        con.rollback();
        con.release();
        throw err;
    }
}

exports.set = async (dataObject) => {

    const allowedFieldTypes = [ 'lesson', 'rel', 'text', 'empty' ];
    const con = new db.Connection();

    try {
        // Spoji se na bazu
        await con.connect();
        await con.transaction();

        // Dobavi izmjenu na koju se ovo odnosi
        await con.query(`
            SELECT master_id, master_version, change_date
            FROM ras_change
            WHERE id = ? AND change_type = 'subject'
        `, [ dataObject.id ]);
        // Ako ne postoji poludi
        if (con.results.length === 0)
            throw new errors.ValidationError('Change with given ID does not exist');
        // Izvuci potrebne podatke o izmjeni
        const changeId = dataObject.id;                        // ID izmjene
        const masterId = con.results[0].master_id;             // ID master tablice u kojoj je napravljena
        const masterVersion = con.results[0].master_version;   // Verzija master tablice kada je kreirana
        const changeDateObject = con.results[0].change_date;   // Datum za koji je izmjena

        // Za datum izmjene dobavi koji je to tjedan i to
        const dateData = await findDate(con, changeDateObject, masterId, masterVersion);

        console.log(dateData);
        // Dobavi ID-e period i class setova
        await con.query(`
            SELECT class_set_id, period_set_id
            FROM ras_subject_change
            WHERE change_id = ?
        `, [ changeId ]);
        // Spremi ih u varijable
        const classSetId = con.results[0].class_set_id;
        const periodSetId = con.results[0].period_set_id;

        // Dobavi razrede koji su u setu razreda
        await con.query(`
            SELECT clsv.id, rcv.name, rcv.short
            FROM ras_class_set_item rcsi
            INNER JOIN (
                SELECT rcs.master_id, rcs.id, MAX(rcsilv.version) AS version FROM ras_class_set rcs
                INNER JOIN ras_class_set_item_list_version rcsilv
                    ON rcs.master_id = rcsilv.master_id AND rcs.id = rcsilv.class_set_id
                WHERE rcsilv.version <= ?
                GROUP BY rcs.master_id, rcs.id
            ) setv
                ON setv.master_id = rcsi.master_id AND setv.id = rcsi.class_set_id AND setv.version = rcsi.version
            INNER JOIN (
                SELECT rc.master_id, rc.id, rc.delete_version, MAX(rcv.version) AS version FROM ras_class rc
                INNER JOIN ras_class_version rcv
                    ON rc.master_id = rcv.master_id AND rc.id = rcv.class_id
                WHERE rcv.version <= ?
                GROUP BY rc.master_id, rc.id
            ) clsv
                ON rcsi.master_id = clsv.master_id AND rcsi.class_id = clsv.id
            INNER JOIN ras_class_version rcv
                ON rcv.master_id = clsv.master_id AND rcv.class_id = clsv.id AND rcv.version = clsv.version
            WHERE setv.master_id = ? AND rcsi.class_set_id = ? AND clsv.delete_version IS NULL
        `, [ masterVersion, masterVersion, masterId, classSetId ]);
        // Spremi ih
        const classesInClassSet = con.results;
        console.log('Classes in class set', classesInClassSet);
        
        // Dobavi periode u period setu
        await con.query(`
            SELECT perv.id, rpv.name, rpv.short, rpv.start_time AS startTime, rpv.end_time AS endTime, rpsi.specific_name AS specificName
            FROM ras_period_set_item rpsi
            INNER JOIN (
                SELECT rps.master_id, rps.id, MAX(rpsilv.version) AS version FROM ras_period_set rps
                INNER JOIN ras_period_set_item_list_version rpsilv
                    ON rps.master_id = rpsilv.master_id AND rps.id = rpsilv.period_set_id
                WHERE rpsilv.version <= ?
                GROUP BY rps.master_id, rps.id
            ) setv
                ON setv.master_id = rpsi.master_id AND setv.id = rpsi.period_set_id AND setv.version = rpsi.version
            INNER JOIN (
                SELECT rp.master_id, rp.id, rp.delete_version, MAX(rpv.version) AS version FROM ras_period rp
                INNER JOIN ras_period_version rpv
                    ON rp.master_id = rpv.master_id AND rp.id = rpv.period_id
                WHERE rpv.version <= ?
                GROUP BY rp.master_id, rp.id
            ) perv
                ON rpsi.master_id = perv.master_id AND rpsi.period_id = perv.id
            INNER JOIN ras_period_version rpv
                ON rpv.master_id = perv.master_id AND rpv.period_id = perv.id AND rpv.version = perv.version
            WHERE setv.master_id = ? AND rpsi.period_set_id = ? AND perv.delete_version IS NULL
        `, [ masterVersion, masterVersion, masterId, periodSetId ]);
        // Spremi ih u varijablu
        const periodsInPeriodSet = con.results;

        console.log( classesInClassSet, periodsInPeriodSet, masterId);

        // ------------------------- IZMJENE POLJA -----------------------------

        // Kreiraj mapu za polja ove izmjene
        const newChangeMap = new Map();
        // Za svako od polja izmjene
        for (const field of dataObject.fields) {
            // Provjeri je li dozvoljenog tipa
            if (allowedFieldTypes.indexOf(field.type) === -1)
                throw new errors.ValidationError('Given field type does not exist');
            // Provjeri je li period u period setu
            if (!periodsInPeriodSet.find((period) => period.id === field.periodId))
                throw new errors.ValidationError('Given period is not in the period set');
            // Provjeri postoji li dana grupa
            await con.query(`
                SELECT group_id AS groupId, version, name, class_id AS classId, division_tag AS divisionTag, everyone_group AS everyoneGroup
                FROM ras_group_version
                WHERE master_id = ? AND group_id = ? AND version <= ?
                ORDER BY version DESC
                LIMIT 1
            `, [ masterId, field.groupId, masterVersion ]);
            // Baci grešku ako ne
            if (con.results.length === 0)
                throw new errors.ValidationError('Given group does not exist');
            
            // Spremi podatke o grupi i razredu polja za poslje kod slanja
            field.groupData = con.results[0];
            field.classData = classesInClassSet.find((cls) => cls.id === con.results[0].classId);
            // Ako razred nije u class setu urlaj
            if (!field.classData)
                throw new errors.ValidationError('Given class is not in the class set');

            switch (field.type) {
                // Ako je tip izmjene lesson
                case 'lesson':
                    // Dobavi verziju grupe
                    await con.query(`
                        SELECT MAX(version) AS version
                        FROM ras_lesson_group_version
                        WHERE master_id = ? AND lesson_id = ? AND version <= ?
                    `, [ masterId, field.lessonId, masterVersion ]);
                    const lessonGroupVersion = con.results[0].version;
                    // Dobavi verziju profesora
                    await con.query(`
                        SELECT MAX(version) AS version
                        FROM ras_lesson_teacher_version
                        WHERE master_id = ? AND lesson_id = ? AND version <= ?
                    `, [ masterId, field.lessonId, masterVersion ]);
                    const lessonTeacherVersion = con.results[0].version;
                    // Provjeri postoji li lesson kojeg je dana grupa dio
                    await con.query(`
                        SELECT COUNT(*) AS lessonIsForGroup
                        FROM ras_lesson_group_version_item
                        WHERE master_id = ?
                            AND lesson_id = ?
                            AND version = ?
                            AND group_id = ?
                    `, [ masterId, field.lessonId, lessonGroupVersion, field.groupId ]);

                    if (!con.results[0].lessonIsForGroup)
                        throw new errors.ValidationError('Given lesson does not exist or the group ID is not part of it');

                    // Dobavi profesore koji su na tom lessonu
                    await con.query(`
                        SELECT rtv.teacher_id AS id, rtv.firstname, rtv.lastname, rtv.email, rtv.gender, rtv.color
                        FROM ras_lesson_teacher_version_item rltvi
                        INNER JOIN (
                            SELECT rt.master_id, rt.id, rt.delete_version, MAX(rtv.version) AS version
                            FROM ras_teacher rt
                            INNER JOIN ras_teacher_version rtv
                                ON rt.id = rtv.teacher_id AND rt.master_id = rtv.master_id
                            WHERE rtv.version <= ?
                            GROUP BY rt.master_id, rt.id
                        ) tecv
                            ON tecv.master_id = rltvi.master_id AND tecv.id = rltvi.teacher_id
                        INNER JOIN ras_teacher_version rtv
                            ON rtv.master_id = tecv.master_id AND rtv.version = tecv.version AND rtv.teacher_id = tecv.id
                        WHERE rtv.master_id = ?
                            AND rltvi.lesson_id = ?
                            AND rltvi.version = ?
                    `, [ masterVersion, masterId, field.lessonId, lessonTeacherVersion ]);
                    // Spremi ih za kasnije
                    field.teachers = con.results;

                    break;
                // Ako je tip relacija između profesora i predmeta
                case 'rel':
                    // Provjeri postoji li profesor
                    await con.query(`
                        SELECT teacher_id AS teacherId, firstname, lastname, email, gender, color
                        FROM ras_teacher_version
                        WHERE master_id = ? AND teacher_id = ? AND version <= ?
                        ORDER BY version DESC
                        LIMIT 1
                    `, [ masterId, field.teacherId, masterVersion ]);

                    if (con.results.length === 0)
                        throw new errors.ValidationError('Given teacher does not exist');
                    // Spremi ga za poslje
                    field.teacherData = con.results[0];
                    
                    // Provjeri postoji li predmet
                    await con.query(`
                        SELECT subject_id AS subjectId, name, short
                        FROM ras_subject_version
                        WHERE master_id = ? AND subject_id = ? AND version <= ?
                        ORDER BY version DESC
                        LIMIT 1
                    `, [ masterId, field.subjectId, masterVersion ]);

                    if (con.results.length === 0)
                        throw new errors.ValidationError('Given subject does not exist');
                    // Spremi ga za poslje
                    field.subjectData = con.results[0];
                    
                    break;

                // Ako je tip polja tekst
                case 'text':
                    // Provjeri jel tekst OK
                    if (field.text.length === 0)
                        throw new errors.ValidationError('Cannot add empty text field');
                    if (field.text.length > 256)
                        throw new errors.ValidationError('Content of text field can have max 256 characters');
                    
                    break;
            }
            // Ako je sve prošlo OK dodaj polje za kasniju obradu
            newChangeMap.set( field.periodId + '_' + field.groupId , field);
        }

        console.dir(dataObject.fields, { depth: 10 });

        // Dobavi sva polja iz prošle verzije izmjene
        await con.query(`
            SELECT rscf.id, rscf.change_id AS changeId, rscf.field_type AS type,
                rscf.period_id AS periodId, rscf.group_id AS groupId, rscfl.lesson_id AS lessonId,
                rscfr.teacher_id AS teacherId, rscfr.subject_id AS subjectId, rscfr.classroom_text AS relClassroom,
                rscft.field_text AS fieldText, rscft.classroom_text AS textClassroom
            FROM ras_subject_change_field rscf
            INNER JOIN (
                SELECT rscf.change_id, rscf.period_id, rscf.group_id, MAX(rscf.change_version_id) AS change_version_id
                FROM ras_subject_change_field rscf
                GROUP BY rscf.change_id, rscf.period_id, rscf.group_id
            ) rscfv
                ON rscfv.change_id = rscf.change_id 
                    AND rscfv.period_id = rscf.period_id
                    AND rscf.group_id = rscfv.group_id
                    AND rscf.change_version_id = rscfv.change_version_id
            LEFT JOIN ras_subject_change_field_lesson rscfl
                ON rscfl.field_id = rscf.id
            LEFT JOIN ras_subject_change_field_rel rscfr
                ON rscfr.field_id = rscf.id
            LEFT JOIN ras_subject_change_field_text rscft
                ON rscft.field_id = rscf.id
            WHERE rscf.change_id = ? AND rscf.field_type != 'normal'
        `, [ changeId ]);
        
        // Pretvori rezultate upita u mapu
        const oldChangeMap = new Map();
        for (const field of con.results)
            oldChangeMap.set(field.periodId + '_' + field.groupId, field);
              
        await con.query('INSERT INTO ras_change_version (change_id, created) VALUES (?, NOW())', [[[ changeId ]]]);
        const newChangeVersion = con.results.insertId;
        
        // Array objekata koji opisuju polja za upis
        const prepareFields = [];
        
        // Prođi sva polja iz prošle verzije ove izmjene
        for (const [key, oldField] of oldChangeMap.entries()) {
            // Izvuci podatke
            const periodId = oldField.periodId;
            const groupId = oldField.groupId;
            // Probaj dobavit novo polje koje je za isti period i grupu
            const newField = newChangeMap.get(key);
            // Ako takvo novo polje ne postoji znači da je obrisano
            if (!newField) {
                // Što znači da oni imaju ono što bi normalno imali
                prepareFields.push({
                    periodId: periodId,
                    groupId: groupId,
                    type: 'normal',
                });
            // Ako to polje postoji
            } else {
                // Provjeri je li isto za svaki tip na njegov način
                // ako nije isto upiši ga, ako je isto do nothing
                switch (newField.type) {
                    case 'lesson':
                        if (newField.type !== oldField.type
                            || newField.lessonId !== oldField.lessonId
                        )
                            prepareFields.push(newField);
                        break;
                    case 'rel':
                        if (newField.type !== oldField.type
                            || newField.teacherId !== oldField.teacherId
                            || newField.subjectId !== oldField.subjectId
                            || newField.classroom !== oldField.relClassroom
                        )
                            prepareFields.push(newField);
                        break;
                    case 'text':
                        if (newField.type !== oldField.type
                            || newField.text !== oldField.fieldText
                            || newField.classroom !== oldField.textClassroom
                        )
                            prepareFields.push(newField);
                        break;
                    case 'empty':
                        if (newField.type !== oldField.type)
                            prepareFields.push(newField);
                        break;
                }
            }
            // Pobriši novo polje jer je obrađeno
            newChangeMap.delete(key);
        }

        // Ubaci i sva preostala polja jer su očito na novo dodana
        // i ne postoje još u bazi za ovu izmjenu
        for (const newField of newChangeMap.values())
            prepareFields.push(newField);

        console.log('---------------', prepareFields);
        // Za svako od polja spremnih za upis
        for (const newField of prepareFields) {
            // Upiši polje
            await con.query(
                'INSERT INTO ras_subject_change_field (change_id, master_id, change_version_id, field_type, period_id, group_id) VALUES ?',
                [[[ changeId, masterId, newChangeVersion, newField.type, newField.periodId, newField.groupId ]]]
            );
            // Provjeri kojeg je polje tipa
            switch (newField.type) {
                // Ako je lesson upiši polje u lesson tablicu
                case 'lesson':
                    await con.query(
                        'INSERT INTO ras_subject_change_field_lesson VALUES ?',
                        [[[ con.results.insertId, newField.type, masterId, newField.lessonId ]]]
                    );
                    break;
                // Ako je rel upiši polje u rel tablicu
                case 'rel':
                    await con.query(
                        'INSERT INTO ras_subject_change_field_rel VALUES ?',
                        [[[ con.results.insertId, newField.type, masterId, newField.teacherId, newField.subjectId, newField.classroom ]]]
                    );
                    break;
                // Ako je text upiši polje u text tablicu
                case 'text':
                    await con.query(
                        'INSERT INTO ras_subject_change_field_text VALUES ?',
                        [[[ con.results.insertId, newField.type, newField.text, newField.classroom ]]]
                    );
                    break;
            }
        }

        // --------------------- IZMJENE U UČIONICAMA LESSONA ------------------

        // Dobavi listu izmjena učionica iz prethodne verzije
        await con.query(`
            SELECT rsclc.period_id AS periodId, rsclc.lesson_id AS lessonId, rsclc.classroom_text AS classroomText
            FROM ras_subject_change_lesson_classroom rsclc
            INNER JOIN (
                SELECT change_id, master_id, period_id, lesson_id, MAX(change_version_id) AS version
                FROM ras_subject_change_lesson_classroom
                GROUP BY change_id, master_id, period_id, lesson_id
            ) lesv
                ON lesv.change_id = rsclc.change_id
                    AND lesv.master_id = rsclc.master_id
                    AND lesv.period_id = rsclc.period_id
                    AND lesv.lesson_id = rsclc.lesson_id
                    AND lesv.version = rsclc.change_version_id
            WHERE rsclc.change_id = 3 AND rsclc.classroom_text IS NOT NULL
        `, [ changeId ]);
        // Posloži ih u mapu
        const oldLessonClassrooms = new Map();
        for (const classroom of con.results)
            oldLessonClassrooms.set(classroom.periodId + '_' + classroom.lessonId, classroom);

        const newLessonClassrooms = new Map();

        // Provjeri sve nove izmjene
        for (const classroom of dataObject.lessonClassrooms) {
            // Provjeri nalazi li se preiod u setu perioda
            if (!periodsInPeriodSet.find((per) => per.id === classroom.periodId))
                throw new errors.ValidationError('Given period is not in the period set');

            // Dobavi sve razrede tog lessona u verziji rasporeda
            // kada je kreirana izmjena
            await con.query(`
                SELECT rlgvi.lesson_id, rgv.class_id, rgv.group_id
                FROM ras_lesson_group_version_item rlgvi
                INNER JOIN (
                    SELECT master_id, lesson_id, MAX(version) AS version
                    FROM ras_lesson_group_version
                    WHERE version <= ?
                    GROUP BY master_id, lesson_id
                ) lesv
                    ON rlgvi.master_id = lesv.master_id AND rlgvi.lesson_id = lesv.lesson_id AND rlgvi.version = lesv.version
                INNER JOIN (
                    SELECT rg.id, rg.master_id, rg.delete_version, MAX(rgv.version) AS version
                    FROM ras_group rg
                    INNER JOIN ras_group_version rgv
                        ON rg.id = rgv.group_id AND rg.master_id = rgv.master_id
                    WHERE rgv.version <= ?
                    GROUP BY rg.id, rg.master_id
                ) grpv
                    ON grpv.master_id = rlgvi.master_id AND grpv.id = rlgvi.group_id
                INNER JOIN ras_group_version rgv
                    ON rgv.master_id = lesv.master_id AND rgv.group_id = rlgvi.group_id AND rgv.version = grpv.version
                WHERE rlgvi.lesson_id = ? AND rlgvi.master_id = ?
            `, [ masterVersion, masterVersion, classroom.lessonId, masterId ]);

            console.log(con.results, classesInClassSet);
            // Ako lesson nema razreda nema baš smisla
            if (con.results.length === 0)
                throw new errors.ValidationError('Given lesson does not have any classes (groups) asociated with it');
            
            // Provjeri nalazi li se barem 1 od razreda u class setu
            let classFound = false;
            for (const cls of con.results) {
                if (classesInClassSet.find((clls) => clls.id === cls.class_id )) {
                    classFound = true
                    //classroom.classesToNotify.push(cls)
                }
            }
            // Ako se ne nalazi javi grešku
            if (!classFound)
                throw new errors.ValidationError('Given lesson does not have any groups whose classes are in the class set');
            // Ubaci novu izmjenu u mapu
            newLessonClassrooms.set(classroom.periodId + '_' + classroom.lessonId, classroom);

        }
        // Za ubacit u bazu
        const insertClassrooms = [];
        // Za svaku od starih izmjena učionica
        for (const [id, room] of oldLessonClassrooms.entries()) {
            // Probaj dobavit novu učionicu
            const newRoom = newLessonClassrooms.get(id);
            // Ako nova učionica ne postoji znači da je obrisana u novoj izmjeni
            if (!newRoom) {
                // Ubaci u bazu da je obrisana
                insertClassrooms.push(
                    [ changeId, masterId, room.periodId, newChangeVersion, room.lessonId, null ]
                );
            // Ako nova postoji i različite su opet upiši u bazu
            } else if (newRoom.classroomText !== room.classroomText) {
                insertClassrooms.push(
                    [ changeId, masterId, room.periodId, newChangeVersion, room.lessonId, newRoom.classroomText ]
                );
            }
            // Pobriši novu iz mape
            newLessonClassrooms.delete(id);
        }
        // Za sve nove koje su ostale jer do sad nisu postojale, napravi da postoje
        for (const room of newLessonClassrooms.values()) {
            insertClassrooms.push(
                [ changeId, masterId, room.periodId, newChangeVersion, room.lessonId, room.classroomText ]
            );
        }

        // Upiši u bazu
        if (insertClassrooms.length > 0)
            await con.query('INSERT INTO ras_subject_change_lesson_classroom VALUES ?', [ insertClassrooms ]);

        // ------------- KONVERZIJA U OBJEKTE POGODNE ZA SLANJE ----------------

        for (const field of prepareFields) {
            if (field.type === 'lesson') {
                // Ako postoji izmjena učionice dodjeli je
                const roomTextRec = insertClassrooms.find((less) => less[4] === field.lessonId);
                if (roomTextRec)
                    field.classroomText = roomTextRec[5];
                
                // Povuci podatke za subject lessona

                await con.query(`
                    SELECT rsv.subject_id AS id, rsv.name, rsv.short
                    FROM ras_lesson_version rlv
                    INNER JOIN (
                        SELECT rl.master_id, rl.id, rl.delete_version, MAX(rlv.version) AS version
                        FROM ras_lesson rl
                        INNER JOIN ras_lesson_version rlv
                            ON rlv.master_id = rl.master_id AND rlv.lesson_id = rl.id
                        WHERE rlv.version <= ? AND (rl.delete_version IS NULL OR rl.delete_version > ?)
                        GROUP BY rl.master_id, rl.id
                    ) lesv
                        ON lesv.master_id = rlv.master_id AND lesv.id = rlv.lesson_id AND lesv.version = rlv.version
                    INNER JOIN ras_subject_version rsv
                        ON rlv.master_id = rsv.master_id AND rlv.subject_id = rsv.subject_id
                    INNER JOIN (
                        SELECT rs.master_id, rs.id, rs.delete_version, MAX(rsv.version) AS version
                        FROM ras_subject rs
                        INNER JOIN ras_subject_version rsv
                            ON rsv.master_id = rs.master_id AND rsv.subject_id = rs.id
                        WHERE rsv.version <= ? AND (rs.delete_version IS NULL OR rs.delete_version > ?)
                        GROUP BY rs.master_id, rs.id
                    ) subv
                        ON subv.master_id = rsv.master_id AND subv.id = rsv.subject_id AND subv.version = rsv.version
                    WHERE rlv.master_id = ? AND rlv.lesson_id = ?
                `, [ masterVersion, masterVersion, masterVersion, masterVersion, masterId, field.lessonId ]);

                field.subjectData = con.results[0];

            }
        }

        console.dir(prepareFields, { depth: null });

        // Upiši promjene
        con.commit();
        con.release();

    // Ako je došlo do greške napravi rollback
    } catch (err) {
        await con.rollback();
        con.release();
        throw err;
    }
}
