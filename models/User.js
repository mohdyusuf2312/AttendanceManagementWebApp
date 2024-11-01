const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    first_name: { type: String, required: true },               // User's FirstName
    last_name: { type: String, required: true },                // User's LastName
    role: { type: String, enum: ['student', 'teacher'], required: true },  // Role: student or teacher
    enrollment_number: { type: String, unique: true, required: true },     // Enrollment number (acts as username)
    faculty_number: { type: String, required: true },     // Faculty number (acts as a "password")
    department: { type: String, required: true },         // Department of the student/teacher
    course: { type: String, required: true },             // Course student is enrolled in (e.g., MCA, B.Sc.)
    semester: { type: String, required: true },           // Current semester
    dob: { type: Date, required: true }                   // Date of birth
});

module.exports = mongoose.model('User', UserSchema);
