// Google Apps Script web app (Deploy > Web app, "Anyone"). Output is consumed by src/app/api/calendar/route.ts.
// Returns {busy:["YYYY-MM-DD"] full days, partial:{"YYYY-MM-DD":"am"|"pm"}} (am = before 12:00, pm = from 12:00, Europe/Berlin).
function doGet() {
  var TZ = "Europe/Berlin";
  var cal = CalendarApp.getCalendarById("vershnyk.com@gmail.com") || CalendarApp.getDefaultCalendar();
  var from = new Date(); from.setMonth(from.getMonth() - 2);
  var until = new Date(); until.setFullYear(until.getFullYear() + 2);
  var slots = {};
  function mark(day, part) { (slots[day] = slots[day] || {})[part] = true; }
  var events = cal.getEvents(from, until);
  events.forEach(function (e) {
    if (e.isAllDayEvent()) {
      // getAllDayEndDate() is EXCLUSIVE -> stop before it
      var d = new Date(e.getAllDayStartDate().getTime());
      var end = e.getAllDayEndDate().getTime();
      while (d.getTime() < end) {
        var k = Utilities.formatDate(d, TZ, "yyyy-MM-dd");
        mark(k, "am"); mark(k, "pm");
        d = new Date(d.getTime() + 86400000);
      }
    } else {
      var s = e.getStartTime().getTime(), t = Math.max(e.getEndTime().getTime(), s + 1);
      for (var x = s; x < t; x += 900000) mark2(new Date(x));
      mark2(new Date(t - 1));
    }
  });
  function mark2(dt) {
    mark(Utilities.formatDate(dt, TZ, "yyyy-MM-dd"), Number(Utilities.formatDate(dt, TZ, "H")) < 12 ? "am" : "pm");
  }
  var busy = [], partial = {};
  Object.keys(slots).sort().forEach(function (day) {
    if (slots[day].am && slots[day].pm) busy.push(day);
    else partial[day] = slots[day].am ? "am" : "pm";
  });
  return ContentService.createTextOutput(JSON.stringify({busy: busy, partial: partial, eventCount: events.length})).setMimeType(ContentService.MimeType.JSON);
}
