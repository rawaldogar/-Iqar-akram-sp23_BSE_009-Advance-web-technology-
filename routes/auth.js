const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // User Model import kiya

// 1. SIGNUP: Naya User Register Karne Ki API
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check karna ke user pehle se exist to nahi karta
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'Username already exists! ❌' });
        }

        // Password ko secure/hash karna
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Naya user save karna
        user = new User({
            username,
            password: hashedPassword
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully! 🎉' });

    } catch (error) {
        // dynamic error response taake frontend par pata chale exact masla kya hai
        res.status(500).json({ message: `Signup Failed Backend Error: ${error.message} ❌` });
    }
});

// 2. LOGIN: User Authentication API
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check karna ke user database mein hai ya nahi
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials! ❌' });
        }

        // Password match karna
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid Credentials! ❌' });
        }

        // Fallback Secret Key lagayi hai taake agar .env file load na ho rahi ho to server crash na ho
        const secretKey = process.env.JWT_SECRET || 'my_super_secret_university_key_123';

        // JWT Token banana taake React ko bheja ja sake
        const token = jwt.sign(
            { id: user._id, username: user.username },
            secretKey,
            { expiresIn: '1h' } // 1 ghante baad token expire ho jayega
        );

        res.status(200).json({
            message: 'Login Successful! 🔓',
            token,
            user: { id: user._id, username: user.username }
        });

    } catch (error) {
        res.status(500).json({ message: `Login Failed Backend Error: ${error.message} ❌` });
    }
});

module.exports = router;