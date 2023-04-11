
// -------------------------- Database errors -------------------------- //

// Došlo je greške pri komunikaciji za bazom podataka
class DatabaseError extends Error {
    constructor(message, mysqlErrorObject) {
        super(message);
        this.name = 'DatabaseError';
        this.httpErrorCode = 500;
        this.nonFatal = false;

        if (mysqlErrorObject) {
            this.code = mysqlErrorObject.code;
            this.originalMessage = mysqlErrorObject.message;
            this.errno = mysqlErrorObject.errno;
            this.fatal = mysqlErrorObject.fatal;
            this.sql = mysqlErrorObject.sql;
            this.sqlState = mysqlErrorObject.sqlState;
            this.sqlMessage = mysqlErrorObject.sqlMessage;
        }
    }
}
exports.DatabaseError = DatabaseError;

// ----------------------- Email sending errors ------------------------ //

// Nemoguće poslati email
class EmailError extends Error {
    constructor(message, emailErrorObject) {
        super(message);
        this.name = 'EmailError';
        this.httpErrorCode = 424;
        this.nonFatal = false;

        if (emailErrorObject) {
            // Ako je error code EENVELOPE znači da nije uspio postali email na adresu
            // što nije fatalna greška jer je moguće da je korisnik jednostavno upisao krivu
            // adresu
            if (emailErrorObject.code === 'EENVELOPE')
                this.nonFatal = true;

            this.code = emailErrorObject.code;
            this.emailName = emailErrorObject.name;
            this.originalMessage = emailErrorObject.message;
            this.errno = emailErrorObject.errno;
            this.data = emailErrorObject.data;
            this.syscall = emailErrorObject.syscall;
        }
    }
}
exports.EmailError = EmailError;


// --------------------------- Web UI errors --------------------------- //

// Neki od danih parametara nije ispravan
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError'
        this.httpErrorCode = 400;
        this.nonFatal = true;
    }
}
exports.ValidationError = ValidationError

// Došlo je do pogreške na strani servera
class InternalServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InternalServerError';
        this.httpErrorCode = 500;
        this.nonFatal = true;
    }
}
exports.InternalServerError = InternalServerError;

// Autorizacija nije uspjela, pristup odbijen
class AuthorizationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthorizationError';
        this.httpErrorCode = 401;
        this.nonFatal = true;
    }
}
exports.AuthorizationError = AuthorizationError;

// Traženi podatak nije pronađen
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
        this.httpErrorCode = 404;
        this.nonFatal = true;
    }
}
exports.NotFoundError = NotFoundError;

// Došlo je do greške pri registraciji, account već postoji
class RegistrationError extends AuthorizationError {
    constructor(message) {
        super(message);
        this.name = 'RegistrationError';
        this.httpErrorCode = 400;
    }
}
exports.RegistrationError = RegistrationError;

// Previše pokušaja prijave pričekajte isticanje zadnjeg kreiranog tokena
class TooManyAttemptsError extends AuthorizationError {
    constructor(message) {
        super(message);
        this.name = 'TooManyAttemptsError';
        this.httpErrorCode = 429;
    }
}
exports.TooManyAttemptsError = TooManyAttemptsError;


// --------------------------- Discord errors -------------------------- //

class DiscordError extends Error {
    constructor(message, err) {
        super(message);
        this.name = 'DiscordError';
        this.nonFatal = false;

        if (err) {
            this.originalName = err.name;
            this.originalMessage = err.message;

            for (const property of Object.keys(err))
                this[`original${property.charAt(0).toUpperCase() + property.slice(1)}`] = err[property];
        }
    }
}
exports.DiscordError = DiscordError;


// --------------------------- Scraper errors -------------------------- //

class ScraperError extends Error {
    constructor(message, err) {
        super(message);
        this.name = 'ScraperError';
        this.nonFatal = false;

        if (err) {
            this.originalName = err.name;
            this.originalMessage = err.message;

            for (const property of Object.keys(err))
                this[`original${property.charAt(0).toUpperCase() + property.slice(1)}`] = err[property];
        }
    }
}
exports.ScraperError = ScraperError;


// -------------------------- XML import error ------------------------- //

class importError extends Error {
    constructor(message) {
        super(message);
        this.name = 'importError';
        this.httpErrorCode = 400;
        this.nonFatal = true;
    }
}
exports.importError = importError;