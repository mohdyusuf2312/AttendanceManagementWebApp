const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // replace with your MySQL password
    database: 'amu_attendance'
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Endpoint to fetch cumulative attendance
app.get('/api/attendance', (req, res) => {
    const enrollmentNumber = '123456'; // Replace with dynamic data
    const facultyNumber = 'FAC001'; // Replace with dynamic data

    const sql = `SELECT cumulative_attendance_percentage FROM student_attendance WHERE enrollment_number = ? AND faculty_number = ?`;
    db.query(sql, [enrollmentNumber, facultyNumber], (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Failed to fetch data' });
            return;
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ cumulative_attendance_percentage: 'No data found' });
        }
    });
});

// Endpoint to fetch student image
app.get('/api/student-image', (req, res) => {
    const enrollmentNumber = '123456'; // Replace with dynamic data

    const sql = `SELECT image_url FROM students WHERE enrollment_number = ?`;
    db.query(sql, [enrollmentNumber], (err, results) => {
        if (err) {
            console.error('Error fetching student image:', err);
            res.status(500).json({ error: 'Failed to fetch student image' });
            return;
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({ image_url: '/New/assets/default-student.png' });
        }
    });
});

// Endpoint to fetch student profile
app.get('/api/student-profile', (req, res) => {
    const enrollmentNumber = '123456'; // Replace with dynamic data

    const sql = `SELECT enrollment_number, student_name, father_name, department, course, semester, dob FROM students WHERE enrollment_number = ?`;
    db.query(sql, [enrollmentNumber], (err, results) => {
        if (err) {
            console.error('Error fetching student profile:', err);
            res.status(500).json({ error: 'Failed to fetch student profile' });
            return;
        }

        if (results.length > 0) {
            res.json(results[0]); // Send the first result as JSON
        } else {
            res.status(404).json({ error: 'Student not found' });
        }
    });
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
