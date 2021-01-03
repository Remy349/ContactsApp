const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const  helpers = require('./helpers');

/* --------------------------------- SIGN UP -------------------------------- */

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {

    const { fullname } = req.body;
    const newUser = {
        username, 
        password,
        fullname
    };

    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;

    return done(null, newUser);
}));

/* --------------------------------- SIGN IN -------------------------------- */

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true

}, async (req, username, password, done) => {

    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length > 0) {
        const user = rows[0];
        const validatePassword = await helpers.comparePassword(password, user.password);

        if (validatePassword) {
            done(null, user);
        }
        else {
            done(null, false, req.flash('message', 'Incorrect Password!'));
        }
    }
    else {
        return done(null, false, req.flash('message', 'Username does not exists!'));
    }
}));

/* --------------------------- DES/SERIALIZE USER --------------------------- */

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});
