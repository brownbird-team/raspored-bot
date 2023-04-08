/*
    Ovaj file sadržava boje koje se mjenjaju kroz različite teme
    i omogućuje kreiranje novih tema
*/

// Array sa svim kreiranim temama
let AllThemes = [] 



//----------------------------------------------------------//
//                    Themplate Za kreiranje tema           //
//----------------------------------------------------------//

/*
AllThemes.push({
    themeName:                      "ThemplateName",   // Ime teme
    bodyBackgroundColor:            "",   // Boja pozadine Bodya      
    buttonTextColor:                "",   // Boja teksta         
    buttonBackgroundColor:          "",   // Boja pozadine tipke(poveznice)   
    footerTextColor:                "",   // Boja teksta u footeru         
    paragraphTextColor:             "",   // Boja teksta u paragrahu  
    linkTextColor:                  "",   // Boja teksta u poveznici [Nije ista kao u buttonBackgroundColor]
    tableHeadingTextColor:          "",   // Boja teksta u naslovu tablice s izmejna            [Za sad se koristi kasnije možda neće]
    tableHeadingBackgroundColor:    "",   // Boja pozadine u naslovu tablice s izmjenama        [Za sad se koristi kasnije možda neće]
    rowBackgroundColor:             "",   // Boja pozadine redaka tablice                       [Za sad se koristi kasnije možda neće]
    rowBorderColor:                 "",   // Boja bordera svakog polja u tablici s izmjenama    [Za sad se koristi kasnije možda neće]
    notEmptyTextColor:              "",   // Boja teksta u poljima koja imaju izmjenu           [Za sad se koristi kasnije možda neće]
    notEmptyBackgroundColor:        "",   // Boja polja koja imaju izmjenu                      [Za sad se koristi kasnije možda neće]
});
*/


//----------------------------------------------------------//
//                         Light Tema                       //
//----------------------------------------------------------//

AllThemes.push({
    themeName:                      "Light",   // Ime teme
    bodyBackgroundColor:            "#FFFFFF",   // Boja pozadine Bodya      
    buttonTextColor:                "#494747",   // Boja teksta         
    buttonBackgroundColor:          "#ffdf2b",   // Boja pozadine tipke(poveznice)   
    footerTextColor:                "#595959",   // Boja teksta u footeru         
    paragraphTextColor:             "#494747",   // Boja teksta u paragrahu  
    linkTextColor:                  "#494747",   // Boja teksta u poveznici [Nije ista kao u buttonBackgroundColor]
    tableHeadingTextColor:          "#494747",   // Boja teksta u naslovu tablice s izmejna            [Za sad se koristi kasnije možda neće]
    tableHeadingBackgroundColor:    "#ffdf2b",   // Boja pozadine u naslovu tablice s izmjenama        [Za sad se koristi kasnije možda neće]
    rowBackgroundColor:             "#EEEEEE",   // Boja pozadine redaka tablice                       [Za sad se koristi kasnije možda neće]
    rowBorderColor:                 "C3C3C3",   // Boja bordera svakog polja u tablici s izmjenama    [Za sad se koristi kasnije možda neće]
    notEmptyTextColor:              "494747",   // Boja teksta u poljima koja imaju izmjenu           [Za sad se koristi kasnije možda neće]
    notEmptyBackgroundColor:        "#ffdf2b",   // Boja polja koja imaju izmjenu                      [Za sad se koristi kasnije možda neće]
});


//----------------------------------------------------------//
//                         Dark Tema                        //
//----------------------------------------------------------//

AllThemes.push({
    themeName:                      "Dark",   // Ime teme
    bodyBackgroundColor:            "#202225",   // Boja pozadine Bodya      
    buttonTextColor:                "#36393F",   // Boja teksta         
    buttonBackgroundColor:          "#ffdf2b",   // Boja pozadine tipke(poveznice)   
    footerTextColor:                "#ddd",   // Boja teksta u footeru         
    paragraphTextColor:             "#FFFFFF",   // Boja teksta u paragrahu  
    linkTextColor:                  "#ffdf2b",   // Boja teksta u poveznici [Nije ista kao u buttonBackgroundColor]
    tableHeadingTextColor:          "#36393F",   // Boja teksta u naslovu tablice s izmejna            [Za sad se koristi kasnije možda neće]
    tableHeadingBackgroundColor:    "#ffdf2b",   // Boja pozadine u naslovu tablice s izmjenama        [Za sad se koristi kasnije možda neće]
    rowBackgroundColor:             "#36393F",   // Boja pozadine redaka tablice                       [Za sad se koristi kasnije možda neće]
    rowBorderColor:                 "#1f2022",   // Boja bordera svakog polja u tablici s izmjenama    [Za sad se koristi kasnije možda neće]
    notEmptyTextColor:              "#36393F",   // Boja teksta u poljima koja imaju izmjenu           [Za sad se koristi kasnije možda neće]
    notEmptyBackgroundColor:        "#ffdf2b",   // Boja polja koja imaju izmjenu                      [Za sad se koristi kasnije možda neće]
});

//----------------------------------------------------------//
//                    POTREBNO NAPRAVITI                    //
//----------------------------------------------------------//



/* Filovi iz kojih je potrebno dodati stilove

    templateGoodBye.js      |    GOTOV    |
    templateIzmjene.js      |    GOTOV    |
    templateLogin.js        |    GOTOV    |
    templateRegistration.js |    GOTOV    |
    templateWelcome.js      |    GOTOV    |
*/


/* Teme koje je potrebno kreirati

    LIGHT      |    GOTOV    |
    DARK       |    GOTOV    |

*/

/* Filovi u koje je potebno dodati nove stilove
    
    templateGoodBye.js      | NIJE GOTOV  |
    templateIzmjene.js      | NIJE GOTOV  |
    templateLogin.js        | NIJE GOTOV  |
    templateRegistration.js | NIJE GOTOV  |
    templateWelcome.js      | NIJE GOTOV  |
*/


// Pretraživanje tražene teme
console.log(AllThemes.find(obj => obj.themeName==='ThemplateName'))