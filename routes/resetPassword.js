const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For hashing the new password
const Teacher = require('../models/Teacher'); // Assuming the teacher model is stored here
const path = require('path');

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

module.exports = router;
