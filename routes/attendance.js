const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');

// In attendance.js route file
router.get("/api/students", async (req, res) => {
    const { course, semester } = req.query;
    try {
        // Fetch and sort students by faculty_number
        const students = await Student.find({ course, semester: Number(semester) }).sort({ faculty_number: 1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching students.' });
    }
});

router.get("/api/subjects", async (req, res) => {
    const { course, semester } = req.query;
    try {
        const subjects = await Subject.find({ course, semester });  // Use find instead of findOne
        const subjectNames = subjects.map(subject => subject.sub_name);  // Extract subject names
        res.json(subjectNames);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching subjects.' });
    }
});

router.post("/api/attendance", async (req, res) => {
    const { course, semester, subject, teacher_name, attendance } = req.body;
    
    try {
        const attendanceRecords = attendance.map(item => ({
            enrollment_number: item.enrollment_number,  // Ensure this is an ObjectId if referring to Student model
            sub_name: subject,                           // This should match `Subject` schema in MongoDB
            date: new Date(),                            // Current date for each attendance record
            status: item.present ? 'present' : 'absent',
            course,
            semester,
            teacher_name
        }));

        await Attendance.insertMany(attendanceRecords);
        res.status(201).json({ message: "Attendance recorded successfully" });
    } catch (err) {
        res.status(400).json({ message: "Error saving attendance", error: err });
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
