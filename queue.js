var Queue = function() {
  this.interval = 5000;
  this.queue    = [];
  var self      = this;

  Queue.prototype.add = function(fn) {
    var onDone = function() {
      setTimeout(self.next, self.INTERVAL);
    };

    self.queue.push( fn.bind(fn, onDone) );
  };

  Queue.prototype.next = function() {
    var fn = self.queue.shift();
    if(fn) fn();
  };

};


module.exports = Queue;