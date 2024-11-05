const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');

// Fetch subjects for a student
router.get('/subjects', async (req, res) => {
    const studentId = req.user._id;

    try {
        const subjects = await Subject.find({ studentIds: studentId });
        const formattedSubjects = subjects.map(subject => ({
            code: subject.code,
            name: subject.name
        }));
        res.json(formattedSubjects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

module.exports = router;
