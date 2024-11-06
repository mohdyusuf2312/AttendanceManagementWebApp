const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    enrollment_number: { type: String, required: true },
    sub_name: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent'], required: true },
    course: { type: String, required: true },
    semester: { type: String, required: true },
    teacher_name: { type: String, required: true }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
