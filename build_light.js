var https   = require('https'),
    request = require('request'),
    lifx    = require('lifx');

var INTERVAL = 5000;

var urls = ['http://my-jenkins-host/job/api/json'];


var Queue = {
  _queue: [],

  add: function(fn) {
    var onDone = function() {
      setTimeout(Queue.next, INTERVAL);
    };

    Queue._queue.push( fn.bind(fn, onDone) );
  },

  next: function() {
    var fn = Queue._queue.shift();
    if(fn) fn();
  }

};

var poll = function(url) {
  var params = requestParamsFor(url);
  Queue.add(

    function(done) {
      var continuePolling = function() {
        poll(url);
        done();
      };

      console.log('\nFetching: ' + params.uri);
      request.get(params, function(err, resp) {
        if(err) {
          console.log("ERROR Fetching the Job from Jenkins:", err);
          lx.lightsColour(0x2211, 0xffff, 1000, 0, 0); // dim yellow
          return continuePolling();
        }

        handle(JSON.parse(resp.body), continuePolling);
      });
    }

  );
};

var handle = function(data, done) {
  var latest = data.builds[0];
  if(!latest) return done();

  request.get(requestParamsFor(latest.url+'/api/json'), function(err, resp) {
    if(err) {
      console.log("ERROR fetching Build from Jenkins:", err);
      return done();
    }

    build = JSON.parse(resp.body);
    console.log("--BUILD:", build.fullDisplayName, ' Status:', build.result);

    switch(build.result){

      case "FAILURE":
        lx.lightsColour(0x0000, 0xffff, 1000, 0, 0); // dim red
        break;

      case "SUCCESS":
        lx.lightsColour(0x3311, 0xffff, 1000, 0, 0); // dim green
        break;

      default:
        lx.lightsColour(0xcc15, 0xffff, 1000, 0, 0); // dim purple
        break;
    };

    done();
  });
};

var requestParamsFor = function(url) {
  return {
    uri:  url,
    timeout: 15000
  };
};

console.log('\n\nBuild light =============== \n\n');

var lx = lifx.init();
lx.on('bulb', function(b) {
  console.log('found bulb', b.name);
  urls.forEach(poll);
  Queue.next();
});


