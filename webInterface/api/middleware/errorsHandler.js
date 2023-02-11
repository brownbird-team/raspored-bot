const notifier = require('./../../../globalErrorNotifier.js');

exports.handle = async (error, req, res, next) => {
    
    const statusCode = (error.httpErrorCode) ? error.httpErrorCode : 500;

    res.status(statusCode).json({
        status: 'error',
        fatal: (error.nonFatal) ? false : true, 
        name: error.name,
        code: statusCode,
        description: error.message,
    });

    // Ako se radi o fatalnoj grešci dojavi je administratoru
    notifier.handle(error);
}