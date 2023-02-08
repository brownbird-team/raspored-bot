// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require('./convertToInlineStyles.js');

/* Email Template -- zbogom
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 * 
 *    email         -- Email korisnika kojem se šalje izmjena
 *    theme         -- Tema, može biti dark ili light
 */

module.exports = (arguments) => {

    const colors = {};

    switch (arguments.theme) {
        // Definiraj boje za svjetlu temu
        case "light":
            // Boja pozadine dokumenta i zadana boja teksta
            colors.bodyColor = "#494747";
            colors.bodyBackground = "#FFFFFF";
            // Boja teksta u footer-u
            colors.footerColor = "#595959";
            break;

        // Definiraj boje za tamnu temu
        case "dark":
            // Boja pozadine dokumenta i zadana boja teksta
            colors.bodyColor = "#FFFFFF";
            colors.bodyBackground = "#202225";
            // Boja teksta u footer-u
            colors.footerColor = "#ddd";
            break;
    }

    const styles = [
        {
            selectors: [ 'body' ],
            style: `
                color: ${colors.bodyColor};
                background-color: ${colors.bodyBackground};
                padding: 50px;
                font-size: 16px;
                font-family: Helvetica, Arial, sans-serif;
            `,
        },{
            selectors: [ 'p' ],
            style: `
                color: inherit;
                margin: 25px 0px;
                max-width: 1000px;
            `,
        },{
            selectors: [ 'footer' ],
            style: `
                color: ${colors.footerColor};
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