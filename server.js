require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require("ejs");
const path = require("path");
const studentRoutes = require('./routes/studentRouter');
const teacherRoutes = require('./routes/teacherRouter');
const attendanceRoutes = require('./routes/attendance');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(cookieParser());
// Enable parsing of JSON and URL-encoded form data for POST requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS for rendering dynamic pages
app.set("view engine", "ejs");

// Serve static files (e.g., CSS, JS, images) from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection using Mongoose
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('MongoDB connection failed:', err);
});

app.use('/', studentRoutes);
app.use('/', teacherRoutes);
app.use('/', attendanceRoutes);

// Endpoint to fetch cumulative attendance
app.get('/api/attendance', async (req, res) => {
    const enrollmentNumber = req.query.enrollment_number;

    try {
        const student = await Student.findOne({ enrollment_number: enrollmentNumber.toUpperCase() });
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

// Endpoint to fetch student profile
app.get('/api/student-profile', async (req, res) => {
    const enrollmentNumber = req.query.enrollment_number;

    try {
        const student = await Student.findOne({ enrollment_number: enrollmentNumber.toUpperCase() });
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

app.get("/admin", (req, res) => {
    res.render("admin");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
