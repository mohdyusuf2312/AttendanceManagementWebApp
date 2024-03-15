const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late'] },
    subject: String // This will store the course/subject
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
