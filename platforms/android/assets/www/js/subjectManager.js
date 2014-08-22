'use strict'

function editSubject() {
    $.ui.loadContent("#editSubject");
}

function redrawSubjectUI(subjs) {
    //initDb();
var subjListDom = document.getElementById('ul_subjList');
    
       //$('#noteList').html('');
      //noteListDom.appendChild(createNewNoteDom());
    subjs.forEach(function(subj) {
        subjListDom.appendChild(createSubjListItem(subj.key));
    });
    
    
    }
    
    // Given an object representing a note, this will create a list item
  // to display it.
  function createSubjListItem(subj) {
        console.log(subj.color);
        if(typeof(subj.color)==='undefined' || subj.color === ''){
            editSubj(subj);
            $.ui.loadContent("#editSubject");
            //return;
        }
      
    var shortnameLabel = document.createElement('div');
    shortnameLabel.appendChild( document.createTextNode(subj.shortname));
    shortnameLabel.className = 'noteItem';
        
    var divDisplay = document.createElement('div');
    divDisplay.className = 'subj';
    divDisplay.appendChild(shortnameLabel);
    divDisplay.addEventListener('click',createSubjView.bind(this,subj));
    divDisplay.style = "border 1px solid "+subj.color+";";
    
      var li = document.getElementById('li_' + subj._id);
    if(li===null){
        var li = document.createElement('li');
        li.id = 'li_' + subj._id;
        li.appendChild(divDisplay);
    }else{
        while (li.firstChild) {
            li.removeChild(li.firstChild);
        }
    li.appendChild(divDisplay);
    }
    
    return li;
  }
  
  function createSubjView(subj){
      
    var textGroup = document.createElement('div');
    textGroup.className = "form_item";
    textGroup.style += "border 1px solid "+subj.color+";";
    
        var nameLabel = document.createElement('div');
        nameLabel.appendChild( document.createTextNode(subj.fullname));
        nameLabel.className = 'noteItem';
        nameLabel.addEventListener('dblclick', editSubjButtonPressed.bind(this, subj));
        
        var shortnameLabel = document.createElement('div');
        shortnameLabel.appendChild( document.createTextNode(subj.shortname));
        shortnameLabel.className = 'noteItem';

        var summaryView = document.createElement('div');
        summaryView.className = 'textbox';
        summaryView.appendChild( document.createTextNode(shorten(subj.summary),5));
    
    textGroup.appendChild(nameLabel);
    textGroup.appendChild(shortnameLabel);
    textGroup.appendChild(summaryView);
    
    var temporalGroup = document.createElement('div');
    temporalGroup.className = "form_item";
    
        var startLabel = document.createElement('div');
        startLabel.className = 'noteItem';
        startLabel.appendChild( document.createTextNode("Starting from="+subj.startDate+","));

            var endLabel = document.createElement('div');
            endLabel.className = 'noteItem';
            endLabel.appendChild( document.createTextNode(" Till="+subj.endDate+","));

    temporalGroup.appendChild(endLabel);
    temporalGroup.appendChild(startLabel);
    
    
    var detailsGroup = document.createElement('div');
    detailsGroup.className = "form_item";
    
        var teacherLabel = document.createElement('div');
        teacherLabel.className = 'noteItem';
        teacherLabel.appendChild( document.createTextNode(subj.teacher));
    
        var linksView = document.createElement('div');
        linksView.className = 'textbox';
        linksView.appendChild( document.createTextNode(shorten(subj.links),5));
    
    
    detailsGroup.appendChild(teacherLabel);
    detailsGroup.appendChild(linksView);

    var deleteLink = document.createElement('button');
    deleteLink.className = 'icon remove';
    deleteLink.appendChild( document.createTextNode('Remove'));
    deleteLink.addEventListener( 'click', delSubjButtonPressed.bind(this, subj));
    
    var editLink = document.createElement('button');
    editLink.className = 'icon pencil';
    editLink.appendChild( document.createTextNode('Edit'));
    editLink.addEventListener( 'click', editSubjButtonPressed.bind(this, subj));

    var divDisplay = document.createElement('div');
    divDisplay.className = 'subj';
    divDisplay.appendChild(textGroup);
    divDisplay.appendChild(temporalGroup);
    divDisplay.appendChild(detailsGroup);
    divDisplay.appendChild(deleteLink);
    divDisplay.appendChild(editLink);
    divDisplay.id = 'div_'+subj.id;
    
    document.getElementById('subjectItemView').appendChild(divDisplay);
    
    var subjHeadDom = document.getElementById('subjHead');
    while (subjHeadDom.firstChild) {
            subjHeadDom.removeChild(subjHeadDom.firstChild);
        }
    subjHeadDom.appendChild(document.createTextNode(subj.fullname));
    $.ui.loadContent("#viewSubject");
    
  }
    
  // User pressed the delete button for a note, delete it
  function delSubjButtonPressed(subj) {
      removeFromDb(subj);
  }
  
  function editSubjButtonPressed(subj) {
      editSubj(subj);
  }

  // User has double clicked a note, edit it now.
  function editSubj(subj) {
     if(typeof(subj)==='undefined'||subj===null){
         subj = new Object();
         subj.fullname = "New Subject";
         subj.shortname = "subjshort";
     }
    //console.log("editSubj");
    //console.log(subj);

    document.getElementById('e_subName').value = subj.fullname;
    document.getElementById('e_subShortName').value = subj.shortname;
    document.getElementById('e_subColor').value = (subj.color)?subj.color:getRandColor();
    document.getElementById('e_subSummary').value = (subj.summary) ? subj.summary : '-';
    document.getElementById('e_subStartDate').value = (subj.startDate) ? getDateStr(subj.startDate) : '';
    document.getElementById('e_subEndDate').value = (subj.endDate) ? getDateStr(subj.endDate) : '';
    document.getElementById('e_subTeacher').value = (subj.teacher) ? subj.teacher : '-';
    document.getElementById('e_subLinks').value = (subj.links) ? subj.links : '-';

    if (subj._rev) {
        document.getElementById('subRev').value = subj._rev;
    }
    if (subj._id) {
        document.getElementById('subId').value = subj._id;
    }

}

