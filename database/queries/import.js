// Funkcija za pretvorbu XML exporta iz ASC Timetables programa u JS objekt
const ascTimetableConvert = require('../../converter/ascTimetablesConverter.js');
// Funkcije za izvršavanje query-a u bazi
const db = require('../connect.js');
// Klase grešaka
const errors = require('../../errors.js');
// Funkcije za obavještavanje administratora o grešci
const notifier = require('./../../globalErrorNotifier.js');


// Uvezi u bazu novu master tablicu iz XML-a koji je
// generirao ASC Timetables program za rasporede
exports.ascTimetable = async (xmlString) => {

    // Napravi konverziju ASC timetable XML-a u JS objekt
    const timetable = ascTimetableConvert(xmlString);

    // Kreiraj database connection object
    const con = new db.Connection();

    // Probaj upisati Timetable u bazu
    try {
        // Spoji se na bazu
        await con.connect();
        // Započni transakciju
        await con.transaction();

        // Kreiraj novu verziju master tablice i spremi njen ID
        await con.query('INSERT INTO ras_master_table SET ?', { 
            created: new Date(),
            name: 'ASC Timetable import',
            description: 'This master table has been imported from ASC Timetables',
        });
        const master_id = con.results.insertId;

        // Kreiraj prvu verziju novokreirane master tablice i spremi njen ID (verziju)
        await con.query('INSERT INTO ras_master_version SET ?', {
            master_id: master_id,
        });
        const master_version = con.results.insertId;

        // Pripremi periode za upis u bazu
        const periods = [];
        const periodVersions = [];
        for (const [key, value] of timetable.periods.entries()) {
            periods.push([
                master_id, value.__internalId
            ]);
            periodVersions.push([
                master_id, value.__internalId, master_version, value.name, value.short, value.starttime, value.endtime
            ]);
        }   
        // Upiši periode u bazu
        await con.query('INSERT INTO ras_period (master_id, id) VALUES ?', [ periods ]);
        await con.query('INSERT INTO ras_period_version (master_id, period_id, version, name, short, start_time, end_time) VALUES ?', [ periodVersions ]);

        // Pripremi dane za upis u bazu
        const days = [];
        const dayVersions = [];
        for (const [key, value] of timetable.days.entries()) {
            days.push([
                master_id, value.__internalId
            ]);
            dayVersions.push([
                master_id, value.__internalId, master_version, value.name, value.short
            ]);
        }
        // Upiši dane u bazu
        await con.query('INSERT INTO ras_day (master_id, id) VALUES ?', [ days ]);
        await con.query('INSERT INTO ras_day_version (master_id, day_id, version, name, short) VALUES ?', [ dayVersions ]);

        // Pripremi tjedne za upis u bazu
        const weeks = [];
        const weekVersions = [];
        for (const week of timetable.weeks.values()) {
            weeks.push([
                master_id, week.__internalId
            ]);
            weekVersions.push([
                master_id, week.__internalId, master_version, week.name, week.short
            ]);
        }
        // Upiši tjedne u bazu
        await con.query('INSERT INTO ras_week (master_id, id) VALUES ?', [ weeks ]);
        await con.query('INSERT INTO ras_week_version (master_id, week_id, version, name, short) VALUES ?', [ weekVersions ]);

        // Pripremi term-ove za upis u bazu
        const terms = [];
        const termVersions = [];
        for (const term of timetable.terms.values()) {
            terms.push([
                master_id, term.__internalId
            ]);
            termVersions.push([
                master_id, term.__internalId, master_version, term.name, term.short
            ]);
        }
        // Upiši term-ove u bazu
        await con.query('INSERT INTO ras_term (master_id, id) VALUES ?', [ terms ]);
        await con.query('INSERT INTO ras_term_version (master_id, term_id, version, name, short) VALUES ?', [ termVersions ]);

        // Pripremi razrede za upis u bazu
        const classes = [];
        const classVersions = [];
        for (const cls of timetable.classes.values()) {
            classes.push([
                master_id, cls.__internalId
            ]);
            classVersions.push([
                master_id, cls.__internalId, master_version, cls.name, cls.short
            ])
        }
        // Upiši razrede u bazu
        await con.query('INSERT INTO ras_class (master_id, id) VALUES ?', [ classes ]);
        await con.query('INSERT INTO ras_class_version (master_id, class_id, version, name, short) VALUES ?', [ classVersions ]);

        // Pripremi predmete za upis u bazu
        const subjects = [];
        const subjectVersions = [];
        for (const subject of timetable.subjects.values()) {
            subjects.push([
                master_id, subject.__internalId
            ]);
            subjectVersions.push([
                master_id, subject.__internalId, master_version, subject.name, subject.short
            ]);
        }
        // Upiši predmete u bazu
        await con.query('INSERT INTO ras_subject (master_id, id) VALUES ?', [ subjects ]);
        await con.query('INSERT INTO ras_subject_version (master_id, subject_id, version, name, short) VALUES ?', [ subjectVersions ]);

        // Pripremi profesore za upis u bazu
        const teachers = [];
        const teacherVersions = [];
        for (const teacher of timetable.teachers.values()) {
            teachers.push([
                master_id, teacher.__internalId
            ]);
            teacherVersions.push([
                master_id, teacher.__internalId, master_version, teacher.firstname, teacher.lastname, teacher.email, teacher.gender, teacher.color
            ]);
        }
        // Upiši profesore u bazu
        await con.query('INSERT INTO ras_teacher (master_id, id) VALUES ?', [ teachers ]);
        await con.query('INSERT INTO ras_teacher_version (master_id, teacher_id, version, firstname, lastname, email, gender, color) VALUES ?', [ teacherVersions ]);

        // Pripremi grupe (djelove razreda) za upis u bazu
        const groups = [];
        const groupVersions = [];
        for (const group of timetable.groups.values()) {
            groups.push([
                master_id, group.__internalId,
            ]);
            groupVersions.push([
                master_id, group.__internalId, master_version, group.name, group.__internalClassId, group.__internalDivisionId, group.__internalEveryoneGroup
            ]);
        }
        // Upiši grupe u bazu
        await con.query('INSERT INTO ras_group (master_id, id) VALUES ?', [ groups ]);
        await con.query('INSERT INTO ras_group_version (master_id, group_id, version, name, class_id, division_tag, everyone_group) VALUES ?', [ groupVersions ]);
        
        // Pripremi lessone za upis u bazu
        const lessons = [];
        const lessonVersions = [];
        const lessonGroupVersions = [];
        const lessonGroupVersionItems = [];
        const lessonTeacherVersions = [];
        const lessonTeacherVersionItems = [];
        // Za svaki lesson
        for (const lesson of timetable.lessons.values()) {
            // Kreiraj novi lesson
            lessons.push([
                master_id, lesson.__internalId
            ]);
            // Kreiraj novu verziju tog lessona
            lessonVersions.push([
                master_id, lesson.__internalId, master_version, lesson.__internalSubjectId
            ]);
            // Kreiraj novu verziju liste grupa tog lessona
            lessonGroupVersions.push([
                master_id, lesson.__internalId, master_version
            ]);
            // Dodaj sve grupe lessona u novu verziju liste grupa
            for (const lessonGroupId of lesson.__internalGroupIds) {
                lessonGroupVersionItems.push([
                    master_id, lesson.__internalId, master_version, lessonGroupId
                ]);
            }
            // Kreiraj novu verziju liste profesora tog lessona
            lessonTeacherVersions.push([
                master_id, lesson.__internalId, master_version
            ]);
            // Dodaj sve profesore lessona u novu verziju liste profesora
            for (const lessonTeacherId of lesson.__internalTeacherIds) {
                lessonTeacherVersionItems.push([
                    master_id, lesson.__internalId, master_version, lessonTeacherId
                ]);
            }
        }

        // Upiši lessone u bazu
        await con.query('INSERT INTO ras_lesson (master_id, id) VALUES ?', [ lessons ]);
        await con.query('INSERT INTO ras_lesson_version (master_id, lesson_id, version, subject_id) VALUES ?', [ lessonVersions ]);
        await con.query('INSERT INTO ras_lesson_group_version (master_id, lesson_id, version) VALUES ?', [ lessonGroupVersions ]);
        await con.query('INSERT INTO ras_lesson_group_version_item (master_id, lesson_id, version, group_id) VALUES ?', [ lessonGroupVersionItems ]);
        await con.query('INSERT INTO ras_lesson_teacher_version (master_id, lesson_id, version) VALUES ?', [ lessonTeacherVersions ]);
        await con.query('INSERT INTO ras_lesson_teacher_version_item (master_id, lesson_id, version, teacher_id) VALUES ?', [ lessonTeacherVersionItems ]);

        // Pripremi cardove (kartice) za upis u bazu
        const cards = [];
        const cardVersions = [];
        for (const card of timetable.cards.values()) {
            cards.push([
                master_id, card.__internalId
            ]);
            cardVersions.push([
                master_id, card.__internalId, master_version, card.__internalLessonId, card.__internalPeriodId, card.__internalDayId, card.__internalWeekId, card.__internalTermId
            ]);
        }
        // Upiši cardove u bazu
        await con.query('INSERT INTO ras_card (master_id, id) VALUES ?', [ cards ]);
        await con.query('INSERT INTO ras_card_version (master_id, card_id, version, lesson_id, period_id, day_id, week_id, term_id) VALUES ?', [ cardVersions ]);
        
        // Ako je za sada sve OK spremi promjene u bazu
        await con.commit();
        // Connection nam više ne treba pa ga otpuštamo
        con.release();

    // Ukoliko je došlo do greške prilikom upisa
    } catch (err) {
        // Pošalji grešku administratoru
        //notifier.handle(err);
        // Poništi sve promjene koje su napravljene tijekom ove transakcije
        await con.rollback();
        // Baci grešku jer import nije bilo moguće završiti
        throw new errors.importError('Database error occurred while trying to insert new master table');
    }
}