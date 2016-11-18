const debug = require("debug")("CompassSM");
const name = "CompassSM";

module.exports = (modulename) => {
    return (message) => {
        debug(`[${modulename}]`, message);
    }
}