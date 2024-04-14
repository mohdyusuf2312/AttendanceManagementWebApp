const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
    code: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    studentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Subject', SubjectSchema);
