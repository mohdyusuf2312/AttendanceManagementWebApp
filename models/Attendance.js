const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    subject: { type: String, required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['present', 'absent', 'late'], required: true }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
