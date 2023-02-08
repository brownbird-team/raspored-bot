const classesService = require('./../services/general/classes.js');
const activeClassesService = require('./../services/general/activeClasses.js');

exports.classes = async (req, res, next) => {
    try {
        const result = await classesService();

        result.status = 'ok';
        result.code = 200;
        result.description = 'Classes successfully fetched from database';

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}

exports.activeClasses = async (req, res, next) => {
    try {
        const result = await activeClassesService();

        result.status = 'ok';
        result.code = 200;
        result.description = 'Classes successfully fetched from database';

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
}