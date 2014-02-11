var util = require('util');
var sync = require('./sync-srv.js');
/* main.js
 * All calls here are publicly exposed as REST API endpoints.
 * - all parameters must be passed in a single JSON paramater.
 * - the return 'callback' method signature is 'callback (error, data)', where 'data' is a JSON object.
*/




/*  Implement sync framework
*/
var dataset_id = 'myDataSet';
exports.myDataSet = function(params, callback) {
  sync.invoke(dataset_id, params, callback);
};

var dataHandler = require('./dataHandler.js');


sync.init(dataset_id, {}, function() {
  sync.handleList(dataset_id, dataHandler.doList);
  sync.handleCreate(dataset_id, dataHandler.doCreate);
  sync.handleRead(dataset_id, dataHandler.doRead);
  sync.handleUpdate(dataset_id, dataHandler.doUpdate);
  sync.handleDelete(dataset_id, dataHandler.doDelete);
  sync.handleCollision(dataset_id, dataHandler.doCollision);
  sync.listCollisions(dataset_id, dataHandler.listCollisions);
  sync.removeCollision(dataset_id, dataHandler.removeCollision);
});


