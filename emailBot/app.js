const { application, query } = require('express');
const express = require('express');
let path = require('path');
const port = process.env.PORT || 5000;
const {promiseQuery} = require('./../databaseConnect.js');
const database = require('./rasporedEmailFunkcije');
const rasporedEmail = require('./rasporedEmail');
let token = require('./createToken');
const app = express();
const handlebars = require('express-handlebars');

// ovaj dio omogucava da vrati endpointe u slucaju da se server restarta unutar 2h
let setEndpoints = async(t) => {
    // provjera ispravnosti tokena
    try {
        await database.checkToken(t);
        app.get('/unsubscribe/invalid-token', (req, res) => {
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                invalid: true
            });
        });
        //await database.removeToken(t);
    } catch {
        app.get('/unsubscribe/' + t, (req, res) => {
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                tokenURL: '/unsubscribe/' + t,
                before: true,
                after: false
            });
        });
    
        app.post('/unsubscribe/' + t, async(req, res) => {
            if (req.body.click) {
                await database.setUnsubscribe(t);
                res.render('webEmailUnsubscribe', {
                    layout: 'index',
                    tokenURL: '/unsubscribe/' + t,
                    before: false,
                    after: true
                });
            }
        });
    }
}

let setUnsubscribeEndpoints = async() => {
    let getAllTokens = await database.getTokens();
    for (t in getAllTokens) {
        await setEndpoints(getAllTokens[t].token);
    }
};

let setup = async() => {
    app.set('view engine', 'handlebars');
    app.engine('handlebars', handlebars.engine({
        layoutsDir: __dirname + '/views/layouts',
    }));
    app.set('views', path.join(__dirname + '/views'));
    app.use(express.urlencoded());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json({limit: '1mb'}));
    setUnsubscribeEndpoints();
}
setup();

// API ROUTES

app.get('/home', (req, res) => {
    res.render('webEmailHome', {layout: 'index'});
});

app.get('/form', (req, res) => {
    res.render('webForm', {layout: 'index'});
});

app.post('/form', async(req, res) => {
    const client = new database.Client(req.body.email, req.body.razred, req.body.saljiSve, req.body.tamnaTema);
    try {
        await database.checkEmail(client.email);
        res.render('webResponseReject', {
            layout: 'index',
            email: client.email,
            rej2: true
        });
    } catch {
        await database.insertData(client.email, client.classID, client.sendAll, client.darkTheme);
        res.render('webResponseReject', {
            layout: 'index',
            email: client.email,
            res2: true
        });
    }
});

app.get('/unsubscribe', (req, res) => {    
    res.render('webUnsubscribe', {layout: 'index'});
});

app.post('/unsubscribe', async(req, res) => {
    try {
        await database.checkEmail(req.body.unsubEmail);
        //console.log(req.body);
        let emailToken = token.token();
        const emailData = {receiverEmail: req.body.unsubEmail, tokenEmail: emailToken};
        await database.updateToken(emailData.receiverEmail, emailData.tokenEmail);
        await database.setTokenDate(emailData.receiverEmail);
        //rasporedEmail.send_email(emailData, null, 3);
        res.render('webResponseReject', {
            layout: 'index', 
            email: req.body.unsubEmail,
            res1: true
        });

        app.get('/unsubscribe/' + emailData.tokenEmail, async(req, res) => {
            res.render('webEmailUnsubscribe', {
                layout: 'index',
                tokenURL: '/unsubscribe/' + emailData.tokenEmail,
                before: true,
                after: false
            });
        });

        app.post('/unsubscribe/' + emailData.tokenEmail, async(req, res) => {
            if (req.body.click) {
                await database.setUnsubscribe(emailData.tokenEmail);
                res.render('webEmailUnsubscribe', {
                    layout: 'index',
                    tokenURL: '/unsubscribe/' + emailData.tokenEmail,
                    before: false,
                    after: true
                });
            }
        });
    } catch {
        res.render('webResponseReject', {
            layout: 'index', 
            email: req.body.unsubEmail,
            rej1: true
        });
    }
});

app.get('*', (req, res) => {
    res.render('404Page', {layout: 'index'});
});

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
