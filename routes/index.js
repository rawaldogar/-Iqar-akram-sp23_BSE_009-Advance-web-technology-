const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');

const isAuth = (req, res, next) => {
    if (req.session.isLoggedIn) return next();
    res.redirect('/login');
};

router.get('/', isAuth, async (req, res) => {
    const events = await Event.find();
    res.render('index', { events });
});

router.get('/add', isAuth, (req, res) => res.render('add-event'));
router.post('/add', isAuth, async (req, res) => {
    await new Event(req.body).save();
    res.redirect('/');
});

router.get('/edit/:id', isAuth, async (req, res) => {
    const event = await Event.findById(req.params.id);
    res.render('edit-event', { event });
});

router.post('/edit/:id', isAuth, async (req, res) => {
    await Event.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
});

router.get('/delete/:id', isAuth, async (req, res) => {
    await Event.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

router.get('/login', (req, res) => res.render('login', { error: null }));
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        req.session.isLoggedIn = true;
        res.redirect('/');
    } else {
        res.render('login', { error: "Invalid Credentials!" });
    }
});

router.get('/register', (req, res) => res.render('register', { error: null }));
router.post('/register', async (req, res) => {
    try {
        await new User(req.body).save();
        res.redirect('/login');
    } catch (err) {
        res.render('register', { error: "User already exists!" });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

module.exports = router;