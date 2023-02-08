
module.exports = async (error, req, res, next) => {
    if (error.status === 404) {
        res.status(404).send(`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>Error 404</title>
                </head>
                <body>
                    <h1>Error 404 File Not Found</h1>
                    <p>
                        You are seeing this error because you are searching for static file
                        that does not exist. <b>/static</b> route is used by RasporedBot web
                        client when serving static assets like images or fonts, if you came
                        here by accident you can use link below to return to our home page.
                    </p>

                    <a href="/">Go Home</a>
                </body>
            </html>
        `);
    } else {
        res.status(error.status).send(`Error code ${error.status},<br>${error.message}`);
    }
}