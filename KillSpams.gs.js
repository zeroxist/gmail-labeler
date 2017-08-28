var searchIn = 'in:anywhere';

var from =
[
  "from:(.com OR .net OR .org)"
];

function KillSpams()
{
  var threadCount = 100;

  var query =
    searchIn +
    (searchIn.length > 0 ? " AND (" : "") +
    from.join(' OR ') +
    (searchIn.length > 0 ? ")" : "");

  var threads = GmailApp.search(query, 0, 500);

  threads.forEach
  (
    function (thread)
    {
      var messages = thread.getMessages();

      if (messages == null)
        return;

      var message = thread.getMessages()[0];

      var messageFromCheck = new RegExp('\<(([0-9]+)\.([a-zA-Z0-9]+)\@([a-zA-Z]+)\.([a-zA-Z]{3}))\>', 'igm').exec(message.getFrom());
    
      if (messageFromCheck !== null)
      {
        Logger.log('Matched: {' + messageFromCheck[1] + '}');

        thread.moveToTrash();
      } 
    }
  );
}