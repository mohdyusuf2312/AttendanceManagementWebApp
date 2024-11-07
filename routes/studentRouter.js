const express = require('express');
const router = express.Router();
const Student = require('../models/Student'); 
const Subject = require('../models/Subject');

// POST /login - Student Login
router.post('/login', async (req, res) => {
    const { enrollment_number, faculty_number } = req.body;
    try {
        // Check if enrollment number exists
        const existingStudent = await Student.findOne({ enrollment_number: enrollment_number.toUpperCase() });

        if (!existingStudent) {
            return res.status(400).send({ message: "Invalid enrollment number." });
        }

        // Verify faculty number
        const isMatch = faculty_number.toLowerCase() === existingStudent.faculty_number.toLowerCase();

        if (!isMatch) {
            return res.status(400).send({ message: "Incorrect faculty number." });
        } else {
            res.status(200).send({
                message: "Parent logged in successfully!",
                studentName: `${existingStudent.first_name} ${existingStudent.last_name}`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Server error. Please try again later." });
    }
});

router.get('/api/selectsubjects', async (req, res) => {
    const enrollment_number = req.query.enrollment_number;
    if (!enrollment_number) {
        return res.status(400).json({ error: 'Enrollment number is required' });
    }

    try {
        const student = await Student.findOne({ enrollment_number });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        const { course, semester } = student;

        const subjects = await Subject.find({ course, semester });
        const formattedSubjects = subjects.map(subject => ({
            sub_name: subject.sub_name
        }));
        res.json(formattedSubjects);

    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

module.exports = router;
