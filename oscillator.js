var oscillator = {

  start: function(lx) {
    var color = lastBuildColor;

    var change = function() {
      if(color == lastBuildColor) {
        color = currentBuildColor;
      }
      else {
        color = lastBuildColor;
      }

      lx.lightsColour.apply( lx, color );
    };

    setInterval( change, 2500 );
  }
}

module.exports = oscillator;