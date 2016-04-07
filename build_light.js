var https      = require('https'),
    request    = require('request'),
    lifx       = require('lifx'),
    Colors     = require('./colors'),
    Queue      = require('./queue'),
    Oscillator = require('./oscillator'),
    Poller     = require('./poller');

var BASE_URL = process.env.URL || 'https://MY_CI_URL.com'
GLOBAL.currentBuildColor = Colors.PURPLE;
GLOBAL.lastBuildColor    = Colors.PURPLE;

// TODO: handle the auth with Jenkins - til then, log into Jenkins via web, click on
// your profile, click configure, then click show api token.
// auth = [user_name]:[api_token]
GLOBAL.auth = process.env.AUTH || "my_jenkins_user_name:my_jenkins_api_token";
GLOBAL.urls = [ BASE_URL + "/api/json" ];

if( jobName = process.env.JOB ) {
  GLOBAL.urls = [ BASE_URL + '/job/' + jobName + '/api/json' ];
}

console.log('\n\nBuild light =============== \n\n');

var lx    = lifx.init();
var queue = new Queue();
var poll  = Poller.bind( Poller, lx, queue );

lx.on('bulb', function(b) {
  console.log('Found bulb: ', b.name);

  Oscillator.start( lx );
  urls.forEach( poll );
  queue.next();
});


