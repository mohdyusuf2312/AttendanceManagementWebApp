const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const User = require('../models/User');

// Fetch subjects for a student
router.get('/subjects', async (req, res) => {
    const studentId = req.user._id;

    try {
        const subjects = await Subject.find({ studentIds: studentId });
        res.json(subjects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch subjects' });
    }
});

module.exports = router;
