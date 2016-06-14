"use strict";

const events = require("events");

class ClassBase extends events.EventEmitter {}

module.exports = ClassBase;