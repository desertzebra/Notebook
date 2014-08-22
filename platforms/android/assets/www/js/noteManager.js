
'use strict';
var newNoteDom = document.getElementById('newNote');



function initNote() {
    if (!initDb())
        return;

    initHourSelectFields();
    console.log("getting all notes");
    getAllNotes();
}

// We have to create a new note document and enter it in the database
function addNote(noteObj) {
    /*
     * Building Note Object from fields.
     */
    if (typeof noteObj === 'undefined' || noteObj === null) {
        noteObj = new Object();
        if (!verifyNoteFields()) {
            alert("Note data not valid");
            temp_show('error', "Field verification error");
            return;
        }
        var noteid = ($('#noteId').val());
        if (noteid.length > 0) {
            console.log("noteid=" + noteid);
            noteObj._id = noteid;
        }

        if (document.getElementById('noteRev').value) {
            noteObj._rev = document.getElementById('noteRev').value;
        } else {
            console.log("note _rev not set. Might cause conflict.");
        }

        noteObj.name = $('#noteName').val();
        noteObj.summary = $('#noteSummary').val();
        //console.log("Start Day = "+$('#noteStartDay').val()+" "+$('#noteStartHour').val());

        var beginAt = strToDate($('#noteStartDay').val());

        if (beginAt === null) {
            alert("Date format not recognised=" + beginAt + ". Not saving anything");
            return;
        }
        console.log("beginAt before setting time=" + beginAt);
        console.log("Time to set=" + $('#noteStartHour').val());

        beginAt = addTime(beginAt, $('#noteStartHour').val());

        console.log("beginAt=" + noteObj.beginAt);
        if (!validateDate(beginAt)) {
            alert("Time format not recognised=" + beginAt + ". Not saving anything");
            return;
        }
        noteObj.beginAt = beginAt;

        noteObj.periodic = $('#notePeriodic').val();
        noteObj.duration = $('#noteDuration').val();

        if (noteObj.periodic == 'on') {
            if ($('#noteEndDay').val() !== "") {
                noteObj.finishAt = StrToDate($('#noteEndDay').val());
                if (noteObj.finishAt === null) {
                    alert("Date format not recognised=" + noteObj.finishAt + ". Not saving anything");
                }
                beginAt = addTime(noteObj.finishAt, $('#noteEndHour').val());

                console.log("finishAt=" + noteObj.finishAt);
                if (!validateDate(noteObj.finishAt)) {
                    alert("Time format not recognised=" + noteObj.finishAt + ". Not saving anything");
                    return;
                }
                noteObj.finishAt.setTime($('#noteEndHour').val());
            } else {
                var endDate = addMinutes(noteObj.beginAt, noteObj.duration);
                console.log("finishAt=" + endDate);
                noteObj.finishAt = endDate;
            }
        }
        noteObj.noteType = $('#noteType').val();
        noteObj.abstraction = $('#noteAbstraction').val();
        noteObj.type = 'note';
    }

    var callbackNote = function callback(err, result) {
        if (!err) {
            console.log('Successfully posted a note!');
            temp_show('success', 'Successfully posted a note');
            getAllNotesByBegin();
            $.ui.loadContent("#noteList");
        } else {
            console.log('Unable to save data!');
            alert('Could not save the note(' + err + ')');
        }
    };
    postDbObj(noteObj, callbackNote);

}
function updateNoteCount(count) {
    var noteCountDom = document.getElementById('note-count');
    while (noteCountDom.firstChild) {
        noteCountDom.removeChild(noteCountDom.firstChild);
    }

    noteCountDom.appendChild(document.createTextNode(count));
    noteCountDom.className = 'af-badge';
}

function mapNote(note) {
    if (note.beginAt) {
        emit(note.beginAt);
    }
}


function callBackSomeNotes(err, response) {
    if (!err) {
        console.log('got notes for=' + date.toString());
        console.log(response);
        //updateNoteCount(response.total_rows);
        redrawNotesUI(response);
    } else {
        console.log('Unable to fetch data!');
        console.log(err);
        alert('Could not fetch note data(' + err + ')');
    }
}
function callBackAllNotes(err, response) {

    if (!err) {
        console.log(response);
        updateNoteCount(response.length);
        redrawNotesUI(response);
    } else {
        console.log('Unable to fetch data!');
        console.log(err);
        alert('Could not fetch note data(' + err + ')');
    }
    /*
     * Got a response for the notes. Now we should init calendar.
     */
    initCal();

}

