require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
