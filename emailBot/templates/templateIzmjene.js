// Uključi funkciju koja pretvara objekt stilova u inline stilove
const convertToInlineStyles = require("./convertToInlineStyles.js");
const themeFunctions = require("../themeLoader.js");
/* Email Template -- izmjene u rasporedu
 *
 * Kao argument funkciji potrebno je dati objekt sa sljedećim svojstvima:
 *
 *    email          -- Email korisnika kojem se šalje izmjena
 *    theme          -- Tema, može biti dark ili light
 *    tableHeading   -- Neki string koji će biti ispisan kao naslov izmjene
 *    periodName          -- smjena
 *    accountType    -- Sip raluna Student ili Professor
 *    target         -- Ime profesora ili razreda
 *    pariod[{       -- Array
 *    name           -- Ime perioda(sata)
 *    lessonValue    -- Izmjena sata
 *    classroomValue -- Izmjena učionice
 * }]
 *    dashboardUrl  -- Link na kontrolnu ploču za izmjenu postavki
 */
module.exports = (arguments) => {
  const colors = themeFunctions.getThemePropertiesByName(arguments.theme);

  const styles = [
    {
      selectors: ["body"],
      style: `
                background-color: ${colors.bodyBackgroundColor};
                padding:2rem;
                font-family: Helvetica, Arial, sans-serif;
            `,
    },{
        selectors: [".tableHeading"],
        style: `
                margin: 0 auto;
                text-align: center;
                width: 250px;
                box-sizing: border-box;

        `,
      },{
        selectors: [".periodName"],
        style: `
                margin: auto;
                text-align: left;
                width: 250px;
                box-sizing: border-box;

                `,
      },{
        selectors: [".target"],
        style: `
                margin: auto;
                text-align: left;
                width: 250px;
                box-sizing: border-box;

        `,
      },{
        selectors: ["table"],
        style: `
                margin: auto;
                height:20vh;
               
                width: 250px;
        `,
      },{
        selectors: [".footer"],
        style: `
                margin: auto;
                text-align:center;
                width:350px;
        `,
      },{
        selectors: ["b"],
        style: `
                color:${colors.paragraphTextColor};
        `,
      },{
        selectors: ["th"],
        style: `
                color:${colors.tableHeadingTextColor};
                background-color:${colors.tableHeadingBackgroundColor};
        `,
      },{
        selectors: [".name"],
        style: `
                color:${colors.tableHeadingTextColor};
                background-color:${colors.tableHeadingBackgroundColor};
                width:15%;
        `,
      },{
        selectors: [".lessonValue"],
        style: `
                color:${colors.tableHeadingTextColor};
                background-color:${colors.tableHeadingBackgroundColor};
                width:70%;
        `,
      },{
        selectors: [".classroomValue"],
        style: `
                color:${colors.tableHeadingTextColor};
                background-color:${colors.tableHeadingBackgroundColor};
                width:15%;
        `,
      },{
        selectors: ["td","th"],
        style: `
            text-align: center;
            padding: 5px;
        `,
      },{
        selectors: [".fill"],
        style: `
                color:${colors.notEmptyTextColor};
                background-color:${colors.notEmptyBackgroundColor};
        `,
      },{
        selectors: [".noFill"],
        style: `
                color:${colors.paragraphTextColor};
                background-color:${colors.rowBackgroundColor};
        `,
      },{
        selectors: [".hour"],
        style: `
                color:${colors.paragraphTextColor};
                background-color:${colors.rowBackgroundColor};
        `,
      },{
        selectors: ["p"],
        style: `
                color:${colors.paragraphTextColor};
                
        `,
      },{
        selectors: [ 'a' ],
        style: `
            color: ${colors.linkTextColor};
            font-weight: bolder;
        `,
      }
  ];

  let predmet = "";
  if (arguments.accountType === "Professor") predmet = "/Razred";

  let razred_professor = "";
  (arguments.accountType === "Student") ? razred_professor = "Razred: " : razred_professor = "Profesor/ica: ";


  // Kreiranje HTML-a
  let result = `
                <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                
            </head>
            <body>
                <div class="tableHeading">
                    <b>${arguments.tableHeading}</b>
                </div>
                <br/>
                <div class="periodName">
                    <b>${arguments.periodName}</b>
                </div>
                
                <div class="target">
                    <b>${razred_professor}${arguments.target}</b>
                </div>
             
                <table>
                    <tr>
                        
                        <th class="name">Sat</th>
                        
                        <th class="lessonValue">Predmet${predmet}</th>
                        <th class="classroomValue">Učionica</th>
                        
                    </tr>
            
    `;
    



  console.log(arguments);
  arguments.period.forEach((period) => {


    let cLessonValue=period.lessonValue ==="" ? "noFill" : "fill";
    
    let cClassroomValue=period.classroomValue ==="" ? "noFill" : "fill";

    let cName =  (cLessonValue === "fill" || cClassroomValue==="fill") ? "fill" : "hour" 
    

    result += `                </strong>
                <tr>
                    
                    
                    
                    <td class="${cName}"><strong>${period.name}</strong></td>    
                    <td class="${cLessonValue}"><strong>${period.lessonValue}</strong></td>
                    <td class="${cClassroomValue}"><strong>${period.classroomValue}</strong></td>
                </tr>
    `;
  });

  result += `
  </table>
        <div class="footer">
            <p class="footer-p">E-mail poruka poslana je ${arguments.email}. Ako ne želite primati e-mail poruke od Raspored
                bota
                u budučnosti, možete promijeniti postavke Vašeg profila ili prekinuti pretplatu na svojoj
                <b><a href="${arguments.dashboardUrl}" target="_blank">kontrolnoj ploči</a></b>.
            </p>
            <p class="footer-p">
                Srdačan pozdrav, <br>
                &copy; BrownBird Team
            </p>
        </div>
    </body>
</html>
    `;

  return convertToInlineStyles(result, styles);
};
