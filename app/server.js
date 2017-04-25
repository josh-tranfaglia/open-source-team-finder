import {readDocument, writeDocument, addDocument} from './database.js';

/**
 * Emulates how a REST call is *asynchronous* -- it calls your function back
 * some time in the future with data.
 */
function emulateServerReturn(data, cb) {
  setTimeout(() => {
    cb(data);
  }, 4);
}

/**
 * Adds a new status update to the database.
 */
export function sendNewMessages(user, contents,cb) {
  // If we were implementing this for real on an actual server, we would check
  // that the user ID is correct & matches the authenticated user. But since
  // we're mocking it, we can be less strict.

  // Get the current UNIX time.
  var time = new Date().getTime();
  // The new status update. The database will assign the ID for us.
  var newMessages = {

      "author": user,
      "contents": contents,
      "side":"right"

  };

  // Add the status update to the database.
  // Returns the status update w/ an ID assigned.
  newMessages = addDocument('messages', newMessages);

  // Add the status update reference to the front of the current user's feed.
  var userData = readDocument('users', user);
  var inboxData = readDocument('inbox', userData.inboxId);
  var chatData = readDocument('chats', inboxData.chats);
  var messageData = readDocument('messages', chatData.messages);
  messageData.contents.unshift(newMessages._id);

  // Update the feed object.
  writeDocument('messages', messageData);

  // Return the newly-posted object.
  emulateServerReturn(newMessages, cb);
}

export function getInboxData(inbox_id, cb){
  var inboxData = readDocument('inbox', inbox_id);
  emulateServerReturn(inboxData, cb);
}

export function getMessageData(message_id, cb){
  var messageData = readDocument('messages', message_id);
  emulateServerReturn(messageData, cb);
}

export function getChatData(chat_id, cb){
  var chatData = readDocument('chats', chat_id);
  emulateServerReturn(chatData, cb);
}


export function getProjectData(project_id, cb){

  sendXHR('GET', '/user/1/projectid/'+project_id, undefined, (xhr) => {
   cb(JSON.parse(xhr.responseText));
 });

}


export function getUserInfo(user_id, cb) {
  var userData = readDocument('users', user_id);
  emulateServerReturn(userData, cb);
}


export function getMainFeedJobItemData(user, cb) {
  // Get the User object with the id "user".
  var userData = readDocument('users', user);
  // Get the Feed object for the user.
  var feedData = readDocument('feeds', userData.feed);
  // Map the Feed's FeedItem references to actual FeedItem objects.
  // Note: While map takes a callback function as an argument, it is
  // synchronous, not asynchronous. It calls the callback immediately.
  feedData.contents = feedData.contents.map(getMainFeedItemSync);
  // Return FeedData with resolved references.
  // emulateServerReturn will emulate an asynchronous server operation, which
  // invokes (calls) the "cb" function some time in the future.
  emulateServerReturn(feedData, cb);
}

function getMainFeedItemSync(feedItemId) {
  var feedItem = readDocument('feedItems', feedItemId);
  // Resolve 'like' counter.
  feedItem.likeCounter =
    feedItem.likeCounter.map((id) => readDocument('users', id));
  // Assuming a StatusUpdate. If we had other types of
  // FeedItems in the DB, we would
  // need to check the type and have logic for each type.
  feedItem.contents.author =
    readDocument('users', feedItem.contents.author);
  // Resolve comment author.
  feedItem.comments.forEach((comment) => {
    comment.author = readDocument('users', comment.author);
  });
  return feedItem;
}

export function getopen_positionData(pid, cb){
  sendXHR('GET', '/user/1/open/pos_id/'+pid, undefined, (xhr) => {
   cb(JSON.parse(xhr.responseText));
 });
}

export function getfilled_positionData(pid, cb){
  sendXHR('GET', '/user/1/filled/pos_id/'+pid, undefined, (xhr) => {
   cb(JSON.parse(xhr.responseText));
 });
}

export function getProfileData(id, cb){

  var profileData = readDocument('users', id);
  emulateServerReturn(profileData, cb);

}

export function getNotificationFeedData(user, cb) {
  // Get the User object with the id "user".
  var userData = readDocument('users', user);
  // Get the Feed object for the user.
  var feedData = readDocument('feeds', userData.feed);

  //This is a list... Should I change the way I save this????
  var notificationList = [];

  for(var i = 0; i < feedData.notificationItems.length; i ++ ) {
    notificationList.push(readDocument('notificationItems', feedData.notificationItems[i]));
  }
  emulateServerReturn(notificationList, cb)

}

export function getJobFeedData(user, cb) {
  // Get the User object with the id "user".
  var userData = readDocument('users', user);
  // Get the Feed object for the user.
  var feedData = readDocument('feeds', userData.feed);

  //This is a list... Should I change the way I save this????
  var jobList = [];
  for(var i = 0; i < feedData.jobItems.length; i ++ ) {
    jobList.push(readDocument('jobItems', feedData.jobItems[i]));
  }
  emulateServerReturn(jobList, cb)

}

export function getProjectUpdates(id, cb){
  sendXHR('GET', '/user/1/projectid/'+id, undefined, (xhr) => {
   cb(JSON.parse(xhr.responseText));
 });
}

//XHR HELPER FUNCTION
var token = 'eyJpZCI6NH0='; // <-- Put your base64'd JSON token here
/**
 * Properly configure+send an XMLHttpRequest with error handling,
 * authorization token, and other needed properties.
 */
function sendXHR(verb, resource, body, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(verb, resource);
  xhr.setRequestHeader('Authorization', 'Bearer ' + token);

  // The below comment tells ESLint that FacebookError is a global.
  // Otherwise, ESLint would complain about it! (See what happens in Atom if
  // you remove the comment...)
  /* global FacebookError */

  // Response received from server. It could be a failure, though!
  xhr.addEventListener('load', function() {
    var statusCode = xhr.status;
    var statusText = xhr.statusText;
    if (statusCode >= 200 && statusCode < 300) {
      // Success: Status code is in the [200, 300) range.
      // Call the callback with the final XHR object.
      cb(xhr);
    } else {
      // Client or server error.
      // The server may have included some response text with details concerning
      // the error.
      var responseText = xhr.responseText;
      SiteError('Could not ' + verb + " " + resource + ": Received " +  statusCode + " " + statusText + ": " + responseText);
    }
  });

  // Time out the request if it takes longer than 10,000
  // milliseconds (10 seconds)
  xhr.timeout = 10000;

  // Network failure: Could not connect to server.
  xhr.addEventListener('error', function() {
    SiteError('Could not ' + verb + " " + resource + ": Could not connect to the server.");
  });

  // Network failure: request took too long to complete.
  xhr.addEventListener('timeout', function() {
    SiteError('Could not ' + verb + " " + resource + ": Request timed out.");
  });

  switch (typeof(body)) {
    case 'undefined':
      // No body to send.
      xhr.send();
      break;
    case 'string':
      // Tell the server we are sending text.
      xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
      xhr.send(body);
      break;
    case 'object':
      // Tell the server we are sending JSON.
      xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
      // Convert body into a JSON string.
      xhr.send(JSON.stringify(body));
      break;
    default:
      throw new Error('Unknown body type: ' + typeof(body));
  }
}
