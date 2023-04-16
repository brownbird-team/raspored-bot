const allClassesService = require('../services/classes/all.js');
const activeClassesService = require('../services/classes/active.js');
const deleteClassService = require('../services/classes/delete.js');
const insertClassService = require('../services/classes/insert.js');
const allShiftsService = require('../services/classes/shifts.js');
const shiftClassesService = require('../services/classes/shift.js');
const inviteLinkService = require('./../services/general/inviteLink.js');

// Dobavi sve razrede koji postoje sada ili su postojali
exports.classes = async (req, res, next) => {
    const result = await allClassesService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Classes successfully fetched from database',
        classes: result
    });
}

// Dobavi razrede koji trenutno postoje
exports.activeClasses = async (req, res, next) => {
    const result = await activeClassesService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Classes successfully fetched from database',
        classes: result
    });
}

// Obriši razred (napravi ga neaktivnim)
exports.deleteClass = async (req, res, next) => {
    await deleteClassService({
        id: req.query.id
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Class successfully deleted from database',
    });
}

// Upiši novi razred
exports.insertClass = async (req, res, next) => {
    const newId = await insertClassService({
        name: req.body.name,
        shift: req.body.shift,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Class successfully inserted into database testtest',
        insertedClassId: newId
    });
}

// Dobavi sve smjene koje su definirane u bazi
exports.allShifts = async (req, res, next) => {
    const shifts = await allShiftsService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Shifts successfully fetched from database',
        shifts: shifts,
    });
}

// Dobavi sve razrede koji se nalaze u danoj smjeni
exports.shift = async (req, res, next) => {
    const classes = await shiftClassesService({
        shift: req.query.name,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Classes successfully fetched from database',
        classes: classes,
    });
}

// Dobavi invite link discord bota koji je definiran u bazi
exports.inviteLink = async (req, res, next) => {
    const result = await inviteLinkService();

    result.status = 'ok';
    result.code = 200;
    result.description = 'Discord bot invite link successfully fetched from database';

    res.status(200).json(result);
}