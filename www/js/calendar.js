

function onDayClicked(dayIte) {
    return function() {
        var selDate = new Date($("#date_" + dayIte).val());

        createDailyView(selDate);
        $.ui.loadContent("#dailyView");

    };
}


/*
 * Sets the date in the field value. Performs no checks.
 * @param {type} date
 * @param {type} field
 */
function onDayClickedMini(date, field) {

    var ds = getDateStr(date);
    document.getElementById(field).value = ds;
}


function createDailyView(date) {
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }

    var day = date.getDate(),
            todate = (new Date()),
            year = date.getFullYear(),
            month = date.getMonth(),
            monStr = monthNames[month];

    // Change the header to match the current month
    $("#currDay").html("<div class='calCap'>" + day + "-" + monStr + "-" + year + "</div>");

    var previous = "<a href='#' id='a_previousDay' data-transition='slide' class='previous-btn icon left'>Previous</a>";
    $("#preDay").html(previous);

    $("#a_previousDay").click(function(event) {
        createDailyView(new Date(year, month, day - 1));
    });



    var next = "<a href='#' id='a_nextDay' data-transition='slide' class='next-btn icon right'>Next</a>";
    $("#nextDay").html(next);
    $('#a_nextDay').click(function(event) {
        createDailyView(new Date(year, month, day + 1));
    });



    var htmlStr = "<ul class='list' js-scrolling='true'>";
    var isToday = ((todate === date) ? true : false);

    for (var hourIte = 0; hourIte < 24; hourIte++) {
        htmlStr += "<li id='" + hourIte + "' " + ((isToday) ? 'selCol' : '') + ">";
        htmlStr += getDailyEventDataView(date, hourIte);

        htmlStr += "</li>";

    }
    htmlStr += "</ul>";
    $("#dailyViewData").html(htmlStr);
    $("#dailyViewData").bind("swipeLeft", function() {
        createDailyView(new Date(year, month, day + 1));
    });
    $("#dailyViewData").bind("swipeRight", function() {
        alert("swipe Right");
        createDailyView(new Date(year, month, day - 1));

    });

}
function initHourSelectFields(){
    
    var startH = document.getElementById('noteStartHour');
    var endH = document.getElementById('noteEndHour');
    var durationH = document.getElementById('noteDuration');
    
    for(var i=0;i<24;i++){
        var optionStart = document.createElement('option');
        var optionEnd = document.createElement('option');
        var optionDuration = document.createElement('option');
        optionStart.appendChild( document.createTextNode((i<10)?'0'+i+':00':i+':00'));
        optionEnd.appendChild( document.createTextNode((i<10)?'0'+i+':00':i+':00'));
        optionDuration.appendChild( document.createTextNode((i<10)?'0'+i+':00':i+':00'));
        optionStart.value=(i<10)?'0'+i+':00':i+':00';
        optionEnd.value=(i<10)?'0'+i+':00':i+':00';
        optionDuration.value=(i<10)?'0'+i+':00':i+':00';
        if(i===8){
            optionStart.selected = true;
            optionEnd.selected = true;
        }
        if(i===1){
            optionDuration.selected = true;
        }
        startH.appendChild(optionStart);
        endH.appendChild(optionEnd);
        durationH.appendChild(optionDuration);
    }
    
}

