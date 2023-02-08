const convertToInlineStyles = (html, styles) => {
    let position = 0;   // Pozicija u HTML stingu

    // Dok nismo obradili sve HTML elemente (otvarajuće tagove)
    while (true) {
        // Pronađi za koliko je znakova sljedeći open tag odvojen od sadašnje pozicije
        let newPosition = html.slice(position).search(/<[^!/][^>]*>/);
        // Ako nema više tagova izađi
        if (newPosition == -1)
            break;
        // Pomakni se na novu poziciju
        position += newPosition;
        // Izvadi open tag
        const element = html.slice(position, position + html.slice(position).indexOf('>') + 1);
        
        // Pronađi index na kojem se nalazi ime open taga
        const nameIndex = element.search(/[ >\/]/);
        // Izdvoji ime
        const elementName = element.slice(1, (nameIndex == -1) ? element.length - 1 : nameIndex);
        // Pronađi index na kojem se nalazi class atribut
        const classIndex = element.indexOf('class');
        // Izdvoji klase ako postoji
        const elementClasses = (classIndex == -1) ? "" : element.slice(classIndex).split('"')[1].split(' ');
        // Pronađi index na kojem se nalazi id atribut
        const iDindex = element.indexOf('id');
        // Izdvoji id ako postoji
        const elementId = (iDindex == -1) ? "" : element.slice(iDindex).split('"')[1];

        // Deklariraj prazan string u koji se spremaju stilovi elementa
        let elementStyles = "";
        
        // Pronađi stilove koji se odnose na ovaj element
        styles.forEach((style) => {
            // Za selektor u stilu
            for (let selector of style.selectors) {
                // Ako je selektor ID i ID se poklapa
                if (selector[0] == '#' && elementId && selector.slice(1) == elementId) {
                    elementStyles += style.style;
                    break;
                }
                // Ako je selektor klasa i ako element ima tu klasu
                else if (selector[0] == '.' && elementClasses && elementClasses.indexOf(selector.slice(1)) > -1) {
                    elementStyles += style.style;
                    break;
                }
                // Ako je selektor ime ovog elementa
                else if (selector == elementName) {
                    elementStyles += style.style;
                    break;
                }
            }
        });

        elementStyles = elementStyles.replace(/(\r\n|\n|\r|\t)/gm, '');
        elementStyles = elementStyles.replace(/ +/gm, ' ');

        if (elementStyles.length > 0) {
            // Dodaj ime atributa za inline stilove (styles="")
            elementStyles = ' style="' + elementStyles.trim() + '"';

            // Ubaci styles atribut odmah nakon imena elementa
            const insertIndex = position + ((nameIndex == -1) ? element.length - 1 : nameIndex);
            html = html.slice(0, insertIndex) + elementStyles + html.slice(insertIndex);
        }

        // Pomakni se na kraj obrađenog elementa
        position = position + element.length + elementStyles.length;
    }

    // Vrati izmjenjeni html
    return html;
}

module.exports = convertToInlineStyles;