require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require("ejs");
const path = require("path");
const router = express.Router();
const Attendance = require('../models/Attendance');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Enable JSON parsing for POST requests
app.use(express.urlencoded({urlencoded:true}))

app.set("view engine", "ejs")

app.use(express.static(path.join(__dirname, "public")))

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection failed:', err);
});

// MongoDB Schemas and Models
const studentSchema = new mongoose.Schema({
    enrollment_number: String,
    student_name: String,
    father_name: String,
    department: String,
    course: String,
    semester: String,
    dob: Date,
    image_url: { type: String, default: "/AttendanceManagementWebApp/public/assets/user'sPic.jpeg" },
    cumulative_attendance_percentage: Number
});

const attendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    date: { type: Date, default: Date.now },
    subject: String,
    status: { type: String, enum: ['present', 'absent', 'late'] }
});

const Student = mongoose.model('Student', studentSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);

// Endpoint to fetch cumulative attendance
app.get('/api/attendance', async (req, res) => {
    const enrollmentNumber = '123456'; // Replace with dynamic data

    try {
        const student = await Student.findOne({ enrollment_number: enrollmentNumber });
        if (student) {
            res.json({ cumulative_attendance_percentage: student.cumulative_attendance_percentage });
        } else {
            res.json({ cumulative_attendance_percentage: 'No data found' });
        }
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint to fetch student image
app.get('/api/student-image', async (req, res) => {
    const enrollmentNumber = '123456'; // Replace with dynamic data

    try {
        const student = await Student.findOne({ enrollment_number: enrollmentNumber });
        if (student) {
            res.json({ image_url: student.image_url });
        } else {
            res.json({ image_url: "/AttendanceManagementWebApp/public/assets/user'sPic.jpeg" });
        }
    } catch (err) {
        console.error('Error fetching student image:', err);
        res.status(500).json({ error: 'Failed to fetch student image' });
    }
});

// Endpoint to fetch student profile
app.get('/api/student-profile', async (req, res) => {
    const enrollmentNumber = '123456'; // Replace with dynamic data

    try {
        const student = await Student.findOne({ enrollment_number: enrollmentNumber });
        if (student) {
            res.json({
                enrollment_number: student.enrollment_number,
                student_name: student.student_name,
                father_name: student.father_name,
                department: student.department,
                course: student.course,
                semester: student.semester,
                dob: student.dob
            });
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    } catch (err) {
        console.error('Error fetching student profile:', err);
        res.status(500).json({ error: 'Failed to fetch student profile' });
    }
});

// Fetch cumulative attendance for a student
router.get('/cumulative-attendance', async (req, res) => {
    try {
        const studentId = req.user._id; // Assuming user is authenticated and their ID is available

        // Fetch attendance data grouped by course
        const attendanceData = await Attendance.aggregate([
            { $match: { studentId } },
            {
                $group: {
                    _id: '$subject', // Group by course (subject)
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
        console.error('Error fetching cumulative attendance:', err);
        res.status(500).json({ error: 'Failed to fetch cumulative attendance' });
    }
});

// Fetch attendance data by date range and subject
router.get('/date-wise-attendance', async (req, res) => {
    const { from, to, subject } = req.query;
    const studentId = req.user._id; // Assuming user is authenticated and their ID is available

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
        console.error('Error fetching attendance data:', err);
        res.status(500).json({ error: 'Failed to fetch attendance data' });
    }
});

// Fetch subjects for a student
router.get('/subjects', async (req, res) => {
    const studentId = req.user._id; // Assuming user is authenticated and their ID is available

    try {
        // Example: Fetch subjects for the student (This may vary depending on your DB structure)
        const subjects = await Subject.find({ studentId });
        const formattedSubjects = subjects.map(subject => ({
            code: subject.code,
            name: subject.name
        }));

        res.json(formattedSubjects);
    } catch (err) {
        console.error('Error fetching subjects:', err);
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

module.exports = router;

app.get("/admin", function(req, res){
    res.render("admin")
})

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
