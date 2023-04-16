const createService = require('../services/admin/create.js');
const deleteService = require('../services/admin/delete.js');
const getUserService = require('../services/admin/get.js');
const updateService = require('../services/admin/password.js');
const getUsersService = require('../services/admin/users.js');
const loginService = require('../services/admin/login.js');
const logoutService = require('../services/admin/logout.js');

exports.create = async (req, res, next) => {
    await createService({
        username: req.body.username,
        password: req.body.password,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully created new admin user',
    });
}

exports.get = async (req, res, next) => {
    const userData = await getUserService({ accessToken: req.accessToken });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully fetched user data from database',
        ...userData,
    });
}

exports.update = async (req, res, next) => {
    await updateService({
        userId: req.body.userId,
        password: req.body.password,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully updated admin user password',
    });
}

exports.delete = async (req, res, next) => {
    await deleteService({ userId: req.body.userId });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully deleted admin user',
    });
}

exports.getUsers = async (req, res, next) => {
    const users = await getUsersService();

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Successfully fetched user list from database',
        users: users,
    });
}

exports.login = async (req, res, next) => {
    const result = await loginService({
        username: req.body.username,
        password: req.body.password,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Authentification ok, generated new access token successfully',
        ...result,
    });
}

exports.logout = async (req, res, next) => {
    await logoutService({
        accessToken: req.accessToken,
    });

    res.status(200).json({
        status: 'ok',
        code: 200,
        description: 'Logout successful',
    });
}