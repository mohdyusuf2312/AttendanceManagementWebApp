const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher'); 
const router = express.Router();

// POST /register - Teacher registration
router.post('/register', async (req, res) => {
    const { name, email, department, password, confirmPassword } = req.body;

    // Basic validation
    if (password !== confirmPassword) {
        return res.status(400).send({ message: "Passwords do not match." });
    }

    try {
        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).send({ message: "Email is already registered." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new teacher document
        const newTeacher = new Teacher({
            name,
            email,
            department,
            password: hashedPassword
        });

        // Save to database
        await newTeacher.save();

        // Redirect or send success message
        res.status(201).send({ message: "Teacher registered successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error. Please try again later." });
    }
});

module.exports = router;