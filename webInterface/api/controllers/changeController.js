const getService = require('../services/changes/get.js');
const createService = require('../services/changes/create.js');
const updateService = require('../services/changes/update.js');
const getContentService = require('../services/changes/getContent.js');
const setContentService = require('../services/changes/setContent.js');

exports.get = async (req, res) => {
    const results = await getService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully fetched all change tables from database',
        changes: results,
    });
}

exports.create = async (req, res) => {
    const newId = await createService({
        heading: req.body.heading,
        shift: req.body.shift,
        morning: req.body.morning,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully created new change table',
        newChangeId: newId,
    });
}

exports.update = async (req, res) => {
    const newId = await updateService({
        id: req.body.id,
        heading: req.body.heading,
        shift: req.body.shift,
        morning: req.body.morning,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully updated change with given ID if it exists',
        newChangeId: newId,
    });
}

exports.getContent = async (req, res) => {
    const results = await getContentService({
        id: req.query.id
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully fetched content of requested change',
        content: results,
    });
}

exports.setContent = async (req, res) => {
    await setContentService({
        id: req.body.id,
        classes: req.body.classes,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully inserted new content for given schedule change',
    });
}