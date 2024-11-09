const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Subject = require('../models/Subject');
const jwt = require('jsonwebtoken');

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
            date: new Date().toISOString().split('T')[0],                            // Current date for each attendance record
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

// Endpoint to generate attendance report
router.get('/api/attendanceReport', async (req, res) => {
    const { course, semester, subject } = req.query;

    // Validate the inputs
    if (!course || !semester || !subject) {
        return res.status(400).json({ error: "Missing required query parameters: course, semester, subject" });
    }

    try {
        // Step 1: Fetch attendance records filtered by course, semester, and subject
        const attendanceRecords = await Attendance.find({ 
            course: course,
            semester: semester,
            sub_name: subject
        });

        // Step 2: Calculate attendance summary for each student
        const attendanceSummary = {};
        attendanceRecords.forEach(record => {
            const { enrollment_number, status } = record;

            // Initialize the student's record if it doesn't exist
            if (!attendanceSummary[enrollment_number]) {
                attendanceSummary[enrollment_number] = { present: 0, total: 0 };
            }

            // Increment the total attendance count
            attendanceSummary[enrollment_number].total += 1;

            // Increment the present count if status is 'present'
            if (status === 'present') {
                attendanceSummary[enrollment_number].present += 1;
            }
        });

        // Step 3: Fetch the student details for those with attendance < 60%
        const detainedStudents = [];
        for (const enrollment in attendanceSummary) {
            const { present, total } = attendanceSummary[enrollment];
            const attendancePercentage = (present / total) * 100;

            // Check if attendance is below 60%
            if (attendancePercentage < 60) {
                const student = await Student.findOne({ enrollment_number: enrollment });

                if (student) {
                    detainedStudents.push({
                        enrollment_number: student.enrollment_number,
                        name: `${student.first_name} ${student.last_name}`,
                        attendancePercentage: attendancePercentage.toFixed(2)
                    });
                }
            }
        }

        // Step 4: Return the detained students data
        res.status(200).json(detainedStudents);

    } catch (error) {
        console.error("Error generating attendance report:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Fetch cumulative attendance (for student)
router.get('/api/cumulative-attendance', async (req, res) => {
    try {
        // Verify and decode JWT token from cookies
        const token = req.cookies.studentToken;
        if (!token) {
            return res.status(401).send({ message: "Unauthorized. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const enrollment_number = decoded.enrollment_number;

        // Fetch student data from database
        const student = await Student.findOne({ enrollment_number: enrollment_number.toUpperCase() });
        if (!student) {
            return res.status(404).send({ message: "Student not found." });
        }

        // Fetch attendance data as in previous response
        const attendanceRecords = await Attendance.find({
            enrollment_number: enrollment_number,
            course: student.course,
            semester: student.semester
        });

        // Calculate attendance summary...
        const attendanceSummary = {};
        attendanceRecords.forEach(record => {
            if (!attendanceSummary[record.sub_name]) {
                attendanceSummary[record.sub_name] = { classesHeld: 0, present: 0 };
            }
            attendanceSummary[record.sub_name].classesHeld += 1;
            if (record.status === 'present') {
                attendanceSummary[record.sub_name].present += 1;
            }
        });

        const attendanceData = Object.keys(attendanceSummary).map((subName, index) => {
            const { classesHeld, present } = attendanceSummary[subName];
            const percentage = ((present / classesHeld) * 100).toFixed(2);
            return {
                sNo: index + 1,
                subName,
                classesHeld,
                present,
                percentage
            };
        });

        res.json({ attendanceData });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Fetch date-wise attendance
router.get('/api/date-wise-attendance', async (req, res) => {
    const { from, to, subject } = req.query;
    try {
        // Verify and decode JWT token from cookies
        const token = req.cookies.studentToken;
        if (!token) {
            return res.status(401).send({ message: "Unauthorized. Please log in." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const enrollment_number = decoded.enrollment_number;

        const attendanceData = await Attendance.find({
            enrollment_number,
            sub_name: subject,
            date: { $gte: from, $lte: to }
        }).sort({ date: 1 });

        // Format the data for the frontend
        const formattedData = attendanceData.map(item => ({
            date: item.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
            subject: item.sub_name,
            status: item.status
        }));
        res.json(formattedData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance' });
    }
});

module.exports = router;
