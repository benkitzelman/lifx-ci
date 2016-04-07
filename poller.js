var request = require('request'),
    Colors  = require('./colors'),
    Queue   = require('./queue');

var handle = function(data, done) {
  var latest = data.builds[0];
  if(!latest) return done();

  request.get(requestParamsFor(latest.url+'/api/json'), function(err, resp) {
    if(err) {
      console.log("ERROR fetching Build from Jenkins:", err);
      return done();
    }

    var build  = JSON.parse(resp.body);
    console.log("--BUILD:", build.fullDisplayName, ' Status:', build.result, ' Building:', build.building);

    switch(build.result){

      case "FAILURE":
        lastBuildColor = Colors.RED;
        break;

      case "SUCCESS":
        lastBuildColor = Colors.GREEN;
        break;

      default:
        currentBuildColor = Colors.PURPLE;
        break;
    };

    if(build.building) {
      currentBuildColor = Colors.PURPLE;
    }
    else {
      currentBuildColor = lastBuildColor;
    }

    done();
  });
};

var requestParamsFor = function(url) {
  var bits = url.match(/(.+:\/\/)(.*)/)

  return {
    uri:  bits[1] + auth + "@" + bits[2],
    timeout: 15000
  };
};

var poll = function(lx, Queue, url) {
  var params = requestParamsFor( url );
  Queue.add(

    function(done) {
      var continuePolling = function() {
        poll( lx, Queue, url );
        done();
      };

      console.log('\nFetching: ', params);
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

module.exports = poll;