//Get Nodes sorted by finish date.
function getAllNotesByBegin(date) {
    if (typeof (date) === 'undefined' || date === null) {
        //alert("date("+date+") object undefined");
        date = new Date();
    } else {
        date = new Date(date);
    }

    getObjByType('note', 'date', 'beginAt', getPreviousDate(date), getNextDate(date), callBackSomeNotes);

}

// Show the full list of notes by reading them from the database
function getAllNotes() {

    getObjByType('note', '', '', null, null, callBackAllNotes);


}

// User pressed the delete button for a note, delete it
function deleteButtonPressed(note) {
    removeFromDb(note);
}

function editButtonPressed(note) {
    editNote(note);
}

// User has double clicked a note, edit it now.
function editNote(note) {

    if (note._rev) {
        document.getElementById('noteRev').value = note._rev;
    }
    document.getElementById('noteId').value = note.id;
    document.getElementById('noteName').value = note.name;
    document.getElementById('noteSummary').value = note.summary;
    document.getElementById('noteDuration').value = note.duration;
    console.log(note);
    var Start = note.beginAt.split(" ");
    if (Start.length === 2) {
        document.getElementById('noteStartDay').value = Start[0];
        document.getElementById('noteStartHour').value = Start[1];
    }
    var isPeriodic = ((note.periodic !== "") ? true : false);
    document.getElementById('notePeriodic').checked = isPeriodic;
    if (isPeriodic) {
        if (typeof (note.finishAt) !== 'undefined') {
            var End = note.finishAt.split(" ");
            if (End.length === 2) {
                document.getElementById('noteEndDay').value = End[0];
                document.getElementById('noteEndHour').value = End[1];
            }
        } else {
            document.getElementById('noteEndDay').value = 'Not set';
        }
    }
    document.getElementById('notePeriodic').checked = ((note.periodic !== "") ? "true" : false);
    document.getElementById('noteAbstraction').value = note.abstraction;
    document.getElementById('noteType').value = note.noteType;

    $.ui.loadContent("#newNote");
}


