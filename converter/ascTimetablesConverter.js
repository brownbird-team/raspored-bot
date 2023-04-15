const fs = require('fs');
const convert = require("xml-js");
const errors = require('../errors.js');

// Definicija elemenata tablice koja se kasnije koristi za provjere
const requiredAttributes = {

// --------------------------------------------------------------------------------------------------------------------    
//  Ime elementa   Roditeljski element        Atributi koje element mora sadržavati 
// --------------------------------------------------------------------------------------------------------------------    
    'timetable': { parent: '',          attrs: []                                                                     },
    'periods':   { parent: 'timetable', attrs: []                                                                     },
    'daydefs':   { parent: 'timetable', attrs: []                                                                     },
    'weeksdefs': { parent: 'timetable', attrs: []                                                                     },
    'termsdefs': { parent: 'timetable', attrs: []                                                                     },
    'classes':   { parent: 'timetable', attrs: []                                                                     },
    'subjects':  { parent: 'timetable', attrs: []                                                                     },
    'teachers':  { parent: 'timetable', attrs: []                                                                     },
    'groups':    { parent: 'timetable', attrs: []                                                                     },
    'lessons':   { parent: 'timetable', attrs: []                                                                     },
    'cards':     { parent: 'timetable', attrs: []                                                                     },
    'period':    { parent: 'periods',   attrs: [ 'name', 'short', 'period', 'starttime', 'endtime' ]                  },
    'daysdef':   { parent: 'daysdefs',  attrs: [ 'id', 'name', 'short', 'days'  ]                                     },
    'weeksdef':  { parent: 'weeksdefs', attrs: [ 'id', 'name', 'short', 'weeks' ]                                     },
    'termsdef':  { parent: 'termsdefs', attrs: [ 'id', 'name', 'short', 'terms' ]                                     },
    'class':     { parent: 'classes',   attrs: [ 'id', 'name', 'short' ]                                              },
    'subject':   { parent: 'subjects',  attrs: [ 'id', 'name', 'short' ]                                              },
    'teacher':   { parent: 'teachers',  attrs: [ 'id', 'firstname', 'lastname', 'short', 'gender', 'color', 'email' ] },
    'group':     { parent: 'groups',    attrs: [ 'id', 'name', 'classid', 'entireclass', 'divisiontag' ]              },
    'lesson':    { parent: 'lessons',   attrs: [ 'id', 'classids', 'subjectid', 'teacherids', 'groupids' ]            },
    'card':      { parent: 'cards',     attrs: [ 'lessonid', 'period', 'weeks', 'terms', 'days' ]                     },
}

// Provjeri je li element tablice ispravan
const checkTimetableElement = (elementObject, parentName) => {
    // Je li to jedan od poznatih elemenata
    if (!requiredAttributes[elementObject.name])
        throw new errors.importError(`Found unexpected element ${elementObject.name} in the timetable`);
    // Provjeri je li roditelj odgovarajući
    if (requiredAttributes[elementObject.name].parent !== parentName)
        throw new errors.importError(`Element ${elementObject.name} should't be a child of ${parentName} element`);
    
    // Ima li sve potrebne atribute
    for (const propName of requiredAttributes[elementObject.name].attrs) {
        if (!elementObject.attributes.hasOwnProperty(propName))
            throw new errors.importError(`One of ${elementObject.name} elements does not have required attribute ${propName}`);
    }
}

