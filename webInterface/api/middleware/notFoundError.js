const errors = require('../../../errors.js');

// Ako tražena ruta do sada nie pronađena vrati grešku 404
exports.notFound = (req, res, next) => {
    next(new errors.NotFoundError('Requested route does not exist'));
}