function getDailyEventDataView(date, hour) {
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }
    //var date = getDateStr(date);
    if(typeof(events) === 'undefined'){
        if(initDb()){
            //console.log("calling getAllNotes for="+date.toString());
            getAllNotesByBegin(date);
        }
    }
    console.log(events);
    var eventStr = "";
    if (typeof (events) === 'undefined' || events.total_rows <= 0) {
        eventStr += "<div class='hourLabel'>" + hour + "</div>";
    } else {
        //console.log("found event"+events);
        eventStr = "<div class='daily-events' id='hour" + hour + "'>" +
                "<h2>" + hour + "</h2>" +
                "<ul>";
        for (var eventIte = 0; eventIte < events.total_rows; eventIte++) {
            console.log(hour);
            console.log("-------");
            eventStr += "<li>" + events[eventIte] + "</li>";
        }
        eventStr += "</ul>";
    }
    return eventStr;
}
function createWeeklyView(date) {
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }

    var today = (new Date()).getDay(),
            todate = (new Date()),
            weekStartDate = new Date(getMonday(date)),
            //weekStartDay = weekStartDate.getDay(),
            weekEndDate = new Date(weekStartDate),
            weekEndDate = new Date(weekEndDate.setDate(weekStartDate.getDate() + 6));
    var isToday = ((todate <= weekEndDate && todate >= weekStartDate) ? true : false);
    // Change the header to match the current month
    $("#currWeek").html("<div class='calCap'>" + weekStartDate.toString() + "-" + weekEndDate.toString() + "</div>");

    var previous = "<a href='#' id='a_previousWeek' data-transition='slide' class='previous-btn icon left'>Previous</a>";
    $("#preWeek").html(previous);

    $("#a_previousWeek").click(function(event) {
        createWeeklyView(new Date(weekStartDate.setDate(weekStartDate.getDate() - 7)));
    });

    var next = "<a href='#' id='a_nextWeek' data-transition='slide' class='next-btn icon right'>Next</a>";
    $("#nextWeek").html(next);
    $('#a_nextWeek').click(function(event) {
        createWeeklyView(new Date(weekStartDate.setDate(weekStartDate.getDate() + 7)));
    });


    var htmlStr = "<div class='calBox'>" +
            "<div class='week-row head-row'>" +
            "<div class='day-col chead'></div>" +
            "<div class='day-col chead " + ((today == 1 && isToday) ? "selCol" : "") + "'>Monday</div>" +
            "<div class='day-col chead " + ((today == 2 && isToday) ? "selCol" : "") + "'>Tuesday</div>" +
            "<div class='day-col chead " + ((today == 3 && isToday) ? "selCol" : "") + "'>Wednesday</div>" +
            "<div class='day-col chead " + ((today == 4 && isToday) ? "selCol" : "") + "'>Thursday</div>" +
            "<div class='day-col chead " + ((today == 5 && isToday) ? "selCol" : "") + "'>Friday</div>" +
            "<div class='day-col chead " + ((today == 6 && isToday) ? "selCol" : "") + "'>Saturday</div>" +
            "<div class='day-col chead " + ((today == 0 && isToday) ? "selCol" : "") + "'>Sunday</div>" +
            "</div>";

    for (var hourIte = 0; hourIte < 24; hourIte++) {
        htmlStr += "<div class='week-row' id='weekhour" + hourIte + "'>" +
                "<div>" + hourIte + ":00</div>" +
                "<div class='day-col " + ((today == 1 && isToday) ? "selCol" : "") + "' id='weekd1h" + hourIte + "'></div>" +
                "<div class='day-col " + ((today == 2 && isToday) ? "selCol" : "") + "' id='weekd2h" + hourIte + "'></div>" +
                "<div class='day-col " + ((today == 1 && isToday) ? "selCol" : "") + "' id='weekd3h" + hourIte + "'></div>" +
                "<div class='day-col " + ((today == 1 && isToday) ? "selCol" : "") + "' id='weekd4h" + hourIte + "'></div>" +
                "<div class='day-col " + ((today == 1 && isToday) ? "selCol" : "") + "' id='weekd5h" + hourIte + "'></div>" +
                "<div class='day-col " + ((today == 1 && isToday) ? "selCol" : "") + "' id='weekd6h" + hourIte + "'></div>" +
                "<div class='day-col " + ((today == 1 && isToday) ? "selCol" : "") + "' id='weekd7h" + hourIte + "'></div>" +
                "</div>";

    }
    htmlStr += "</div>";
    $("#weeklyViewData").html(htmlStr);

    $("#weeklyViewData").bind("swipeLeft", function() {
        createWeeklyView(new Date(weekStartDate.setDate(weekStartDate.getDate() + 7)));
    });
    $("#weeklyViewData").bind("swipeRight", function() {
        alert("swipe Right");
        createWeeklyView(new Date(weekStartDate.setDate(weekStartDate.getDate() - 7)));

    });
}
function createMonthlyView(date) {
    if (typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }


    var year = date.getFullYear(),
            month = date.getMonth(),
            monStr = monthNames[month],
            day = date.getDate(),
            dayInMon = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();


    // Change the header to match the current month
    $("#currMonth").html("<div class='calCap'>" + monStr + ", " + year.toString() + "</div>");

    var previous = "<a href='#' id='a_previousMonth' data-transition='slide' class='previous-btn icon left'>Previous</a>";
    $("#preMonth").html(previous);

    $("#a_previousMonth").click(function(event) {
        createMonthlyView(new Date(year, month - 1, day));
    });

    var next = "<a href='#' id='a_nextMonth' data-transition='slide' class='next-btn icon right'>Next</a>";
    $("#nextMonth").html(next);
    $('#a_nextMonth').click(function(event) {
        createMonthlyView(new Date(year, month + 1, day));
    });

    var monthStartDate = (new Date(date.getFullYear(), date.getMonth(), 1));
    var monthStartDay = monthStartDate.getDay();
    var LastDayPrevMonth = new Date(year, month, 0);

    //Converting Sunday 0, Monday 1 to Monday 1, Sunday 7.
    if (monthStartDay === 0) {
        monthStartDay = 7;
    }

    var preMonDayIte = monthStartDay - 1;
    var preMonDateIte = 0;
    while (preMonDayIte > 0) {
        var preMonDate = new Date(year, month, preMonDateIte--);

        $("#day" + preMonDayIte).html(preMonDate.getDate());
        $("#day" + preMonDayIte).addClass("disabled");
        preMonDayIte--;
    }
    var dayIte = monthStartDay;
    for (var dateIte = 1; dayIte < 43, dateIte < dayInMon + 1; dayIte++, dateIte++) {
        var date = new Date(year, month, dateIte);
        //console.log(date.toString());
        var dayHtml = "<input type='hidden' value='" + date.toString() + "' id='date_" + dayIte + "'>"
                + "<label id='dateLabel_" + dayIte + "'>" + date.getDate() + "</label>";
        $("#day" + (dayIte)).html(dayHtml);
        // console.log("#day"+(dayIte));

        document.getElementById("day" + (dayIte)).onclick = onDayClicked(dayIte);

    }

    var nextMonDayIte = dayIte;
    var nextMonDateIte = 1;
    while (nextMonDayIte < 43) {
        var nextMonDate = new Date(year, month + 1, nextMonDateIte++);
        //console.log(nextMonDate.toString());
        $("#day" + nextMonDayIte).html(nextMonDate.getDate());
        $("#day" + nextMonDayIte).addClass("disabled");
        nextMonDayIte++;
    }

    $("#monthlyViewData").bind("swipeLeft", function() {
        createMonthlyView(new Date(year, month + 1, day));
    });
    $("#monthlyViewData").bind("swipeRight", function() {
        alert("swipe Right");
        createMonthlyView(new Date(year, month - 1, day));

    });

}

