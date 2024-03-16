const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');

// Mark attendance (for teacher)
router.post('/mark', async (req, res) => {
    const { enrollment_number, status, course } = req.body;

    try {
        const student = await Student.findOne({ enrollment_number });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const attendance = new Attendance({
            studentId: student._id,
            status,
            subject: course // Assume course as subject for now
        });

        await attendance.save();
        res.json({ message: 'Attendance marked successfully', attendance });
    } catch (err) {
        console.error('Error marking attendance:', err);
        res.status(500).json({ error: 'Failed to mark attendance' });
    }
});

module.exports = router;
