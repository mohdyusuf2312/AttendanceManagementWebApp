const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher'); 
const router = express.Router();

// POST /register - Teacher registration
router.post('/teacherLogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email });

        if (!existingTeacher) {
            return res.status(400).send({ message: "Email is not registered. Please do signup." });
        }

        // Hash password
        const isMatch = await bcrypt.compare(password, existingTeacher.password);

        if (!isMatch) {
            return res.status(400).send({ message: "Incorrect password." });
        } else {
            // Redirect or send success message
            res.status(200).send({ message: "Teacher logged in successfully!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error. Please try again later." });
    }
});

module.exports = router;