// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require('./convertToInlineStyles.js');
const themeFunctions = require('../themeLoader.js');
// Status: Gotov


/* Email Template -- dobrodošlica
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 * 
 *    email         -- Email korisnika kojem se šalje izmjena
 *    theme         -- Tema, može biti dark ili light
 *    supportMail   -- Email preko kojeg korisnik može primiti podršku
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
                    uspješno ste potvrdili svoju pretplatu na Raspored Bota.
                </p>
                <p>
                    U bilo kojem trenutku možete poništiti svoju pretplatu
                    putem kontrolne ploče i time obrisati sve podatke o Vama iz naše baze podataka.
                </p>
                <p>
                    Za sva dodatna pitanja ili prijave greške možete nas kontaktirati na naš email <b>${arguments.supportMail}</b>.
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