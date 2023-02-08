const baza = require('./databaseQueriesEmail.js');
const izmjene = require('./../databaseQueries.js');
const { asyncFilter, emailLog } = require('./helperFunctionsEmail.js');
const email = require('./sendEmail.js');
const izmjeneTemplate = require('./templates/templateIzmjene.js');
const errors = require('./../errors.js');

exports.check = async () => {
    // Maksimalan broj izmjena dopušten poslati u nizu
    let maxEmailSend = await baza.getOption('maxEmailSend');
    // Pretvori ga u int
    maxEmailSend = Number.parseInt(maxEmailSend);
    if (isNaN(maxEmailSend))
        throw new errors.DatabaseError('Failed to parse settings from database to int');
    
    // Url na kontrolnu ploču raspored bota
    let dashboardUrl;
    // Dobavi ga iz baze
    dashboardUrl = await baza.getOption('dashboardUrl');

    // Napravi listu koisnika iz baze
    const users = await baza.getUserList();

    userLoop: for (const user of users) {
        // Dobavi podatke o korisniku
        const userData = await baza.getUser({ id: user.id });

        // Ako korisnik nije verificiran, postavljen na mute ili nema postavljen razred preskoči ga
        if (!userData.verified || userData.mute || !userData.razred) continue;

        // Dohvati nove izmjene iz baze (koje su se dogodile od zadnje poslane)
        let noveIzmjene = await izmjene.dajIzmjene(userData.razred.id, userData.zadnjaPoslana);
        const zadnjaIzmjena = noveIzmjene[0];

        // Filtriraj izmjene tako da izbaciš sve nepotrebne prazne izmjene za korisnike
        // koji ne žele primati sve izmjene
        noveIzmjene = await asyncFilter(noveIzmjene, async (izmjena) => {
            // Ako izmjena nije prazna ili korisnik prima sve ostavi ju
            if (!izmjena.sve_null || userData.saljiSve)
                return true;

            // Iz baze izvuci izmjenu prije ove
            const izmjenPrijeOve = await izmjene.dajPovijest(userData.razred.id, 2, izmjena.id);

            // Ako je izmjena prije ove bila u istoj tablici i nije bila prazna, pošalji praznu
            if (izmjena.naslov === izmjenPrijeOve.izmjena.naslov && !izmjenPrijeOve.izmjena.sve_null)
                return true;

            // Inače izbaci izmjenu iz arraya
            return false;
        });

        // Okreni array izmjena tako da se prvo šalju najstarije
        const reverseIzmjene = [...noveIzmjene].reverse();

        // Pošalji sve izmjene
        for (const izmjena of reverseIzmjene) {
            // Ispuni objekt sa podacima potrebnima za kreirati template
            const templateProps = {
                email: userData.email,
                theme: userData.theme,
                shift: (izmjena.ujutro) ? 'prijepodne' : 'poslijepodne',
                tableHeading: izmjena.naslov,
                class: userData.razred.ime,
                dashboardUrl: dashboardUrl
            }
            // Dodaj sate u template props
            for (let i = 1; i <= 9; i++) {
                templateProps[`sat${i}`] = izmjena[`sat${i}`]
            }
            // Pobaj postal email
            try {
                await email.send(user.email, `Izmjene u rasporedu za razred ${userData.razred.ime}`, izmjeneTemplate(templateProps));
            } catch (err) {
                emailLog(`Failed to send email for user ${user.id}`);
                console.log(err);
                // Ako mail nije uspio biti poslan za user-a pređi na sljedećeg
                continue userLoop;
            }
        }

        if (zadnjaIzmjena)
            await baza.updateUser({ id: userData.id },{
                zadnjaPoslana: zadnjaIzmjena.id
            });
    }
}