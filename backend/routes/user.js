const express = require('express');
const auth = require('../middleware/auth');
const db = require('../models');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await db.User.findOne({
            where: { id: req.user.id },
            attributes: ['email', 'fitnessScore']
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/fitness-scores', auth, async (req, res) => {
    try {
        const fitnessScores = await db.FitnessScore.findAll({
            where: { userId: req.user.id },
            order: [['date', 'ASC']]
        });

        res.json(fitnessScores);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;