function toggleMiniMonthlyView(date, field, fieldBind) {
    $('#' + fieldBind).toggle();
    createMiniMonthlyView(date, field, fieldBind);
}

function hideMiniMonthlyView(fieldBind) {
    $('#' + fieldBind).hide();
}

function showMiniMonthlyView(date,field,fieldBind) {
    createMiniMonthlyView(date, field, fieldBind);
    $('#' + fieldBind).show();
}

function createMiniMonthlyView(date, field, fieldBind) {
    if (date === null || typeof (date) === 'undefined') {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }
    var year = date.getFullYear(),
            month = date.getMonth(),
            monStr = monthNames[month],
            day = date.getDate(),
            dayInMon = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate();


    var weekdiv = "<div id='selCal_"+getRand()+"' class='mini-cal'>" +
            "<div class='navbar'>" +
            "<ul class='grid'>" +
            "<li class='col3' id='preMonth'>" +
            "<a href='#' class='mini-previous-btn icon left' onclick='javascript:createMiniMonthlyView(\"" +
            new Date(year, month - 1, day) +
            "\",\"" + field + "\",\"" + fieldBind + "\")'></a></li>" +
            "<li class='col3' id='currMonth'>" +
            "<div class='mini-calCap'>";
            
            var monSelId = "selMonth_"+getRand();
            weekdiv += "<select id='"+monSelId+"' onchange='javascript:createMiniMonthlyView(new Date("+year+",$(\"#"+monSelId+"\").val(),"+day+"),\"" + field + "\",\"" + fieldBind + "\")'>";
            for(var i=0;i<monthNames.length;i++){
                weekdiv += "<option value='"+i+"' id='mon_"+i+"'"+((i===month)?" selected":"")+">"+monthNames[i]+"</option>";
            }
            weekdiv += "</select>";
            
            var yearSelId = "selYear_"+getRand();
            weekdiv += "<select id='"+yearSelId+"' onchange='javascript:createMiniMonthlyView(new Date($(\"#"+yearSelId+"\").val(),"+month+", "+day+"),\"" + field + "\",\"" + fieldBind + "\")'>";
            for(var i=1900;i<2500;i++){
                weekdiv += "<option id='year_"+i+"'"+((i===year)?" selected":"")+">"+i+"</option>";
            }
            weekdiv += "</select>";
  weekdiv +="</div></li>" +
            "<li class='col3' id='nextMonth'>" +
            "<a href='#' class='mini-next-btn icon right' onclick='javascript:createMiniMonthlyView(\"" +
            new Date(year, month + 1, day) +
            "\",\"" + field + "\",\"" + fieldBind + "\")'></a></li>" +
            "</ul>" +
            "</div>" +
            "<div class='calBox'>" +
            "<div class='week-row head-row'>" +
            "<div class='day-col-mini chead'>Mon</div>" +
            "<div class='day-col-mini chead'>Tue</div>" +
            "<div class='day-col-mini chead'>Wed</div>" +
            "<div class='day-col-mini chead'>Thu</div>" +
            "<div class='day-col-mini chead'>Fri</div>" +
            "<div class='day-col-mini chead'>Sat</div>" +
            "<div class='day-col-mini chead'>Sun</div>" +
            "</div>";
    weekdiv += "<div class='week-row'>";
    var monthStartDate = (new Date(date.getFullYear(), date.getMonth(), 1));
    var monthStartDay = monthStartDate.getDay();

    //Converting Sunday 0, Monday 1 to Monday 1, Sunday 7.
    if (monthStartDay === 0) {
        monthStartDay = 7;
    }

    var preMonDayIte = monthStartDay - 1;
    var preMonDateIte = 0;
    var dayIte = monthStartDay;
    var dateIte = 1;
    var nextMonDateIte = 1;
    var preMonIncVal = 1;
    var nextMonDayIte = 0;
    for (var i = 0; i < 43; i++) {

        if (i % 7 === 0 && i !== 0) {
            weekdiv += "</div>";
            weekdiv += "<div class='week-row'>";
        }
        if (preMonIncVal <= preMonDayIte) {
            preMonDateIte = preMonIncVal - preMonDayIte;
            var preMonDate = new Date(year, month, preMonDateIte);
            weekdiv += "<div class='day-col-mini disabled'>" + preMonDate.getDate() + "</div>";
            preMonIncVal++;

        } else {

            if (dateIte < dayInMon + 1) {
                var date = new Date(year, month, dateIte);
                weekdiv += "<div id='mini_cal_" + dayIte + "' class='day-col-mini'>"
                        + "<a href='#' class='hideButton' id='mini_cal_dateLabel_" + dayIte + "' onclick='onDayClickedMini(\"" +
                        date + "\",\"" + field + "\")'>" +
                        date.getDate() + "</a></div>";

                dateIte++;
                dayIte++;
                nextMonDayIte = dayIte;

            } else {
                if (nextMonDayIte < 43) {
                    var nextMonDate = new Date(year, month + 1, nextMonDateIte++);
                    weekdiv += "<div class='day-col-mini disabled'>" + nextMonDate.getDate() + "</div>";
                    nextMonDayIte++;
                }
            }


        }

    }
    weekdiv += "</div></div>";
    $('#' + fieldBind).html(weekdiv);



}

function initCal() {
    var date = new Date();

    createMonthlyView(date);
    createDailyView(date);
    createWeeklyView(date);

}
//document.addEventListener("DOMContentLoaded", initCal, false);