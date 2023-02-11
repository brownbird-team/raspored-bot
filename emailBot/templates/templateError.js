module.exports = (err) => {

    const now = new Date();

let message = `
Dear administrator of RasporedBot,

I'm sorry to inform you that a FATAL ERROR occurred on your RasporedBot instance. Here is some information that might help you debug.

Time: ${now.toUTCString()}
Error name: ${err.name}
Error message: ${err.message}

Error stack:
${err.stack}

Error object properties:
`

for (const key of Object.keys(err)) {
    message += `- ${key}: ${err[key]}\n`;
}

message += `
Good luck with debugging !

Forever yours,
RasporedBot
`

return message;
}