// Napravi konverziju asc timetables XML baze podataka u JS objekt
// prikladan za upis u bazu raspored bota
const ascTimetableToJS = (xml) => {
    // Brojač ID-jeva, svaki ID unutar objekta je jedinstven
    let idCounter = 1;

    // Koristi se za konverziju lista sa periodima, danima, predmetima i sl u mape
    const extractStaticList = (timetable, listName, listKey) => {
        const listMap = new Map();
        const elementList = timetable.elements.find(element => element.name === listName).elements;

        if (!elementList)
            throw new errors.importError(`Failed to find ${listName} element inside timetable`);

        // Za svaki objekt u listi
        for (const element of elementList) {
            // Provjeri je li element ispravan
            checkTimetableElement(element, listName);

            // Daj mu interni ID
            element.attributes.__internalId = idCounter++;
            // Dodaj ga u mapu pod eksternim ID-jem
            listMap.set(element.attributes[listKey], element.attributes);
        }

        return listMap;
    }

    // Zamijeni ključeve u mapi sa svojstvom iz objekta koji je vrijednost
    const replaceKeyWithProp = (mapWithObjs, propName) => {
        let i = mapWithObjs.size;

        for (const [key, value] of mapWithObjs.entries()) {
            if (i-- <= 0)
                break;

            mapWithObjs.set(value[propName], value);
            mapWithObjs.delete(key);
        }
    }

    // Parsaj XML pomoću libraryja

    let result; // JS objekt dobiven iz XML-a
    try {
        result = convert.xml2js(xml, {compact: false, spaces: 4});
    } catch {
        throw new errors.importError('Failed to parse XML input');
    }

    const tt = result.elements.find(element => element.name == 'timetable');

    // Ako timetable ne postoji u xml-u baci grešku
    if (!tt) 
        throw new errors.importError('Failed to find timetable element in xml file');

    // Izvuci podatke o rasporedu koji nisu sa ničime povezani i kreiraj
    // mapu za svaki tip podatka
    const periodMap  = extractStaticList(tt, 'periods',   'period' );
    const dayMap     = extractStaticList(tt, 'daysdefs',  'days'   );
    const weekMap    = extractStaticList(tt, 'weeksdefs', 'weeks'  );
    const termMap    = extractStaticList(tt, 'termsdefs', 'terms'  );

    const classMap   = extractStaticList(tt, 'classes',   'id'     );
    const subjectMap = extractStaticList(tt, 'subjects',  'id'     );
    const teacherMap = extractStaticList(tt, 'teachers',  'id'     );

    // Kreiraj mapu za grupe i dobavi listu group elemenata
    const groupMap = new Map();
    const groupList = tt.elements.find(element => element.name == 'groups').elements;

    if (!groupList)
        throw new errors.importError('Failed to find groups element inside timetable');

    // Dodaj svaki group element u mapu i prije toga mu daj interni
    // id i spoji ga sa internim id-jem razreda
    for (const group of groupList) {
        // Provjeri je li grupa ispravna
        checkTimetableElement(group, 'groups');

        // Pridruži mu interni ID
        group.attributes.__internalId = idCounter++;

        // Dobavi razred čija je ovo grupa
        const parentClass = classMap.get(group.attributes.classid)

        // Ukoliko dani razred ne postoji baci grešku
        if (!parentClass)
            throw new errors.importError('Failed to find matching class for a group');

        group.attributes.__internalClassId = parentClass.__internalId;

        group.attributes.__internalEveryoneGroup = (group.attributes.entireclass == '1');
        group.attributes.__internalDivisionId = parseInt(group.attributes.divisiontag);

        // Ako divisiontag nije int baci grešku
        if (isNaN(group.attributes.__internalDivisionId))
            throw new errors.importError('divisiontag property can only be integer');

        groupMap.set(group.attributes.id, group.attributes);
    }

    // Kreiraj mapu za lekcije i dobavi listu lesson elemenata
    const lessonMap = new Map();
    const lessonList = tt.elements.find(element => element.name == 'lessons').elements;
    // Ako lista lekcija ne postoji
    if (!lessonList)
        throw new errors.importError('Failed to find lessons element inside timetable');

    // Kreiraj mapu za kartice i dobavi listu card elemenata
    const cardMap = new Map();
    const cardList = tt.elements.find(element => element.name == 'cards').elements;
    if (!cardList)
        throw new errors.importError('Failed to find cards element inside timetable');

    // Privremena mapa u koju se pohranjuju lekcije prilikom procesuiranja
    const lessonTempMap = new Map();

    // Popuni mapu sa lessonima
    for (const lesson of lessonList) {
        // Provjeri je li lesson ispravan
        checkTimetableElement(lesson, 'lessons');
        // Atributi lessona
        const attrib = lesson.attributes;

        // Interni id za lesson
        attrib.__internalId = idCounter++;
        // Ovo je lesson za koji predmet
        const lessonSubject = subjectMap.get(attrib.subjectid);
        if (!lessonSubject)
            throw new errors.importError('Failed to find matching subject for lesson');
        attrib.__internalSubjectId = lessonSubject.__internalId;

        // Za koje razrede je ovaj lesson
        attrib.__internalClassIds = attrib.classids.split(',').map(classid => {
            const lessonClass = classMap.get(classid)
            // Ako teacher ne postoji
            if (!lessonClass)
                throw new errors.importError('Failed to find matching class for lesson');
            // Inače vrati interni ID
            return lessonClass.__internalId;
        });
        // Koji profesori predaju lesson
        attrib.__internalTeacherIds = attrib.teacherids.split(',').map(teacherid => {
            const lessonTeacher = teacherMap.get(teacherid)
            // Ako teacher ne postoji
            if (!lessonTeacher)
                throw new errors.importError('Failed to find matching teacher for lesson');
            // Inače vrati interni ID
            return lessonTeacher.__internalId;
        });
        // Za koje grupe unutar razreda je ovaj lesson
        attrib.__internalGroupIds = attrib.groupids.split(',').map(groupid => {
            const lessonGroup = groupMap.get(groupid)
            // Ako teacher ne postoji
            if (!lessonGroup)
                throw new errors.importError('Failed to find matching teacher for lesson');
            // Inače vrati interni ID
            return lessonGroup.__internalId;
        });
        // Objekt koji je jedinstven za sve lessone koji su
        // isti kao ovaj ali se održavaju drugi dan/tjedan
        const lessonIdentifier = {
            teacherids: attrib.teacherids,
            classids:   attrib.classids,
            subjectid:  attrib.subjectid,
            groupids:   attrib.groupids,
        };

        // Ako ovaj tip lessona nije dodan u mapu dodaj ga
        if (!lessonMap.has(JSON.stringify(lessonIdentifier))) {
            lessonMap.set(JSON.stringify(lessonIdentifier), attrib);

            // Mapiraj lessonid na interni ID
            lessonTempMap.set(attrib.id, attrib.__internalId);

        } else {
            // Ako ovakav lesson već postoji mapiraj na interni ID tog lessona
            lessonTempMap.set(attrib.id, lessonMap.get(JSON.stringify(lessonIdentifier)).__internalId);
        }
    }

    // Popuni mapu sa cardovima
    for (const card of cardList) {
        // Provjeri je li card ispravan
        checkTimetableElement(card, 'cards');
        // Atributi card-a
        const attrib = card.attributes;
        
        // Dobavi mapirani interni ID za lesson
        attrib.__internalLessonId = lessonTempMap.get(attrib.lessonid);
        // Ako lesson nije nađen javi grešku
        if (!attrib.__internalLessonId)
            throw new errors.importError('Failed to find matching lesson for card');

        // Pridruži kartici interni ID
        attrib.__internalId = idCounter++;

        // Pronađi interne ID-e za ostala svojstva kartice

        // Period
        const cardPeriod = periodMap.get(attrib.period);
        if (!cardPeriod)
            throw new errors.importError('Failed to find matching period for card');
        attrib.__internalPeriodId = cardPeriod.__internalId;
        // Dan
        const cardDay = dayMap.get(attrib.days);
        if (!cardDay)
            throw new errors.importError('Failed to find matching day for card');
        attrib.__internalDayId = cardDay.__internalId;
        // Tjedan
        const cardWeek = weekMap.get(attrib.weeks);
        if (!cardWeek)
            throw new errors.importError('Failed to find matching week for card');
        attrib.__internalWeekId = cardWeek.__internalId;
        // Term
        const cardTerm = termMap.get(attrib.terms);
        if (!cardTerm)
            throw new errors.importError('Failed to find matching term for card');
        attrib.__internalTermId = cardTerm.__internalId;

        // Dodaj karticu u mapu
        cardMap.set(attrib.__internalId, attrib);
    }

    // U nekim mapama prilikom konverzije za ključeve su korišteni
    // valjski id-jevi ili neke druge vrijednosti, zamjeni te vrijednosti
    // sa internim id-jevima
    replaceKeyWithProp(periodMap,  '__internalId');
    replaceKeyWithProp(dayMap,     '__internalId');
    replaceKeyWithProp(weekMap,    '__internalId');
    replaceKeyWithProp(termMap,    '__internalId');
    replaceKeyWithProp(classMap,   '__internalId');
    replaceKeyWithProp(subjectMap, '__internalId');
    replaceKeyWithProp(teacherMap, '__internalId');
    replaceKeyWithProp(groupMap,   '__internalId');
    replaceKeyWithProp(lessonMap,  '__internalId');

    // Rezultat konverzije XML-a u JS objekt (mape)
    const coversionResult = {
        periods:   periodMap,
        days:      dayMap,
        weeks:     weekMap,
        terms:     termMap,
        classes:   classMap,
        subjects:  subjectMap,
        teachers:  teacherMap,
        groups:    groupMap,
        lessons:   lessonMap,
        cards:     cardMap,
    };

    // Vrati
    return coversionResult;
}

const printConversion = () => {
    const myxml = fs.readFileSync('./xml_export_G419.xml');
    const mapJS = ascTimetableToJS(myxml);

    const res = {};

    for (const [key, val] of Object.entries(mapJS)) {
        res[key + 'title'] = '-------------------------------' + key + '-------------------------------';
        res[key] = [...val.entries()];
    }

    console.log(JSON.stringify(res));
}

//printConversion();

// Exportaj funkciju za konverziju
module.exports = ascTimetableToJS;