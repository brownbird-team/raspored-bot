// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require('./convertToInlineStyles.js');
const themeFunctions = require('../themeLoader.js');
/* Email Template -- zbogom
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 * 
 *    email         -- Email korisnika kojem se šalje izmjena
 *    theme         -- Tema, može biti dark ili light
 */
module.exports = (arguments) => {

    // Dobivanje boja u zadanoj temi 
    const colors =  themeFunctions.getThemePropertiesByName(arguments.theme);

    const styles = [
        {
            selectors: [ 'body' ],
            style: `
                background-color: ${colors.bodyBackgroundColor};
                padding: 50px;
                font-size: 16px;
                font-family: Helvetica, Arial, sans-serif;
            `,
        },{
            selectors: [ 'p' ],
            style: `
                color: ${colors.paragraphTextColor};
                margin: 25px 0px;
                max-width: 1000px;
            `,
        },{
            selectors: [ 'footer' ],
            style: `
                color: ${colors.footerTextColor};
                font-size: 12px;
            `,
        }
    ];

    let result = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Registracija</title>
            </head>
            <body>
                <p>
                    Pozdrav <b>${arguments.email}</b>, <br>
                    uspješno ste obrisali svoj račun iz baze podataka Raspored Bota.
                </p>
                <p>
                    Svi Vaši podaci su uklonjeni i Raspored Bot Vam više neće slati nikakve poruke. <br>
                    Drago nam je što ste bili naš pretplatnik.
                </p>

                <footer>
                    <p class="footer-p">
                        Srdačan pozdrav, <br>
                        &copy; BrownBird Team
                    </p>
                </footer>
            </body>
        </html>
    `;

    return convertToInlineStyles(result, styles);
}