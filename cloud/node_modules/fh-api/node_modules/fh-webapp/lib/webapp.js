var sys = require('./sys.js'),
cloud = require('./cloud/cloud.js'),
mbaas = require('./mbaas.js');

var appname = process.env.FH_APPNAME || 'NO-APPNAME-DEFINED';
process.title = "fh-" + appname;

module.exports = {
  sys :  sys,
  mbaas : mbaas,
  cloud : cloud
};