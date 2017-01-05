var filters = [
  // RegEx match against the raw contents of the email
  // { name: 'user emails', match: /deliveredto:user@domain.com/, star: true }, // star emails deliveredto user@domain.com
  
  // use a RegEx selector ([\s\S]+?) to set the label name
  // the odd usage of [\s\S] is to emulate multiline matching.
  // see http://stackoverflow.com/a/1068308/869502
  // Ex: 
  //      List-Id: Hibernate Dev List <hibernate-dev.lists.jboss.org>
  { id: "First Filter", match: /(?:List-ID:\s([\s\S]+?)\s<)/i, archive: true }, // organize by list name 

  // use a RegEx selector ([\s\S]+?) to set the label name
  // the odd usage of [\s\S] is to emulate multiline matching.
  // see http://stackoverflow.com/a/1068308/869502
  // Ex: 
  //      List-Id: <users.activemq.apache.org>
   { id: "Second Filter", match: /(?:List-ID:\s*<([\s\S]+?)>)/i, archive: true }, // organize by list name 

  
  // use the subject shortcut to check the subject for text
  // { name: 'finance', subject: 'bank', markRead: true }, // label all emails with "bank" in the subject as "finance" and mark as read

];

var from = [
  // "from:email@domain.com",
  // "list:subscription.domain.com"
];

var ROOT_FOLDER = "OSS/";
var SELECTION = "-label:OSS-personal AND (label:OSS)";

function labeler() {

  var batchSize = 50;
  var labelCache = {};
  var query = "in:inbox AND (" + from.join(' OR ') + ")";
  if (SELECTION) {
    query += " AND (" + SELECTION + ")";
  }
  var threads = GmailApp.search(query, 0, batchSize);
  GmailApp.getMessagesForThreads(threads);

  var findOrCreateLabel = function(name) {
    if (labelCache[name] === undefined) {
      var labelObject = GmailApp.getUserLabelByName(name);
      if( labelObject ){
        labelCache[name] = labelObject;
      } else {
        labelCache[name] = GmailApp.createLabel(name);
        Logger.log("Created new label: [" + name + "]");
      }
      
    }
    return labelCache[name];
  }

  var applyLabel = function(name, thread){
    name = ROOT_FOLDER + name;
    
    var label = null;
    var labelName = "";

    // create nested labels by parsing "/"
    name.split('/').forEach(function(labelPart, i) {
      labelName = labelName + (i===0 ? "" : "/") + labelPart.trim();
      label = findOrCreateLabel(labelName);
    });

    thread.addLabel(label);
  }

  threads.forEach(function(thread) {
    var messages = thread.getMessages();
    if (messages == null) 
      return; // nothing to do

    var message = messages[messages.length - 1]; // most recent message
    var body = message.getRawContent();
    var archive = true;
    Logger.log("Body: " + body);
    filters.forEach(function(filter){
      Logger.log("Applying filter: " + filter.id);
      // shortcuts
      if (filter.subject) 
        filter.match = new RegExp('Subject:.*?' + filter.subject, 'i');

      var matches = filter.match.exec(body);
      if (matches !== null) {

        // label will be regex match or name provided
        var label = filter.name || matches[1];
        if (label !== undefined) 
          applyLabel(label, thread);

        // toggle flags
        if (filter.star) 
          message.star();
        if (filter.markRead) 
          message.markRead();

        // prevent archive if filter explicitly sets "archive" to false (if "archive" is not defined, continue)
        if (filter.archive !== undefined && !filter.archive) 
          archive = false;
      }
    });

    if (archive) 
      thread.moveToArchive();
  });
}
