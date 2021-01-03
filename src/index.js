const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');

const { database } = require('./keys');
/* ----------------------------- INITIALIZATIONS ---------------------------- */

const app = express();
require('./lib/passport');

/* -------------------------------- SETTINGS -------------------------------- */

app.set('PORT', process.env.PORT || 5000);
// Motor de plantillas hbs.
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

/* ------------------------------- MIDDLEWARES ------------------------------ */

app.use(session({
    secret: 'nodejsMysqlContactApp',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

/* ---------------------------- GLOBAL VARIABLES ---------------------------- */

app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

/* --------------------------------- ROUTES --------------------------------- */

app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use('/contacts', require('./routes/contacts'));

/* --------------------------------- PUBLIC --------------------------------- */

app.use(express.static(path.join(__dirname, 'public')));

/* ---------------------------- START THE SERVER ---------------------------- */

app.listen(app.get('PORT'), () => {
    console.log(`Server listening at http://localhost:${app.get('PORT')}`);
});
