const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher'); 
const router = express.Router();

// POST /register - Teacher registration
router.post('/register', async (req, res) => {
    const { name, email, department, password, confirmPassword } = req.body;
    
    try {
        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email });
        // Basic validation
        if (existingTeacher) {
            return res.status(400).send({ message: "Email is already registered." });
        }
        if (password.length < 6) {
            return res.status(400).send({ message: "Password must be at least 6 characters long." });
        }
        if (password !== confirmPassword) {
            return res.status(400).send({ message: "Passwords do not match." });
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