'use strict';

/*
 * Global Variables
 */
var db;
var remoteCouch = false;
var gObjType = '';
var couchServerIP = '10.23.72.204';
//var syncDom = document.getElementById('sync-wrapper');


function initDb() {
    if (typeof (db) === 'undefined' || db === null) {
        if (isValid(username)) {
            console.log('Starting DB');
            var dbname = 'notes' + username;
            db = new PouchDB(dbname);
            remoteCouch = 'http://'+couchServerIP+':5984/'+dbname;
            db.info(function(err, info) {
                db.changes({
                    since: info.update_seq,
                    live: true
                }).on('change', getAllNotes);
            });

            return true;

        } else {
            console.log("Invalid Username");
            temp_show("error", "Invalid Username");
            return false;
        }
    }
    if (remoteCouch) {
        sync();
    }
    return true;

}

function postDbObj(obj, callback) {
    if (!initDb())
        return;
    if (obj._id) {
        //console.log("using put");
        db.put(obj, callback);
    } else {
        db.post(obj, callback);
    }
}

function getObjByType(objType, cmpType, cmpKey, minValue, maxValue, callback) {
    if (!initDb())
        return;
    /*
     * Global values inside the map function cause errors, so using the 
     * longer and dirtier method.
     */
    //gObjType = objType;
   
    // emit cobjType documents
    function mapUser(doc) {
        if (doc.type && doc.type === 'user') {
            console.log(doc);
            emit(doc, null);
        }
    }
    function mapNote(doc) {
        if (doc.type && doc.type === 'note') {
            console.log(doc);
            emit(doc, null);
        }
    }
    function mapSubj(doc) {
        if (doc.type && doc.type === 'subj') {
            console.log(doc);
            emit(doc, null);
        }
    }
    // filter results
    function filterDate(err, response) {
        if (err)
            return callback(err);

        var matches = [];

        response.rows.forEach(function(doc) {
            //console.log("filtering resutls");
            //console.log("minValue="+minValue.toString());
            //console.log(doc.key[cmpKey]);
            var cmpVar = strToDate(doc.key[cmpKey]);
            //console.log(cmpVar);
            var isDoc = true;
            if ((minValue) && cmpVar >= minValue) {
                isDoc = true;
            } else if (cmpVar < minValue) {
                isDoc = false;
            }

            if ((maxValue) && cmpVar <= maxValue) {
                isDoc = true;
            } else if (cmpVar > maxValue) {
                isDoc = false;
            }
            if (isDoc) {
                matches.push(doc.key);
            }
        });
        callback(null, matches);
    }
    // filter results
    function filterStr(err, response) {
        if (err)
            return callback(err);
        //console.log(response);
        var matches = [];
        if (typeof (cmpKey) === 'undefined' || cmpKey === '') {
            matches = response.rows;
        } else {
            response.rows.forEach(function(doc) {
                //console.log("filtering resutls");
                //console.log(minValue);
                //console.log(doc.key[cmpKey]);
                var cmpVar = doc.key[cmpKey];
                console.log(cmpVar);
                var isDoc = true;

                if ((minValue) && !(maxValue) && cmpVar == minValue) {
                    isDoc = true;
                } else {
                    if ((minValue) && cmpVar >= minValue) {
                        isDoc = true;
                    } else if (cmpVar < minValue) {
                        isDoc = false;
                    }

                    if ((maxValue) && cmpVar <= maxValue) {
                        isDoc = true;
                    } else if (cmpVar > maxValue) {
                        isDoc = false;
                    }
                }
                if (isDoc) {
                    matches.push(doc.key);
                }
            });
        }
        callback(null, matches);
    }

    if (objType === '') {
        console.log('Key(' + objType + ') was empty, fetching all docs.');
        db.allDocs({include_docs: true, descending: true}, callback);
    } else {
        var mapFun = mapUser;
        if(objType==='note')mapFun=mapNote;
           else if(objType==='subj')mapFun=mapSubj;
        // kick off the PouchDB query with the map & filter functions above
        if (cmpType === 'string' || cmpType === '') {
            db.query({map: mapFun}, {reduce: false}, filterStr);
        } else if (cmpType === 'date') {
            db.query({map: mapFun}, {reduce: false}, filterDate);
        } else {
            console.log("filter method not defined for" + objType);
            callback(null, []);
        }
    }
}

function removeFromDb(obj) {
    if (!initDb())
        return;
    db.remove(obj);
}

// There was some form or error syncing
function syncError() {
    document.getElementById('sync-wrapper').setAttribute('data-sync-state', 'error');
    //alert('Sync Error');
}

// Initialise a sync with the remote server
function sync() {
  document.getElementById('sync-wrapper').setAttribute('data-sync-state', 'syncing');
  var opts = {live: true};
  db.replicate.to(remoteCouch, opts, syncError);
  db.replicate.from(remoteCouch, opts, syncError);
}
    