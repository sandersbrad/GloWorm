(function () {
  if(window.Game === undefined) {
     window.Game = {};
  }
  var Game = window.Game;

  var Snake = Game.Snake = function(){
    this.segments = [[0,0], [0,1], [0,2], [0,3]];
    this.vec = [0,1];
    this.head = this.segments[this.segments.length-1];
    this.applesEaten = 0;
    this.interval = 150;
    this.changeInterval = false;
    this.score = 0
  };

  Snake.DIRECT = ["N","E","S","W"];

  Snake.prototype.move = function() {
    this.checkIfAppleEaten();
    this.checkCollision();
    var vec = this.vec;
    var segs = this.segments;
    var newHead = [this.head[0] + vec[0], this.head[1] + vec[1]];

    segs.push(newHead);
    this.head = newHead;
    segs.shift();
  };

  Snake.prototype.eatApple = function () {
    this.placeApple();
    this.applesEaten += 1;
    this.score += 10;
    var i = 2;
    var vec = this.vec;
    while (i > 0) {
      var newTail = [this.head[0] - vec[0], this.head[1] - vec[1]];
      this.segments.unshift(newTail);
      i -= 1;
    }
    if (this.applesEaten % 3 === 0 && this.interval > 40) {
      this.interval -= 20;
      this.changeInterval = true;
    } else {
      this.changeInterval = false;
    }
  };

  Snake.prototype.checkIfAppleEaten = function () {
    if (this.head.equals(this.apple)) {
      this.eatApple();
    }
  };

  Snake.prototype.outOfBounds = function () {
    if (this.head[0] < 0 || this.head[1] < 0 || this.head[0] >= 40 || this.head[1] >= 40) {
      alert('You Lose');
      this.endGame = true;
    }
  };

  Snake.prototype.checkCollision = function () {
    this.outOfBounds();
    this.segments.slice(0,this.segments.length - 1).forEach(function (segment) {
      if (segment.equals(this.head)) {
        alert('You Lose');
        this.endGame = true;
      }
    }.bind(this));
  };

  Snake.prototype.placeApple = function () {
    $('div').removeClass('apple');
    var x = parseInt(Math.random() * 39);
    var y = parseInt(Math.random() * 39);
    var pos = [x, y];
    this.segments.forEach(function (segment) {
      if (segment.equals(pos)) {
        this.placeApple();
      }
    }.bind(this));
    this.apple = pos;

    $("div[pos = '" + pos + "']").addClass("apple");
  };

  Snake.prototype.turn = function(direction) {
    if ( direction === undefined ) {
      direction = Snake.DIRECT[Math.random() * 4];
    }

    switch (direction) {
      case "N":
        this.vec = [-1, 0];
        break;
      case "E":
        this.vec = [0, 1];
        break;
      case "S":
        this.vec = [1, 0];
        break;
      case "W":
        this.vec = [0, -1];
        break;
      default:
        vec = [0, 0];
    }
  };

  var Game = Game.Game = function() {
    new Snake();
  };


})();
