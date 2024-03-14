require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json()); // Enable JSON parsing for POST requests

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
            res.json({ image_url: '/New/assets/default-student.png' });
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
