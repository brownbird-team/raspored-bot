// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require('./convertToInlineStyles.js');

/* Email Template -- izmjene u rasporedu
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 * 
 *    email         -- Email korisnika kojem se šalje izmjena
 *    theme         -- Tema, može biti dark ili light
 *    shift         -- Smjena prijepodne ili posljepodne
 *    tableHeading  -- Neki string koji će biti ispisan kao naslov izmjene
 *    class         -- String koji predstavlja ime razreda (npr 3.G)
 *    sat1          -- 1. sat ujutro ili -1. sat popodne
 *    sat2          -- 2. sat ujutro ili  0. sat popodne
 *    sat3          -- 3. sat ujutro ili  1. sat popodne
 *    sat4          -- 4. sat ujutro ili  2. sat popodne
 *    sat5          -- 5. sat ujutro ili  3. sat popodne
 *    sat6          -- 6. sat ujutro ili  4. sat popodne
 *    sat7          -- 7. sat ujutro ili  5. sat popodne
 *    sat8          -- 8. sat ujutro ili  6. sat popodne
 *    sat9          -- 9. sat ujutro ili  7. sat popodne
 *    dashboardUrl  -- Link na kontrolnu ploču za izmjenu postavki
 */

module.exports = (arguments) => {
    
    const colors = {};

    switch (arguments.theme) {
        // Definiraj boje za svjetlu temu
        case "light":
            // Boja poveznica
            colors.linkColor = "#494747" //+
            // Boja pozadine dokumenta i zadana boja teksta
            colors.bodyColor = "#494747"; //+
            colors.bodyBackground = "#FFFFFF"; //+
            // Boja pozadine i teksta u zaglavlju tablice
            colors.tableHeadingColor = "#494747";
            colors.tableHeadingBackground = "#ffdf2b";
            // Boja pozadine redaka tablice
            colors.rowBackground = "#EEEEEE";
            // Boja granice elementa
            colors.rowBorder = "#C3C3C3";
            // Boja pozadine i teksta retka tablice u kojem je izmjena
            colors.notEmptyColor = "#494747";
            colors.notEmptyBackground = "#ffdf2b";
            // Boja teksta u footer-u
            colors.footerColor = "#595959"; //+
            break;

        // Definiraj boje za tamnu temu
        case "dark":
            // Boja poveznica
            colors.linkColor = "#ffdf2b"
            // Boja pozadine dokumenta i zadana boja teksta
            colors.bodyColor = "#FFFFFF";
            colors.bodyBackground = "#202225";
            // Boja pozadine i teksta u zaglavlju tablice
            colors.tableHeadingColor = "#36393F";
            colors.tableHeadingBackground = "#ffdf2b";
            // Boja pozadine redaka tablice
            colors.rowBackground = "#36393F";
            // Boja granice elementa
            colors.rowBorder = "#1f2022";
            // Boja pozadine i teksta retka tablice u kojem je izmjena
            colors.notEmptyColor = "#36393F";
            colors.notEmptyBackground = "#ffdf2b";
            // Boja teksta u footer-u
            colors.footerColor = "#ddd";
            break;
    }

    const styles = [
        {
            selectors: [ '.naslov' ],
            style: `
                color: ${colors.bodyColor};
                font-weight: bold;
                font-size: 16px;
                padding-bottom: 10px;
                text-align: center;
                
            `,
        },{
            selectors: [ 'body' ],
            style: `
                color: ${colors.bodyColor};
                background-color: ${colors.bodyBackground};
                padding: 50px;
                font-family: Helvetica, Arial, sans-serif;
                font-weight: 400;
            `,
        },{
            selectors: [ 'a' ],
            style: `
                color: ${colors.linkColor};
                font-weight: bolder;
            `,
        },{
            selectors: [ 'table' ],
            style: `
                width: 250px;
                margin: auto;
                border: none;
                border-collapse: collapse;    
            `,
        },{
            selectors: [ 'td', 'th' ],
            style: `
                color: inherit;
                text-align: center;
                padding: 5px;
            `,
        },{
            selectors: [ 'tr' ],
            style: `
                background-color: ${colors.rowBackground};
                border-bottom: thin solid ${colors.rowBorder};
            `,
        },{
            selectors: [ '.table-heading' ],
            style: `
                color: ${colors.tableHeadingColor};
                background-color: ${colors.tableHeadingBackground};
                border: none;
                font-weight: bold;    
            `,
        },{
            selectors: [ '.not-empty' ],
            style: `
                color: ${colors.notEmptyColor};
                background-color: ${colors.notEmptyBackground};
                font-weight: bold;    
            `,
        },{
            selectors: [ 'footer' ],
            style: `
                font-size: 12px;
                text-align: center;
                margin: 30px auto 0px auto;
                width: 350px;
            `,
        },{
            selectors: [ '.footer-p' ],
            style: `
            color: ${colors.footerColor};
                margin-bottom: 25px;
            `,
        },
    ];
    
    // Kreiranje HTML-a
    let result = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                <title>Izmjene u rasporedu sati za ${arguments.class}</title>
            </head>
            <body>
                <table>
                    <div class="naslov">
                        <b>${arguments.tableHeading}<br>${(arguments.shift == 'prijepodne') ? 'PRIJEPODNE' : 'POSLIJEPODNE'}</b>
                    </div>
                    <tr class="table-heading">
                        <th>Sat</th>
                        <th>Izmjena</th>
                    </tr>
    `;
    
    // Dodaj jedan row u tablicu za svaki sat
    for (let i = 1; i <= 9; i++) {
        result += `
                    <tr ${(arguments[`sat${i}`] == ``) ? `` : `class="not-empty"` }>
                        <td>${(arguments.shift == 'prijepodne') ? i : i - 2 }.</td>
                        <td>${arguments[`sat${i}`]}</td>
                    </tr>
        `;
    }
    
    result += `
                </table>

                <footer>
                    <p class="footer-p">
                        E-mail poruka poslana je ${arguments.email}. Ako ne želite primati e-mail poruke od Raspored bota
                        u budučnosti, možete promijeniti postavke Vašeg profila ili prekinuti pretplatu na svojoj
                        <b><a href="${arguments.dashboardUrl}" target="_blank">kontrolnoj ploči</a></b>.
                    </p>
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