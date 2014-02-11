var util = require('util');
var sync = require('./sync-srv.js'),
async = require('async'),
csv = require('csv');
_ = require('underscore');
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

exports.createDummyData = function(params, callback){



}


exports.populateItems = function (params, callback) {

    var writeFuncs = [];

    $fh.db({
        'act': 'deleteall',
        'type': 'myDataSet'
    }, function(err) {
        if (err) {
            console.log( err);
        } else {
            console.log('Successfully deleted items');

            var entries = [];

            csv().from.path(__dirname + '/data/items.csv', {
                delimiter: ','
            })
                .to.array(function(data) {
                    entries = data;
                })
                .on('end', function(count) {
                    console.log('Number of items: ' + count + ' ' + entries.length);
                    _.each(entries, function(item) {
                    	console.log(item);
                        writeFuncs.push(createWrite(item));
                    });
                    // We have to execute the creates in series because of a bug in fh mongo (race condiction create collection)
                    async.series(writeFuncs);
                });
        }
    });
    callback(null,'{"status":"success"}');

    function createWrite(item) {
        // return closure with specific usrn
        return function(callback) {
            $fh.db({
                act: 'create',
                type: 'myDataSet',
                fields: {
                    name: item[0],
                   
                }
            }, function(err) {
                if (err) {
                    console.log( err);
                }
                callback(null);
            });
        };
    }

};