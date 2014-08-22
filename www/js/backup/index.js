/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
function openCalendar(){
alert("openCalendar");

}
function openNotes(){
alert(" Notes");
}
function openAssignments(){
alert("Assignments");
}

function openAbout(){
getPage("license.html","GET");
}

$("notesLink").on( "click", function() {
    getPage("notes.html","GET");
});

var time = 0;

function temp_show(noticeType, text) {

	if (noticeType == "info") {
		$("notice-info").html(text);
		$("#notice-info").show();
		time = setTimeout(function() {
			$("notice-info").hide();
		}, 2000);
	} else if (noticeType == "error") {
		$("notice-error").html(text);
		$("#notice-error").show();
		time = setTimeout(function() {
			$("notice-error").hide();
		}, 2000);
	} else if (noticeType == "success") {
		$("notice-success").html(text);
		$("#notice-success").show();
		time = setTimeout(function() {
			$("notice-success").hide();
		}, 2000);
	} else if (noticeType == "warning") {
		$("notice-warning").html(text);
		$("#notice-warning").show();
		time = setTimeout(function() {
			$("notice-warning").hide();
		}, 2000);
	}
}


//$(document).on('pageinit', '#calendarPage', function () {
//    var date = new Date();
//    var d = date.getDate();
//    var m = date.getMonth();
//    var y = date.getFullYear();
//
//    $("#calendar").jqmCalendar({
//        events: [ {
//            "summary": "Dinner",
//                "begin": new Date(y, m, d + 3),
//                "end": new Date(y, m, d + 4)
//
//        }, {
//            "summary": "Lunch with Friends",
//                "begin": new Date(y, m, d + 6),
//                "end": new Date(y, m, d + 7)
//
//        } ],
//        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
//        days: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
//        startOfWeek: 0,
//
//    });
//});

function submitForm(form,url,method){
	if (typeof form == 'undefined' || form == "") {
		alert('No form specified');
		return false;
	}else{
		if(typeof url == 'undefined' || url == ""){
                  url = $("#"+form)[0].action;
                }
                if(typeof method == 'undefined' || method ==""){
                method = $("#"+form)[0].method;
		}
	}
console.log($("#"+form).serialize());
	isloading(true);
            
		$.ajax({
		url : CONTEXT_ROOT+"/"+url,
		type : method,
		dataType : "html",
		data : $("#"+form).serialize(),
		success : function(data) {
			var xmlDoc = $.parseXML(data);
			$xml = $(xmlDoc);
			console.log($xml);
			$("#main").replaceWith($xml.find('#main'));

			
			isloading(false);
		},
		fail : function() {
			temp_show('error', 'Unable to submit form');
			isloading(false);
		}
	});
	
}
function getDiv(div,url,method){
if(typeof method == 'undefined' || method ==""){
                method = 'GET';
}

        $.ajax({
                url : url,
                type : method,
                dataType : "html",
                cache : false,
                beforeSend : function() {
                        isloading(true);
                },
                success : function(data) {
                        var xmlDoc = $.parseXML(data);
                        $xml = $(xmlDoc);
                        console.log($xml);
                        if(div=="new"){
                          var new_div = document.createElement('div');
                          new_div.attr('id', 'overlay_div');
                          $("#"+main).append(new_div);
                          
                        }else{
                          $("#"+div).replaceWith($xml.find('#'+div));
                        }
                        isloading(false);

                },
                fail : function() {
alert('fail');
                        temp_show('error', 'Unable to Load '+url);
                        isloading(false);
                }
        });

}
function getPage(url,method) {

if(typeof url =='undefined' || url ==""){
temp_show('error','No URL defined, redirecting to home');
url = "/";
}

if(typeof method =='undefined' || method ==""){
method = "GET";
}

	$.ajax({
		url : url,
		type : method,
		dataType : "html",
		cache : false,
		beforeSend : function() {
			// $('#main').hide(2000);
			isloading(true);
		},
		success : function(data) {
                    alert("success");
			var xmlDoc = $.parseXML(data);
			$xml = $(xmlDoc);
			console.log($xml);
			$("#main").replaceWith($xml.find('#main'));
                        // $('#main').html(value);
			// $('#main').show(2000);
			isloading(false);

		},
		fail : function() {
alert('fail');
			temp_show('error', 'Unable to Load '+url);
			// $('#main').show(2000);
			isloading(false);
		}
	});
}