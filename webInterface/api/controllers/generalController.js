const allClassesService = require('../services/classes/all.js');
const activeClassesService = require('../services/classes/active.js');
const deleteClassService = require('../services/classes/delete.js');
const insertClassService = require('../services/classes/insert.js');
const allShiftsService = require('../services/classes/shifts.js');
const shiftClassesService = require('../services/classes/shift.js');
const inviteLinkService = require('./../services/general/inviteLink.js');

exports.classes = async (req, res, next) => {
    const result = await allClassesService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Classes successfully fetched from database',
        classes: result
    });
}

exports.activeClasses = async (req, res, next) => {
    const result = await activeClassesService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Classes successfully fetched from database',
        classes: result
    });
}

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

exports.allShifts = async (req, res, next) => {
    const shifts = await allShiftsService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Shifts successfully fetched from database',
        shifts: shifts,
    });
}

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

exports.inviteLink = async (req, res, next) => {
    const result = await inviteLinkService();

    result.status = 'ok';
    result.code = 200;
    result.description = 'Discord bot invite link successfully fetched from database';

    res.status(200).json(result);
}