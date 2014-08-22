var dbCreated = false;
// global variables
var db;
var shortName = 'EventDb';
var version = '1.0';
var displayName = 'Notebook';
var maxSize = 200000;

document.addEventListener("deviceready", initEventDb(), false);

function initEventDb() {
     if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
     }
    db = window.openDatabase(shortName, version, displayName, maxSize);
    
    //Creating database tables(If they don't already exist)
    db.transaction(createDB, errorHandler, createDB_success);
}

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
alert('Error: ' + error.message + ' code: ' + error.code);
 
}
 
// this is called when a successful transaction happens
function successCallBack() {
alert("DEBUGGING: success");
 
}
 
function nullHandler(){};

function createDB_success() {
    alert("Database successfully created");
    db.transaction(getEvents, errorHandler);
}

function getEvents(transaction) {
    alert("Fetching events from DB");
	var sql = "select e.id, e.name, e.summary, e.starttime, e.endtime, e.duration,"+
                "e.abstraction from event e";
	transaction.executeSql(sql, [], getEvents_success);
}

function getEvents_success(transaction,results) {
    var len = results.rows.length;
    $('#eventList').empty();
    $('#eventList').html("<div class='headtext'>total events:"+len+"</div>");
    alert("total events:"+len);
    for (var i=0; i<len; i++) {
    	var event = results.rows.item(i);
            $('#eventList').append("<div>"+event.name+":"+event.summary+"</div>");
    }
	
}

function createDB(transaction) {
    //"IF NOT EXISTS" is important, so that the tables are created only, if they
    // don't already exist.
	var sql = "CREATE TABLE IF NOT EXISTS `event` ("+
                  "`id` INT( 30 ) NOT NULL AUTO_INCREMENT PRIMARY KEY ,"+
                  "`name` VARCHAR( 30 ) NOT NULL ,"+
                  "`summary` TEXT NOT NULL ,"+
                  "`starttime` DATETIME NOT NULL ,"+
                  "`endtime` DATETIME NULL ,"+
                  "`duration` INT( 8 ) NOT NULL ,"+
                  "`abstraction` ENUM( 'public', 'private', 'shared' ) NOT NULL"+
                  ")";
		
    transaction.executeSql(sql,[],nullHandler,errorHandler);

}

function insertEvent(event){
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    eventObj = new Event();
    if(typeof event === 'undefined' || event == ""){
        eventObj.name = $('#eventName').val();
        eventObj.summary = $('#eventSummary').val();
        eventObj.starttime = $('#eventStarttime').val();
        eventObj.endtime = $('#eventEndtime').val();
        eventObj.duration = $('#eventDuration').val();
        eventObj.abstraction = $('#eventAbstraction').val();
    }
    else if($.isArray(event)){
        eventObj.name = event[name];
        eventObj.summary = event[summary];
        eventObj.starttime = event[starttime];
        eventObj.endtime = event[endtime];
        eventObj.duration = event[duration];
        eventObj.abstraction = event[abstraction];
    }else{
        eventObj = event;
    }
    
    db.transaction(function(transaction) {
        transaction.executeSql("INSERT INTO events (name,summary,starttime,endtime,duration,abstraction)"+
        " VALUES(?,?,?,?,?,?)",[eventObj.name, eventObj.summary, eventObj.starttime,eventObj.endtime,eventObj.duration,eventObj.abstraction],nullHandler,errorHandler);
});
 
printEvents();
 
return false;
 
}

function printEvents() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
var sql = "select e.id, e.name, e.summary, e.starttime, e.endtime, e.duration,"+
                "e.abstraction from event e";
var sqlAttr = new Array();      
$('#eventList').html('');

    db.transaction(function(transaction) {
        transaction.executeSql(sql, sqlAttr,getEvents_success,errorHandler);
    },errorHandler,nullHandler);
 
return;
 
}
