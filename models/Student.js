const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    first_name: { type: String, required: true },               // User's FirstName
    last_name: { type: String, required: true },                // User's LastName
    enrollment_number: { type: String, unique: true, required: true },     // Enrollment number (acts as username)
    faculty_number: { type: String, required: true },     // Faculty number (acts as a "password")
    course: { type: String, required: true },             // Course student is enrolled in (e.g., MCA, B.Sc.)
    semester: { type: String, required: true }           // Current semester
});

module.exports = mongoose.model('Student', StudentSchema);
