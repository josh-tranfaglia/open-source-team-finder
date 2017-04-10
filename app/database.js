import React from 'react';
import ReactDOM from 'react-dom';

var initialData = {
    // The 'user' collection; contains all the users in our system
    "users": {
        // This user has id "1" and it is Jane
        "1" : {
            "_id" : 1,
            "fullName" : "Jane Doe",
            // ID of Jane's feed
            "feed" : 1,
            // ID of Jane's Inbox
            "inbox" : 1,
            "skills" : ["Scala", "Node.js", "Agile Methodology"],
            "interests" : ["Finance", "Clean Energy"],
            "bio" : "Hi my name is Jane",
            "contact" : "myemail@email.com"
        },
        "2" : {
            "_id" : 2,
            "fullName" : "Joe Doe",
            // ID of Jane's feed
            "feed" : 2,
            // ID of Jane's Inbox
            "inbox" : 2,
            "skills" : ["Java", "Numerical Graphing", "Agile Methodology", "Management"],
            "interests" : ["Drones", "Robotics", "Sports"],
            "bio" : "Joe, a deer, a female deer, Ray, a drop of golden sun, Me, a name, etc.",
            "contact" : "JoesCarEmporiumComeOnDown@email.com"
        }
    },
    "project" : {
        "1":{
          "identifier" : "Okra",
          "id"         : 1,
          "updates"    : 1,
          "msgs"       : 1,
          "pos"        : 1,
          "description": "Welcome to the show",
          "skillz"     :["Java", "Social", "Sick Card Tricks"]

        },
        "2" : {
          "identifier" : "Apple",
          "id"         : 2,
          "updates"    : 2,
          "msgs"       : 2,
          "pos"        : 2,
          "description": "Nothing too fancy to do here.",
          "skillz"     :["Java", "Social", "Extreme Apple Picking", "High Level Design"]
        },
        "3" : {
          "identifier" : "Peach",
          "id"         : 3,
          "updates"    : 3,
          "msgs"       : 3,
          "pos"        : 3,
          "description": "We're looking for our friend James. We believe he is in the ocean and we need to develop good drones to find him.",
          "skillz"     :["Drones", "Artificial Intelligence", "Node.js", "Mongo"]
        },
        "4" : {
          "identifier" : "Garbanzo Bean",
          "id"         : 4,
          "updates"    : 4,
          "msgs"       : 4,
          "pos"        : 4,
          "description": "Our goal is too develop an onlign spell cheker that finds any errands you type.",
          "skillz"     :["Natural Language Processing", "Excel", "Java", "Regex"]
        }
    },
    "inbox" : {
        //null
    },
    "message" : {

    },
    "positions" : {

        "open_positions" :{

          "2":{
            "id"         : 2,
            "project_id" : 1,
            "status"     : "vacant",
            "title"      : "developer",
            "description": "develop things",
            "skillz"     : ["Java"]
          }
        },

        "filled_positions":{
          "1":{
            "id"         : 1,
            "project_id" : 1,
            "status"     : "filled",
            "title"      : "developer",
            "description": "develop things",
            "skillz"     : ["Java"]
          }
        }

    },
    "updates" : {

    },
    "feeds" :{

    },
    "feed-item" : {
  

    }
};

var data = JSON.parse(localStorage.getItem('facebook_data'));
if (data === null) {
  data = JSONClone(initialData);
}

/**
 * A dumb cloning routing. Serializes a JSON object as a string, then
 * deserializes it.
 */
function JSONClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Emulates reading a "document" from a NoSQL database.
 * Doesn't do any tricky document joins, as we will cover that in the latter
 * half of the course. :)
 */
export function readDocument(collection, id) {
  // Clone the data. We do this to model a database, where you receive a
  // *copy* of an object and not the object itself.
  return JSONClone(data[collection][id]);
}

/**
 * Emulates writing a "document" to a NoSQL database.
 */
export function writeDocument(collection, changedDocument) {
  var id = changedDocument._id;
  // Store a copy of the object into the database. Models a database's behavior.
  data[collection][id] = JSONClone(changedDocument);
  // Update our 'database'.
  localStorage.setItem('facebook_data', JSON.stringify(data));
}

/**
 * Adds a new document to the NoSQL database.
 */
export function addDocument(collectionName, newDoc) {
  var collection = data[collectionName];
  var nextId = Object.keys(collection).length;
  while (collection[nextId]) {
    nextId++;
  }
  newDoc._id = nextId;
  writeDocument(collectionName, newDoc);
  return newDoc;
}

/**
 * Reset our browser-local database.
 */
export function resetDatabase() {
  localStorage.setItem('facebook_data', JSON.stringify(initialData));
  data = JSONClone(initialData);
}

/**
 * Reset database button.
 */
class ResetDatabase extends React.Component {
  render() {
    return (
      <button className="btn btn-default" type="button" onClick={() => {
        resetDatabase();
        window.alert("Database reset! Refreshing the page now...");
        document.location.reload(false);
      }}>Reset Mock DB</button>
    );
  }
}

// ReactDOM.render(
//   <ResetDatabase />,
//   document.getElementById('fb-db-reset')
// );