function saveSubj(subjObj) {
    if (typeof (subjObj) === 'undefined' || subjObj === null) {
        subjObj = new Object();
    
    if (document.getElementById('subRev').value) {
        subjObj._rev = document.getElementById('subRev').value;
    }
    if (document.getElementById('subId').value) {
        subjObj._id = document.getElementById('subId').value;
    }

    subjObj.fullname = document.getElementById('e_subName').value;
    subjObj.shortname = document.getElementById('e_subShortName').value;
    if(document.getElementById('e_subColor').value){
        subjObj.color = document.getElementById('e_subColor').value;
    }else{
        subjObj.color = getRandColor();
    }
    subjObj.summary = document.getElementById('e_subSummary').value;
    subjObj.startDate = strToDate(document.getElementById('e_subStartDate').value);
    subjObj.endDate = strToDate(document.getElementById('e_subEndDate').value);
    subjObj.teacher = document.getElementById('e_subTeacher').value;
    subjObj.links = document.getElementById('e_subLinks').value;

    subjObj.type = 'subj';
    }
    
    if (!verifySubjFields(subjObj)) {
        alert("Subject data not valid");
        temp_show('error', "Subject Field verification error");
        return;
    }
    
    
    var callbackSubj = function callback(err, result) {
        if (!err) {
            console.log('Successfully saved a subj!');
            temp_show('success', 'Successfully saved a subj');
            getSubj();
            $.ui.loadContent("#viewSubjectList");
        } else {
            console.log('Unable to save data!');
            alert('Could not save the subj(' + err + ')');
        }
    };

    postDbObj(subjObj, callbackSubj);

}

function callBackAllSubs(err, response) {
            if (!err) {
                //console.log(response);
                redrawSubjectUI(response);
            } else {
                console.log('Unable to fetch data for subjects!');
                console.log(err);
                alert('Could not fetch subject data(' + err + ')');
            }

        }
function callBackSomeSubs(err, response) {
            if (!err) {

                /*
                 * Got the subjname, so it is safe to init Notes.
                 */
                initNote();

                /*
                 * check if there was any subj object with the correspondind subjname,
                 * already in the db. If not then open the editSubject panel for
                 * the subj to enter details.
                 */
                if (response.total_rows < 1 || response.length === 0) {
                    console.log("No Subj found.");
                    $.ui.loadContent("#editSubject");
                    return;
                }

                /*
                 * A subj obj was found in the db, so redraw the profile UI with data
                 * from this obj. If for some reason the data does not pass verification
                 * tests open the edit interface for the subj, else open the main options
                 * now.
                 */
                redrawSubjectUI(response[0]);
                console.log("Subject fields updated");

            } else {
                console.log('Unable to fetch data!');
                console.log(err);
                alert('Could not fetch subj data(' + err + ')');
            }
        }

//Get Nodes sorted by finish date.
function getSubj(name) {
    if (typeof (name) === 'undefined' || name === null || name === '') {
        getObjByType('subj', '', '', null, null, callBackAllSubs);
    } else {
        getObjByType('subj', 'string', 'fullname', subjname, null, callBackSomeSubs);
    }

}

function verifySubjFields(subjObj) {
    //console.log("subjname="+subjname);
    
    if(typeof(subjObj)!=='undefined'){
        if(subjObj.fullname!=='undefined' || subjObj.fullname !== ''){
            if(subjObj.shortname!=='undefined'|| subjObj.shortname!== ''){
                if(subjObj.color!=='undefined'|| subjObj.color!== ''){
                    if(subjObj._id && !subjObj._rev){
                           
                    }else{
                        console.log("id("+subjObj._id+") is set but"+
                                " not the rev field("+subjObj._rev+"). This will result in conflict while updating");
                    }
                    
                    return true;
                }else{
                    
                console.log("color not set");
            }
            }else{
              console.log("shortname not set");
           }
        }else{
              console.log("fullname not set");
        }
    }
    return false;
    
}
function addSubjEventListeners() {

    $('#editSubjectForm').submit(function(e) {
        e.preventDefault();
        alert('saving subj');
        saveSubj(null);
    });
}

function initSubs(){
    console.log("fetching all subjects");
    getSubj();
}