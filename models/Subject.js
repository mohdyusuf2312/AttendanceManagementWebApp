const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    sub_name: { type: String, required: true },
    course: { type: String, required: true }, // Course code or name, e.g., MCA
    semester: { type: String, required: true } // Semester code or name, e.g., 1, 2, etc.
});

module.exports = mongoose.model('Subject', SubjectSchema);
