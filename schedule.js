var Q = require("q");
var cheerio = require("cheerio");

var Events = {};

Events.class = function(element) {
	var e = $(element);

	//Check if class is cancelled
	this.isCancelled = e.hasClass("ext-event-cancelled");
	//Check if class is the main event
	this.isMain = e.hasClass("breakall");
	//Check if roll has been marked
	this.attendanceMarked = e.children("attendance-line").hasClass("marked");

	//Get timetable info
}

function Schedule(body) {
	this.today = [];

	var $ = cheerio.load(body);

	//Get time-pixel scale
	var pixelScale = $(".ext-cal-bg-row").height() //Height in pixels of a 1 hour block

	//Process today's classes
	$(".ext-cal-day-col-inner").children().children().each(function(i) {
		var eventClass = new Events.class(this);
		this.today.push(eventClass);

	});

}

module.exports = Schedule;