// Given an object representing a note, this will create a list item
// to display it.
function createNoteListItem(note) {
    var nameLabel = document.createElement('div');
    nameLabel.appendChild(document.createTextNode(note.name));
    nameLabel.className = 'noteItem half-field';
    nameLabel.addEventListener('dblclick', editButtonPressed.bind(this, note));

    var summaryView = document.createElement('div');
    summaryView.className = 'noteItem half-filed';
    summaryView.appendChild(document.createTextNode(shorten(note.summary), 5));


    var startLabel = document.createElement('div');
    startLabel.className = 'noteItem';
    startLabel.appendChild(document.createTextNode("Starting from=" + note.beginAt + ","));

    var durationLabel = document.createElement('div');
    durationLabel.className = 'noteItem';
    durationLabel.appendChild(document.createTextNode("Duration=" + note.duration + "mins"));

    var nTypeLabel = document.createElement('div');
    nTypeLabel.className = 'noteItem';
    nTypeLabel.appendChild(document.createTextNode(note.noteType));



    var divDisplay = document.createElement('div');
    divDisplay.className = 'note';
    divDisplay.addEventListener('click', createNoteItem.bind(this, note));
    divDisplay.appendChild(nameLabel);
    divDisplay.appendChild(summaryView);
    divDisplay.appendChild(startLabel);
    divDisplay.appendChild(durationLabel);
    divDisplay.appendChild(nTypeLabel);
    var li = document.getElementById('li_' + note._id);
    if (li === null) {
        var li = document.createElement('li');
        li.id = 'li_' + note._id;
        li.appendChild(divDisplay);
    } else {
        while (li.firstChild) {
            li.removeChild(li.firstChild);
        }
        li.appendChild(divDisplay);
    }

    return li;
}
// Given an object representing a note, this will create a list item
// to display it.
function createNoteItem(note) {

    var textGroup = document.createElement('div');
    textGroup.className = "form_item";

    var nameLabel = document.createElement('div');
    nameLabel.appendChild(document.createTextNode(note.name));
    nameLabel.className = 'noteItem';
    nameLabel.addEventListener('dblclick', editButtonPressed.bind(this, note));

    var summaryView = document.createElement('div');
    summaryView.className = 'textbox';
    summaryView.appendChild(document.createTextNode(shorten(note.summary), 5));

    textGroup.appendChild(nameLabel);
    textGroup.appendChild(summaryView);

    var temporalGroup = document.createElement('div');
    temporalGroup.className = "form_item";

    var startLabel = document.createElement('div');
    startLabel.className = 'noteItem';
    startLabel.appendChild(document.createTextNode("Starting from=" + note.beginAt + ","));

    if (note.finishAt) {
        var endLabel = document.createElement('div');
        endLabel.className = 'noteItem';
        endLabel.appendChild(document.createTextNode(" Till=" + note.finishAt + ","));
        temporalGroup.appendChild(endLabel);
    }

    var durationLabel = document.createElement('div');
    durationLabel.className = 'noteItem';
    durationLabel.appendChild(document.createTextNode("Duration=" + note.duration + "mins"));

    temporalGroup.appendChild(startLabel);
    temporalGroup.appendChild(durationLabel);

    var typeGroup = document.createElement('div');
    typeGroup.className = "form_item";

    var absLabel = document.createElement('div');
    absLabel.className = 'noteItem';
    absLabel.appendChild(document.createTextNode(note.abstraction));

    var nTypeLabel = document.createElement('div');
    nTypeLabel.className = 'noteItem';
    nTypeLabel.appendChild(document.createTextNode(note.noteType));

    typeGroup.appendChild(absLabel);
    typeGroup.appendChild(nTypeLabel);

    var deleteLink = document.createElement('button');
    deleteLink.className = 'icon remove';
    deleteLink.appendChild(document.createTextNode('Remove'));
    deleteLink.addEventListener('click', deleteButtonPressed.bind(this, note));

    var editLink = document.createElement('button');
    editLink.className = 'icon pencil';
    editLink.appendChild(document.createTextNode('Edit'));
    editLink.addEventListener('click', editButtonPressed.bind(this, note));

    var divDisplay = document.createElement('div');
    divDisplay.className = 'note';
    divDisplay.appendChild(textGroup);
    divDisplay.appendChild(temporalGroup);
    divDisplay.appendChild(typeGroup);
    divDisplay.appendChild(deleteLink);
    divDisplay.appendChild(editLink);
    document.getElementById('noteItemView').appendChild(divDisplay);

    var noteHeadDom = document.getElementById('noteHead');
    while (noteHeadDom.firstChild) {
        noteHeadDom.removeChild(noteHeadDom.firstChild);
    }
    noteHeadDom.appendChild(document.createTextNode(note.name));
    $.ui.loadContent("#viewNote");
}
function verifyNoteFields() {
    var notename = $('#noteName').val();
    var notesummary = $('#noteSummary').val();
    if (notename == "" || notesummary == "") {
        return false;
    }
    return true;
}
function clearFields() {
    $('#noteId').val("");
    $('#noteName').val("");
    $('#noteSummary').val("");
    $('#noteStartDay').val(getDateStr(new Date()));
    $('#noteEndDay').val(getDateStr(new Date()));
    $('#noteDuration').val(50);
    $('#notePeriodic').checked = false;
}

function redrawNotesUI(notes) {
    //alert("printing notes");
    console.log("redrawing NOTES UI");
    console.log(notes);


    //createDailyView();
    //console.log(typeof(notes));
    var noteListDom = document.getElementById('ul_noteList');
    //$('#noteList').html('');
    //noteListDom.appendChild(createNewNoteDom());
   
    notes.forEach(function(note) {
        //console.log(note.key.beginAt);
        events[note.key.beginAt] = note.key;
        //console.log("************note:::");
        //console.log(note.key);
        noteListDom.appendChild(createNoteListItem(note.key));
    });

}

function addNoteEventListeners() {
    $('#notePeriodic').on('change', function() {
        console.log(document.getElementById('notePeriodic').checked);
        if (document.getElementById('notePeriodic').checked) {
            $('#noteEndDay').disabled = false;
            $('#noteEndTime').disabled = false;
            $('#divEndAt').removeClass('disabled');
        } else {
            $('#noteEndDay').disabled = true;
            $('#noteEndTime').disabled = true;
            $('#divEndAt').addClass('disabled');
        }
    });
    $('#newNoteForm').submit(function(e) {
        e.preventDefault();
        addNote(null);
        clearFields();

    });
}


