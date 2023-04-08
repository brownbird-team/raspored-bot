// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require('./convertToInlineStyles.js');

// Status: Gotov


/* Email Template -- prijava
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 * 
 *    email         -- Email korisnika kojem se šalje izmjena
 *    theme         -- Tema, može biti dark ili light
 *    expires       -- String koji prikazuje datum i vrijeme kada link ističe
 *    tokenUrl      -- Link na koji je potrebno otiči kako bi se prijavili
 */

module.exports = (arguments) => {

    const colors = {};

    switch (arguments.theme) {
        // Definiraj boje za svjetlu temu
        case "light":
            // Boja pozadine dokumenta i zadana boja teksta
            colors.bodyColor = "#494747";
            colors.bodyBackground = "#FFFFFF";
            // Boja tipke (poveznice)
            colors.buttonColor = "#494747";
            colors.buttonBackground = "#ffdf2b";
            // Boja teksta u footer-u
            colors.footerColor = "#595959";
            //boja teksta u paragrafu
            colors.text= "#000000";
            break;

        // Definiraj boje za tamnu temu
        case "dark":
            // Boja pozadine dokumenta i zadana boja teksta
            colors.bodyColor = "#FFFFFF";
            colors.bodyBackground = "#202225";
            // Boja tipke (poveznice)
            colors.buttonColor = "#36393F";
            colors.buttonBackground = "#ffdf2b";
            // Boja teksta u footer-u
            colors.footerColor = "#ddd";
            //boja teksta u paragrafu
            colors.text= "#ffffff";
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
            color: ${colors.text};
                margin: 25px 0px;
                max-width: 1000px;
            `,
        },{
            selectors: [ 'footer' ],
            style: `
                color: ${colors.footerColor};
                font-size: 12px;
            `,
        },{
            selectors: [ '.button-link' ],
            style: `
                display: inline-block;
                text-decoration: none;
                color: ${colors.buttonColor};
                background-color: ${colors.buttonBackground};
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
                    zatražili ste poveznicu za prijavu na kontrolnu ploču Raspored Bota.
                </p>
                <p>
                    Putem dolje navedene poveznice možete se prijaviti samo jednom, sljedeći puta kada ćete
                    se opet željeti prijaviti morat ćete zatražiti novu, na web sučelju Raspored Bota. Ako
                    Vi niste zatražili poveznicu slobodno ignorirajte ovaj email.
                </p>
                <p>
                    Poveznica vrijedi ograničeno vrijeme nakon čega ćete morati generirati novu, vaša vrijedi do: <br>
                    <b>${arguments.expires}</b>
                </p>
                <a class="button-link" target="_blank" href="${arguments.tokenUrl}"><b>Nastavi prijavu</b></a>

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