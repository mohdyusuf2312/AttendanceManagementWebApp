const express = require('express');
const bcrypt = require('bcrypt');
const Teacher = require('../models/Teacher'); 
const router = express.Router();
const crypto = require('crypto'); // For generating token
const nodemailer = require('nodemailer'); // For sending emails
const path = require('path');
const jwt = require('jsonwebtoken');

// POST /register - Teacher registration
router.post('/register', async (req, res) => {
    const { name, email, department, password, confirmPassword } = req.body;
    
    try {
        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email : email.toLowerCase() });
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
            email : email.toLowerCase(),
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

// POST /login - Teacher Login
router.post('/teacherLogin', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Check if email already exists
        const existingTeacher = await Teacher.findOne({ email : email.toLowerCase() });

        if (!existingTeacher) {
            return res.status(400).send({ message: "Email is not registered. Please do signup." });
        }

        // Hash password
        const isMatch = await bcrypt.compare(password, existingTeacher.password);

        if (!isMatch) {
            return res.status(400).send({ message: "Incorrect password." });
        } else {
            let teacherToken  = jwt.sign({ email: existingTeacher.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('teacherToken', teacherToken, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiry
            
            // Redirect or send success message
            res.status(200).send({ 
                message: "Teacher logged in successfully!",
                teacherName: existingTeacher.name
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error. Please try again later." });
    }
});

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL, // Your email address
        pass: process.env.EMAIL_PASSWORD // Your email password
    }
});

// Forgot Password Route
router.post('/forgotPassword', async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the email is registered
        const teacher = await Teacher.findOne({ email : email.toLowerCase() });
        if (!teacher) {
            return res.status(404).json({ message: 'Email is not registered. Please do signup.' });
        }

        // Generate a password reset token and expiry time
        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour expiry

        // Update the teacher's record with the token and expiry
        teacher.resetPasswordToken = token;
        teacher.resetPasswordExpires = tokenExpiry;
        await teacher.save();

        // Compose the password reset email
        const resetUrl = `http://${req.headers.host}/resetPassword/${token}`;
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Password Reset - AMU Attendance Portal',
            text: `You are receiving this email because you requested a password reset.\n\n
                Please click on the following link, or paste it into your browser, to complete the process:\n\n
                ${resetUrl}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Password reset link sent! Check your email.' });
    } catch (error) {
        console.error("Error in forgot password route:", error);
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
});

// Reset Password Route
router.get('/resetPassword/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const teacher = await Teacher.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Check if token is still valid
        });

        if (!teacher) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Render reset password page if the token is valid
        res.sendFile(path.join(__dirname, '../public/teacher/resetPassword.html')); // Serve the HTML form
        
    } catch (error) {
        console.error("Error verifying reset token:", error);
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
});

// Handle new password submission
router.post('/resetPassword/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        
        // Find the teacher by token and ensure it's not expired
        const teacher = await Teacher.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!teacher) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }

        // Hash the new password and update teacher's record
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        teacher.password = hashedPassword;
        teacher.resetPasswordToken = undefined; // Clear the reset token
        teacher.resetPasswordExpires = undefined; // Clear the expiry time
        await teacher.save();

        res.status(200).json({ message: "Password has been successfully reset." });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Could not reset password. Please try again." });
    }
});

router.get('/teacherProfile', async (req, res) => {
    try {
        // Verify and decode JWT token from cookies
        const token = req.cookies.teacherToken;
        if (!token) {
            return res.status(401).send({ message: "Unauthorized. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;
        // Fetch teacher data from database
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(404).send({ message: "Teacher not found." });
        }

        // Send back relevant profile data
        res.status(200).send({
            name: teacher.name,
            email: teacher.email,
            department: teacher.department,
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).send({ message: "Server error. Please try again later." });
    }
});

module.exports = router;