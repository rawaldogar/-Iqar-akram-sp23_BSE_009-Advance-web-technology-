const mongoose = require('mongoose');

// Yahan hum Event ka naqsha (Schema) bana rahe hain
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true // Is se khud hi pata chal jayega ke event kab create hua
});

// Is model ko export kar rahe hain taake baqi files mein use ho sake
module.exports = mongoose.model('Event', eventSchema);