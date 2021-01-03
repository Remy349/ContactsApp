const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../lib/requirement');
// Uso de la DB.
const pool = require('../database');

/* ------------------------------ ADD CONTACTS ------------------------------ */

router.get('/add', isLoggedIn, (req, res) => {
    res.render('contacts/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { contact_name, contact_number } = req.body;
    const newContact = {
        contact_name,
        contact_number,
        user_id: req.user.id
    };

    await pool.query('INSERT INTO contacts SET ?', [newContact]);
    req.flash('success', 'Contact save successfully!');

    res.redirect('/contacts');
});

/* ------------------------------ ALL CONTACTS ------------------------------ */

router.get('/', isLoggedIn, async (req, res) => {
    const contacts = await pool.query('SELECT * FROM contacts WHERE user_id = ?', [req.user.id]);

    res.render('contacts/list', { contacts: contacts });
});

/* ----------------------------- DELETE CONTACT ----------------------------- */

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
    req.flash('success', 'Contact removed successfully!');

    res.redirect('/contacts');
});

/* ------------------------------ EDIT CONTACT ------------------------------ */

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const contact = await pool.query('SELECT * FROM contacts WHERE id = ?', [id]);

    res.render('contacts/edit', { contact: contact[0] });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { contact_name, contact_number } = req.body;
    const editContact = {
        contact_name,
        contact_number
    };

    await pool.query('UPDATE contacts SET ? WHERE id = ?', [editContact, id]);
    req.flash('success', 'Contact update successfully!');

    res.redirect('/contacts');
});

module.exports = router;
