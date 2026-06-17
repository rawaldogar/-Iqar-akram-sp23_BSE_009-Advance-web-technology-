const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Configuration file load karna
dotenv.config();

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json()); 

// =========================================================================
// 1. DATABASE MODELS SETUP
// =========================================================================

// User Model Setup
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }
});
const User = mongoose.models.User || mongoose.model('User', userSchema);

// Event Model Setup
const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true }
});
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);


// =========================================================================
// 2. AUTHENTICATION ROUTERS (Signup & Login)
// =========================================================================

// Signup Endpoint
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This email is already registered! ❌' });
        }
        const newUser = new User({ username, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Signup Successful! 🎉' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error during registration ❌' });
    }
});

// Login Endpoint
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(400).json({ message: 'Invalid credentials! ❌' });
        }
        res.status(200).json({ 
            message: 'Login approved! 🔓', 
            token: 'session-token-2026', 
            username: user.username 
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error during login ❌' });
    }
});


// =========================================================================
// 3. CAMPUS EVENTS ROUTERS (Full CRUD Matrix)
// =========================================================================

// View/Get All Events
app.get('/api/events/all', async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events' });
    }
});

// Post/Add New Event
app.post('/api/events/add', async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        const newEvent = new Event({ title, date, location, description });
        await newEvent.save();
        res.status(201).json({ message: 'Event Added Successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating event' });
    }
});

// Put/Update Event Details
app.put('/api/events/update/:id', async (req, res) => {
    try {
        const { title, date, location, description } = req.body;
        await Event.findByIdAndUpdate(req.params.id, { title, date, location, description });
        res.status(200).json({ message: 'Event Updated Successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating event' });
    }
});

// Delete Document Entry
app.delete('/api/events/delete/:id', async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Event Deleted Successfully!' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
});


// =========================================================================
// 4. CONNECTIVITY & PORT INITIALIZATION
// =========================================================================
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Database Connected Successfully! ✅'))
.catch((err) => console.log('Database Connection Failed! ❌', err));

app.get('/', (req, res) => {
    res.send('Backend Server is Running Perfectly...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} 🚀`);
});