require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route (with Enrollment Number and Faculty Number)
router.post('/login', async (req, res) => {
    const { enrollment_number, faculty_number } = req.body;

    try {
        // Check if the user with the given enrollment number exists
        const user = await User.findOne({ enrollment_number });
        if (!user) {
            return res.status(400).json({ error: 'Enrollment number do not found' });
        }

        // Check if the faculty number matches the stored faculty number for the user
        if (user.faculty_number !== faculty_number) {
            return res.status(400).json({ error: 'Invalid faculty number' });
        }

        // Generate a JWT token if credentials match
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

// Fetch student/teacher profile route
router.get('/profile', async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

module.exports = router;