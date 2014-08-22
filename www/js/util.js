
/*
 * Global Variables
 */

var username = '';
var ENTER_KEY = 13;
var monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
var events = new Array();


function getUUID(){
  var self = {};
  var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16); }
  self.generate = function() {
    var d0 = Math.random()*0xffffffff|0;
    var d1 = Math.random()*0xffffffff|0;
    var d2 = Math.random()*0xffffffff|0;
    var d3 = Math.random()*0xffffffff|0;
    return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
      lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
      lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
      lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
  };
  console.log(self);
    return self;
}

function getRand(){
    return Math.floor(Math.random()*10);
}
/*
 * user functions
 * @param {type} username
 * @returns {Boolean}
 */
function isValid(username){
    if(typeof username === 'undefined' || username === null || username === ""){
        return false;
    }
    return true;
}

/*
 * String functions
 */
String.prototype.trunc = String.prototype.trunc ||
      function(n){
          return this.length>n ? this.substr(0,n-1)+'&hellip;' : this;
      };
  function shorten(text,size){
      if(typeof(text)==='undefined' || text===null || text === '')return '-';
      var shortText = text;
      shortText.trunc(size);
      return shortText;
  }
  
  
  /*
   * From http://stackoverflow.com/questions/1152024/best-way-to-generate-a-random-color-in-javascript
   * @returns {String}
   */
  function getRandColor(){
      return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
  }
  
  /*
   * Date Functions
   */

function strToDate(dateStr) {
if(typeof(dateStr) !== 'string' ){
    dateStr = getDateStr(dateStr);
}

/*
 * Dirty Hack. Date expected to be in DD-MM-YYYY format
 */
var pattern = /(\d{2})\-(\d{2})\-(\d{4})/;
var dt = new Date(dateStr.replace(pattern,'$3-$2-$1'));
//console.log(dateStr.replace(pattern,'$3-$2-$1'));
//console.log(dt);
if (validateDate(dt)) {
            return dt;
}
    return null;
}

function validateDate(date) {
    if (Object.prototype.toString.call(date) === "[object Date]") {
        // it is a date
        if (isNaN(date.getTime())) {  // d.valueOf() could also work
            return false;
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
}

function getPreviousDate(date){
    if (typeof (date) === 'undefined' || date===null) {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }
    date.setDate(date.getDate() - 1);
    return date;
}

function getNextDate(date){
    if (typeof (date) === 'undefined' || date===null) {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }
    date.setDate(date.getDate() + 1);
    return date;
}

/*
 * Converts a date into 'DD-MM-YYYY' format string
 * @param {type} date
 * @returns {String}
 */
function getDateStr(date) {
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }
    var mon = date.getMonth()+1;
    var dt = date.getDate();
    return ((dt<10)?"0"+dt:dt) + "-" + ((mon<10)?"0"+mon:mon) + "-" + date.getFullYear();
}

function addTime(date,timeStr){
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }
    
        var timeParts = timeStr.split(':');
        date.setHours(timeParts[0]);
        if(timeParts.length>1){
            date.setMinutes(timeParts[1]);
            if(timeParts.length>2){
                date.setSeconds(timeParts[1]);
            }
        }
        
        return date;
        
}

/*
 * Adds numeric minutes to a date.
 * @param {type} date
 * @param {type} numeric minutes
 * @returns {Date}
 */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

/*
 * Return first day of month: 0 for Sunday, 1 for Monday and so on...
 * @param {type} date
 * @returns {Date}
 */
function firstDayOfMonth(date) {
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }

    return (new Date(date.getFullYear(), date.getMonth(), 1)).getDay();
}

/*
 * Returns the previous date for monday. Useful for weekly calendar view
 * @param {type} date
 * @returns {Date}
 */
function getMonday(d) {
    d = new Date(d);
    var day = d.getDay();
    if (day == 1) {
        return d;
    }
    var diff = day - (day == 0 ? 6 : 1); // adjust when day is sunday
    console.log("day=" + day + "||diff=" + diff + "||date=" + d.getDate());
    return new Date(d.setDate(d.getDate() - diff));
}