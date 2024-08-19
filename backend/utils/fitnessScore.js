// /backend/utils/fitnessScore.js
// Utility function to calculate the fitness score for a user based on their runs

/**
 * Converts pace string in format "mm:ss" to minutes as a float.
 * @param {string} pace - The pace string in the format "mm:ss"
 * @returns {number} The pace in minutes as a float
 */
function convertPaceToMinutes(pace) {
    const [minutes, seconds] = pace.split(':').map(Number);
    return minutes + (seconds / 60);
}

/**
 * Converts time string in format "hh:mm:ss" to minutes as a float.
 * @param {string} time - The time string in the format "hh:mm:ss"
 * @returns {number} The time in minutes as a float
 */
function convertTimeToMinutes(time) {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return (hours * 60) + minutes + (seconds / 60);
}

/**
 * Calculates fitness score based on user's runs
 * @param {Array} runs - Array of runs belonging to the user
 * @returns {number} Calculated fitness score
 */
function calculateFitnessScore(runs) {
    if (!Array.isArray(runs) || runs.length === 0) {
        return 0; // Return 0 if there are no runs
    }

    const durationWeight = 0.4;
    const distanceWeight = 0.4;
    const paceWeight = 0.2;
    const consistencyMultiplier = 1.05;

    let fitnessScore = 0;
    let previousRunDate = null;
    let currentMultiplier = 1;

    runs.forEach(run => {
        const runPace = convertPaceToMinutes(run.pace);
        const runDuration = convertTimeToMinutes(run.time);
        const runDistance = run.distance;

        if (isNaN(runPace) || isNaN(runDuration) || isNaN(runDistance)) {
            console.error('Invalid run data:', { runPace, runDuration, runDistance });
            return;
        }

        const durationScore = runDuration * durationWeight;
        const distanceScore = runDistance * distanceWeight;
        const paceScore = 1 / runPace * paceWeight; // Adjust this for faster paces

        const runDate = new Date(run.date);
        if (previousRunDate) {
            const daysBetween = Math.floor((runDate - previousRunDate) / (1000 * 60 * 60 * 24));
            if (daysBetween === 1) {
                currentMultiplier *= consistencyMultiplier;
            } else {
                currentMultiplier = 1;
            }
        }

        fitnessScore += (durationScore + distanceScore + paceScore) * currentMultiplier;
        previousRunDate = runDate;
    });

    return parseFloat(fitnessScore.toFixed(2)); // Return the score rounded to 2 decimal places
}


module.exports = { calculateFitnessScore };