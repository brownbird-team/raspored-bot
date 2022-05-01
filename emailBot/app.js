const express = require('express');
const port = process.env.PORT || 5000;
const app = express();
const handlebars = require('express-handlebars');

let path = require('path');

app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars.engine({
    layoutsDir: __dirname + '/views/layouts',
}));
app.set('views', path.join(__dirname + '/views'));
app.use(express.urlencoded( {extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit: '1mb'}));

/*=============== API ROUTES ===============*/

app.use('/home', require('./routes/home'));
app.use('/subscribe', require('./routes/subscribe'));
app.use('/unsubscribe', require('./routes/unsubscribe'));
app.use('/*', require('./routes/page404'));

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});
