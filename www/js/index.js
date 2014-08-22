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

console.log("init appframework");
$.ui.autoLaunch = false;
$.ui.useOSThemes = false;
$.ui.showLoading = true;
$.ui.loadingText = "Loading...";
$.ui.disableSideMenu();
console.log("check for af.desktopBrowsers");

if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
    var script = document.createElement("script");
    script.src = "js/plugins/af.desktopBrowsers.js";
    var tag = $("head").append(script);
}

function init() {
    $.ui.backButtonText = "Back";// We override the back button text to always say "Back"
    window.setTimeout(function() {
        console.log("launching appframework ui");
        $.ui.launch();
        document.getElementById('noteStartDay').value = getDateStr();
        document.getElementById('noteEndDay').value = getDateStr();
        addEventListeners();
    }, 1500);//We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires
    //$.ui.availableTransitions['default'] = $.ui.availableTransitions.none;
    //$.ui.launch();
   
    //initNoteDb();
     

 
}

function addEventListeners(){
    
    addUserEventListeners();
    addNoteEventListeners();
    addSubjEventListeners();
    
}
document.addEventListener("DOMContentLoaded", init, false);

var app = {
    // Application Constructor
    initialize: function() {

       // this.bindEvents();



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



$.ui.ready(function() {
    console.log("launch complete");
    $.ui.showLoading = false;
});
var time = 0;

function temp_show(noticeType, text) {

    if (noticeType == "info") {
        $("#notice-info").html(text);
        $("#notice-info").show();
        time = setTimeout(function() {
            $("#notice-info").hide();
        }, 2000);
    } else if (noticeType == "error") {
        $("#notice-error").html(text);
        $("#notice-error").show();
        time = setTimeout(function() {
            $("#notice-error").hide();
        }, 2000);
    } else if (noticeType == "success") {
        $("#notice-success").html(text);
        $("#notice-success").show();
        time = setTimeout(function() {
            $("#notice-success").hide();
        }, 2000);
    } else if (noticeType == "warning") {
        $("#notice-warning").html(text);
        $("#notice-warning").show();
        time = setTimeout(function() {
            $("#notice-warning").hide();
        }, 2000);
    }
}

//function getPage(url,method) {
//
//if(typeof url =='undefined' || url ==""){
//temp_show('error','No URL defined, redirecting to home');
//url = "/";
//}
//
//if(typeof method =='undefined' || method ==""){
//method = "GET";
//}
//
//	$.ajax({
//		url : url,
//		type : method,
//		dataType : "html",
//		cache : false,
//		beforeSend : function() {
//			// $('#main').hide(2000);
//			isloading(true);
//		},
//		success : function(data) {
//                    alert("success");
//			var xmlDoc = $.parseXML(data);
//			$xml = $(xmlDoc);
//			console.log($xml);
//			$("#main").replaceWith($xml.find('#main'));
//                        // $('#main').html(value);
//			// $('#main').show(2000);
//			isloading(false);
//
//		},
//		fail : function() {
//alert('fail');
//			temp_show('error', 'Unable to Load '+url);
//			// $('#main').show(2000);
//			isloading(false);
//		}
//	});
//}