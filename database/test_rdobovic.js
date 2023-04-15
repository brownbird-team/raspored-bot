const db = require('./connect.js');
const databaseImport = require('./queries/import.js');
const periodSet = require('./queries/periodSet.js');
const classSet = require('./queries/classSet.js');
const weeks = require('./queries/weeks.js');
const days = require('./queries/days.js');
const subjectChange = require('./queries/subjectChange.js');
const fs = require('fs');

const converter = require('./../converter/ascTimetablesConverter.js');

const func = async () => {
    await db.databaseInit();

    const xml = fs.readFileSync(__dirname + '/../converter/xml_export_G419.xml');

    //converter(xml);

    //await databaseImport.ascTimetable(xml);

    /*const id = await periodSet.create({
        name: 'A SMJENA',
        uniqueName: 'a-smjena',
        periods: [
            { id: 1, name: 'sat 1'},
            { id: 2, name: 'sat 2'},
        ]
    });*/

    /*await periodSet.setPeriods(16, [
        {id: 1, name: 'novi 1'},
        {id: 2, name: 'novi 2'},
        {id: 3, name: 'novi 3'},
    ]);*/

    /*await periodSet.edit({
        name: 'A SMJENA 123',
        uniqueName: 'a-smjena-123aaa'
    }, 14);*/

    //await periodSet.delete(16);

    /*await classSet.create({
        name: 'A smjena',
        uniqueName: 'a-smjena-03',
        classes: [
            33, 34, 35
        ]
    });*/

   /* await classSet.setClasses(3, [
        39, 45
    ], 1);*/

    //weeks.setWeekOrder([ 24, 25 ]);

    //const dys = await days.setDays([ { id: 21, dayOfWeek: null }, {id: 18, dayOfWeek: 'mon'} ]);

    //await periodSet.create({ name: 'TESTING', uniqueName: 'TESTING', periods: [ {id: 2, name: 'TEST'} ] });
    //await classSet.create({ name: 'TESTING', uniqueName: 'TESTING', classes: [ 45 ] });

    const pers = await periodSet.get(undefined, 2);
    //console.dir(pers, { depth: 5});
    const clss = await classSet.get(undefined, 2);
    //console.dir(clss, { depth: 5 });

    //await subjectChange.create(17, 4, '2023-04-12 17:34:45');
    await subjectChange.set({
        id: 3,
        lessonClassrooms: [
            { periodId: 2, lessonId: 630, classroomText: '2-4' }
        ],
        fields: [
            //{ periodId: 2, groupId: 393, type: 'rel', teacherId: 257, subjectId: 107 }
            { periodId: 2, groupId: 393, type: 'lesson', lessonId: 630 }
            //{ periodId: 2, groupId: 398374283748, type: 'empty', text: 'TESTING 123', classroom: '2-2' }
        ]
    });

    //console.log(db.Connection.format('SELECT * FROM tt WHERE t = ?', [ 7 ]));
}

func();