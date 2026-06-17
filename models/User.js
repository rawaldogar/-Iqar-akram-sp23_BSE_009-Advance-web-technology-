const mongoose = require('mongoose');

// Yahan hum User (Login/Signup) ka naqsha bana rahe hain
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true // Ek naam se do user register nahi ho sakte
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Is model ko export kar rahe hain
module.exports = mongoose.model('User', userSchema);