// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require('./convertToInlineStyles.js');
const themeFunctions = require('../themeLoader.js');
// Status: Gotov


/* Email Template -- registracija
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 * 
 *    email         -- Email korisnika kojem se šalje izmjena
 *    theme         -- Tema, može biti dark ili light
 *    expires       -- String koji prikazuje datum i vrijeme kada link ističe
 *    tokenUrl      -- Link na koji je potrebno otiči kako bi se registracija izvršila
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
        },{
            selectors: [ '.button-link' ],
            style: `
                display: inline-block;
                text-decoration: none;
                color: ${colors.buttonTextColor};
                background-color: ${colors.buttonBackgroundColor};
                padding: 15px 25px;
                margin: 25px 0px;
                border-radius: 2px;     
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
                    hvala Vam što ste se odlučili pretplatiti na Raspored Bota.
                    Dat ćemo sve od sebe kako bi Vam primanje izmjena u rasporedu učinili što lakšim i bezbolnijim.
                </p>
                <p>
                    Kako bi potvrdili da ste Vi zatražili krairanje računa molimo kliknite na tipku (poveznicu) ispod.
                    Poveznica će Vas odmah odvesti i prijaviti na kontrolnu ploču Raspored Bota, gdje možete podesiti postavke 
                    vašeg računa. Ako Vi niste zatražili kreiranje
                    računa slobodno ignorirajte ovaj email.
                </p>
                <p>
                    Potvrda vrijedi ograničeno vrijeme nakon čega ćete morati generirati novu, vaša vrijedi do: <br>
                    <b>${arguments.expires}</b>
                </p>
                <a class="button-link" target="_blank" href="${arguments.tokenUrl}"><b>Potvrdi email</b></a>

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