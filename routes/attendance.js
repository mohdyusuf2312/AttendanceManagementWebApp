const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const User = require('../models/User');

// Mark attendance (for teacher)
router.post('/mark', async (req, res) => {
    const { enrollment_number, status, course } = req.body;

    try {
        const student = await User.findOne({ enrollment_number });
        if (!student) return res.status(404).json({ error: 'Student not found' });

        const attendance = new Attendance({
            studentId: student._id,
            status,
            subject: course
        });

        await attendance.save();
        res.json({ message: 'Attendance marked successfully', attendance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch cumulative attendance (for student)
router.get('/cumulative-attendance', async (req, res) => {
    const studentId = req.user._id;

    try {
        const attendanceData = await Attendance.aggregate([
            { $match: { studentId } },
            {
                $group: {
                    _id: '$subject',
                    classesHeld: { $sum: 1 },
                    present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } }
                }
            }
        ]);

        // Map to the format required by the frontend
        const formattedData = attendanceData.map(item => ({
            courseCode: item._id,
            classesHeld: item.classesHeld,
            present: item.present
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

// Fetch date-wise attendance
router.get('/date-wise-attendance', async (req, res) => {
    const { from, to, subject } = req.query;
    const studentId = req.user._id;

    try {
        const attendanceData = await Attendance.find({
            studentId,
            subject,
            date: { $gte: new Date(from), $lte: new Date(to) }
        }).sort({ date: 1 });

        // Format the data for the frontend
        const formattedData = attendanceData.map(item => ({
            date: item.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            status: item.status
        }));

        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

module.exports = router;
