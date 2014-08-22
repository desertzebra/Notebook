'use strict'

function editProfile() {
    $.ui.loadContent("#editProfile");
}

function redrawProfileUI(user) {
    //initDb();

    //console.log("got user::::::");
    //console.log(user);
    document.getElementById('myName').innerHtml = user.fullname;
    document.getElementById('e_myName').value = user.fullname;
    console.log(document.getElementById('e_myName').value);
    document.getElementById('myPlace').innerHtml = (user.place) ? user.place : '-';
    document.getElementById('e_myPlace').value = (user.place) ? user.place : '-';

    document.getElementById('myDob').innerHtml = (user.dob) ? getDateStr(user.dob) : '';
    document.getElementById('e_myDob').value = (user.dob) ? getDateStr(user.dob) : '';

    var gender = document.getElementsByName('gender');

    for (var i = 0; i < gender.length; i++) {
        if (gender[i].value == user.gender) {
            gender[i].checked = true;
        }
    }

    document.getElementById('myEmail').innerHtml = (user.email) ? user.email : '-';
    document.getElementById('e_myEmail').value = (user.email) ? user.email : '-';

    document.getElementById('myHobbies').innerHtml = (user.hobbies) ? user.hobbies : '-';
    document.getElementById('e_myHobbies').value = (user.hobbies) ? user.hobbies : '-';

    document.getElementById('myWebsite').innerHtml = (user.website) ? user.website : '-';
    document.getElementById('e_myWebsite').value = (user.website) ? user.website : '-';

    document.getElementById('myLinks').innerHtml = (user.links) ? user.links : '-';
    document.getElementById('e_myLinks').value = (user.links) ? user.links : '-';

    document.getElementById('myText').innerHtml = (user.text) ? user.text : '-';
    document.getElementById('e_myText').value = (user.text) ? user.text : '-';

    document.getElementById('myNumber').innerHtml = (user.number) ? user.number : 'XXX-XXX-XXXX';
    document.getElementById('e_myNumber').value = (user.number) ? user.number : 'XXX-XXX-XXXX';
    //console.log("username="+username);
    document.getElementById('e_myUsername').value = username;
    document.getElementById('e_myUsername').disabled = true;

    if (user._rev) {
        document.getElementById('profileRev').value = user._rev;
    }


}

function editUser(userObj) {
    if (typeof (userObj) === 'undefined' || userObj === null) {
        userObj = new Object();
    }
    if (!verifyUserFields()) {
        alert("User data not valid");
        temp_show('error', "User Field verification error");
        return;
    }

    userObj._id = username;

    if (document.getElementById('profileRev').value) {
        userObj._rev = document.getElementById('profileRev').value;
    }

    console.log(userObj._rev);

    userObj.fullname = document.getElementById('e_myName').value;

    userObj.dob = strToDate(document.getElementById('e_myDob').value);


    var gender = document.getElementsByName("gender");
    for (var i = 0; i < gender.length; i++) {
        if (gender[i].checked == true) {
            userObj.gender = gender[i].value;
        }
    }

    userObj.place = document.getElementById('e_myPlace').value;
    userObj.number = document.getElementById('e_myNumber').value;
    userObj.email = document.getElementById('e_myEmail').value;
    userObj.hobbies = document.getElementById('e_myHobbies').value;
    userObj.text = document.getElementById('e_myText').value;
    userObj.website = document.getElementById('e_myWebsite').value;
    userObj.links = document.getElementById('e_myLinks').value;
    userObj.type = 'user';
    alert("user obj:");
    //console.log(userObj);
    var callbackUser = function callback(err, result) {
        if (!err) {
            console.log('Successfully saved a user!');
            temp_show('success', 'Successfully saved a user');
            getUser('#mainOptions');
            //$.ui.loadContent("#viewProfile");
        } else {
            console.log('Unable to save data!');
            alert('Could not save the user(' + err + ')');
        }
    };

    postDbObj(userObj, callbackUser);

}

//Get Nodes sorted by finish date.
function getUser(retTo) {

    getObjByType('user', 'string', '_id', username, null, function(err, response) {
        if (!err) {



            /*
             * check if there was any user object with the correspondind username,
             * already in the db. If not then open the editProfile panel for
             * the user to enter details.
             */
            if (response.total_rows < 1 || response.length === 0) {
                console.log("No User found.");
                document.getElementById('e_myUsername').value = username;
                document.getElementById('e_myUsername').disabled = true;
                $.ui.loadContent("#editProfile");
                return;
            }

            /*
             * Got the username, so it is safe to init Notes.
             */
            initNote();
            initSubs();

            /*
             * A user obj was found in the db, so redraw the profile UI with data
             * from this obj. If for some reason the data does not pass verification
             * tests open the edit interface for the user, else open the main options
             * now.
             */
            redrawProfileUI(response[0]);
            console.log("profile fields updated");


            console.log(retTo);
            if (verifyUserFields()) {
                if (typeof (retTo) !== 'undefined' && retTo !== null && document.getElementById(retTo) !== null) {
                    $.ui.loadContent(retTo);

                } else {
                    document.getElementById('e_myUsername').value = username;
                    document.getElementById('e_myUsername').disabled = true;
                    $.ui.loadContent("#mainOptions");
                }
            }

        } else {
            console.log('Unable to fetch data!');
            console.log(err);
            alert('Could not fetch user data(' + err + ')');
        }
    });

}

function verifyUserFields() {
    //console.log("username="+username);
    if (!isValid(username)) {
        $.ui.loadContent("#login");
    }
    console.log(document.getElementById('e_myName').value);
    if (document.getElementById('e_myName').value === '') {
        temp_show("error", "Name cannot be empty");
        console.log("Name cannot be empty");
        return false;
    }
    return true;
}
function addUserEventListeners() {
    $('#loginForm').submit(function(e) {
        e.preventDefault();
        username = $('#username').val();
        console.log(username);
        if (!isValid(username)) {
            alert(username + " is not a valid username.");
            $.ui.loadContent("#login");
        } else {

            getUser(null);
        }

    });

    $('#editProfileForm').submit(function(e) {
        e.preventDefault();
        alert('saving user');
        editUser(null);
    });
}