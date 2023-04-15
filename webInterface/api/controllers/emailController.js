const deleteService = require('./../services/email/delete.js');
const getService = require('./../services/email/get.js');
const loginService = require('./../services/email/login.js');
const permanentService = require('./../services/email/permanent.js');
const registerService = require('./../services/email/register.js');
const updateService = require('./../services/email/update.js');
const logoutService = require('./../services/email/logout.js');

exports.delete = async (req, res, next) => {
    await deleteService({
        token: req.accessToken
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Account deleted successfully',
    });
}

exports.get = async (req, res, next) => {
    const userData = await getService({
        token: req.accessToken
    });

    userData.status = 'ok';
    userData.code = 200;
    userData.description = 'User data successfully fetched from database';

    res.status(200).json(userData);
}

exports.login = async (req, res, next) => {
    await loginService({
        email: req.body.email
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully sent login email'
    });
}

exports.permanent = async (req, res, next) => {
    const tokenData = await permanentService({
        tempToken: req.tempAccessToken
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Permanent token generated successfully',
        token: tokenData.token,
    });
}

exports.register = async (req, res, next) => {
    await registerService({
        email: req.body.email,
        class: req.body.class,
        all: req.body.all,
        theme: req.body.theme,
        mute: req.body.mute,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Registration email sent successfully',
    });
}

exports.update = async (req, res, next) => {
    await updateService({
        token: req.accessToken,
        class: req.body.class,
        all: req.body.all,
        theme: req.body.theme,
        mute: req.body.mute,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Account data updated successfully',
    });
}

exports.logout = async (req, res, next) => {
    await logoutService({
        token: req.accessToken
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Logout was successful, this token is no more',
    });
}

