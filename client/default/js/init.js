/*
JSON is automatically included with each app.

Use the $fh.ready() (http://docs.feedhenry.com/wiki/Ready) function to trigger 
loading the local config and binding a click event to invoke the cloud action 
call which will return the remote config.
*/
var sync = $fh.sync;
var datasetId = 'myDataSet';
$fh.ready(function() {


  // Setup the update button, div is hidden at startup

  document.getElementById('updateField').onclick = function() {
    document.getElementById('syncEdit').style.display = "none";
    var obj = {};
    var guidToUpdate = document.getElementById('guid').value;
    obj.name = document.getElementById('synctext').value;
    console.log('Editing ' + guidToUpdate);
    sync.doUpdate(datasetId, guidToUpdate, obj, 
      function(res){
        console.log('updated "'+ res.pre.name + '"" to "' + res.post.name +'"');
      }, 
      function(err){
        console.log('Not updated');
        console.log(err);

      })
  }

  // Initialize the Sync Service.
  sync.init({});
  // Provide handler function for receiving notifications from sync service - e.g. data changed
  sync.notify(handleSyncNotifications);
  // Get the Sync service to manage the dataset called "myDataSet"
  sync.manage(datasetId, {});

});

function handleSyncNotifications(notification) {
  if ('sync_complete' == notification.code) {
    datasetHash = notification.uid;
    sync.doList(datasetId, self.handleListSuccess, self.handleListFailure);
  }
}


function handleListFailure(notification){

  console.log('List failure');

}


function handleListSuccess(notification){
  var html = '<ul class="container">';
  //console.log(notification);
  for (var key in notification) {
    var obj = notification[key];

    html += '<a href="#" onclick="return editItem(\''+ key + '\')"><li class="item">' + obj.data.name + '</li></a>';
  }
  html += "</ul>";
  document.getElementById('syncResult').innerHTML = html;

}

function editItem(itemid){

  console.log(itemid);
  document.getElementById('syncEdit').style.display = "block";
  document.getElementById('guid').value = itemid;
  sync.doRead(datasetId, itemid, function(res){
    document.getElementById('synctext').value = res.data.name;
  }, function(err){})

}

