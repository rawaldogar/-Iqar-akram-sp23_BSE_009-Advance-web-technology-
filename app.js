const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const indexRoutes = require('./routes/index');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/universityEvents')
    .then(() => console.log("✅ Database Connected"))
    .catch(err => console.log("❌ DB Error:", err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));

app.use('/', indexRoutes);

app.listen(3000, () => console.log("🚀 Server: http://localhost:3000"));