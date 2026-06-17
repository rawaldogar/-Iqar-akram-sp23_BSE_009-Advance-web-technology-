const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Jo model humne banaya tha usko import kiya

// 1. CREATE: Naya Event Add Karne Ki API (POST Request)
router.post('/add', async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        
        const newEvent = new Event({ title, date, location, description });
        await newEvent.save(); // Data MongoDB mein save ho gaya
        
        res.status(201).json({ message: 'Event added successfully! ✅', event: newEvent });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// 2. READ: Saare Events Fetch Karne Ki API (GET Request)
router.get('/all', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }); // Naye events sabse upar aayenge
        res.status(200).json(events); // React ko saara data JSON format mein milega
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// 3. UPDATE: Kisi Event Ko Edit/Update Karne Ki API (PUT Request)
router.put('/update/:id', async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id, 
            { title, date, location, description },
            { new: true } // Taake updated data wapas mile
        );
        
        res.status(200).json({ message: 'Event updated successfully! 🔄', event: updatedEvent });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// 4. DELETE: Kisi Event Ko Remove Karne Ki API (DELETE Request)
router.delete('/delete/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Event deleted successfully! ❌' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

module.exports = router;