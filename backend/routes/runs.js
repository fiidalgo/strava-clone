// /backend/routes/runs.js
// Contains the routes for logging runs (create, read, update, delete). Handles backend logic for these operations

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../models');
const auth = require('../middleware/auth'); // Middleware to authenticate the user (assuming you havea JWT auth middleware)

const router = express.Router();

// Route to log a new run
router.post('/log', [
    // Validate and sanitize input fields
    body('date').isDate().withMessage('Enter a valid date'),
    body('distance').isFloat({ gt: 0 }).withMessage('Distance must be a positive number'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Enter a valid time format (hh:mm:ss)')
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Get run object
        const { date, distance, time } = req.body;

        // Calculate pace in mm:ss format
        const [hours, minutes, seconds] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        const pace = totalMinutes / distance;

        const paceMinutes = Math.floor(pace);
        const paceSeconds = Math.round((pace - paceMinutes) * 60).toString().padStart(2, '0');
        const paceString = `${paceMinutes}:${paceSeconds}`;

        // Create new run associated with authenticated user
        const run = await db.Run.create({
            date,
            distance,
            time,
            pace: paceString,
            userId: req.user.id
        });
        res.json(run);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to view all runs
router.get('/', auth, async (req, res) => {
    try {
        const runs = await db.Run.findAll({ where: { userId: req.user.id } });
        res.json(runs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to update a run
router.put('/:id', [
    // Validate and sanitize input fields
    body('date').isDate().withMessage('Enter a valid date'),
    body('distance').isFloat({ gt: 0 }).withMessage('Distance must be a positive number'),
    body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/).withMessage('Enter a valid time format (HH:mm:ss)')
], auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { date, distance, time } = req.body;

    try {
        const run = await db.Run.findOne({ where: { id: req.params.id, userId: req.user.id } });

        if (!run) {
            return res.status(404).json({ msg: 'Run not found '});
        }

        // Update run details
        run.date = date || run.date;
        run.distance = distance || run.distance;
        run.time = time || run.time;
        
        // Recalculate pace
        const [hours, minutes, seconds] = run.time.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + seconds / 60;
        run.pace = totalMinutes / distance;

        const paceMinutes = Math.floor(run.pace);
        const paceSeconds = Math.round((run.pace - paceMinutes) * 60).toString().padStart(2, '0');
        const paceString = `${paceMinutes}:${paceSeconds}`;
        run.pace = paceString;
        
        await run.save();

        res.json(run);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Route to delete a run
router.delete('/:id', auth, async (req, res) => {
    try {
        const run = await db.Run.findOne({ where: { id: req.params.id, userId: req.user.id } });

        if (!run) {
            return res.status(404).json({ msg: 'Run not found' });
        }

        await run.destroy();

        res.json({ msg: 'Run deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.get('/analytics', auth, async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        const runs = await db.Run.findAll({
            where: {
                userId: req.user.id,
                date: {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                }
            },
            order: [['date', 'ASC']]
        });
        res.json(runs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;