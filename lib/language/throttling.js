// If chat messages are coming too fast, let the bot sleep for a while.
// Uses a "circular" array to keep track of the timestamp of the last
// MESSAGE_LIMIT messages and if they came in less than TIME_THRESHOLD ms
// it will make the bot sleep.

// Number of messages to keep track of.
const MESSAGE_LIMIT = 10;
// Time limit for MESSAGE_LIMIT messages to arrive before sleeping.
const TIME_THRESHOLD = 2000;
// Sleep time in seconds.
const SLEEP_TIME = 60;

var messageTimes = [];
var oldestTimestampIndex = 0;
var newestTimestampIndex = MESSAGE_LIMIT - 1;

// Initialize the circular array with zeros
for (let i = 0; i < MESSAGE_LIMIT; i++) {
    messageTimes.push(0);
}

/**
 * Will set the "sleeping" property of the given |sleepState| object to |true|
 * if the messages are coming to fast according to the module configuration. It
 * will set the property to |false| when waking up. See module constants to
 * configure this behaviour.
 * @param {Object} sleepState State object
 */
function checkThrottling(sleepState) {
    // Move oldest pointer
    oldestTimestampIndex = ++oldestTimestampIndex % MESSAGE_LIMIT;
    // Move newest pointer
    newestTimestampIndex = ++newestTimestampIndex % MESSAGE_LIMIT;
    // Write new newest value
    messageTimes[newestTimestampIndex] = Date.now();
    // Compare with old to see if it elapsed more than a second (these are
    // milliseconds)
    let diff =
        messageTimes[newestTimestampIndex] - messageTimes[oldestTimestampIndex];
    if (diff < TIME_THRESHOLD) {
        console.log("Messages are occuring too fast, sleeping");
        sleepState.sleeping = true;
        setTimeout(() => {
            sleepState.sleeping = false;
            console.log(`No longer sleeping`);
        }, SLEEP_TIME * 1000);
    }
}

module.exports = {
    checkThrottling,
};
