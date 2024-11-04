const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher'); // Assuming the teacher model is stored here
const crypto = require('crypto'); // For generating token
const nodemailer = require('nodemailer'); // For sending emails

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
        const teacher = await Teacher.findOne({ email });
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

module.exports = router;
