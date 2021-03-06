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
    this.interval = 120;
    this.changeInterval = false;
    this.score = 0;
  };

  Snake.DIRECT = ["N","E","S","W"];

  Snake.prototype.move = function() {
    this.checkIfAppleEaten();
    this.checkCollision();
    this.placeBonus();
    var vec = this.vec;
    var segs = this.segments;
    var newHead = [this.head[0] + vec[0], this.head[1] + vec[1]];

    segs.push(newHead);
    this.head = newHead;
    segs.shift();
  };

  Snake.prototype.placeBonus = function () {
    if ((parseInt($('.seconds').html()) % 10 === 0) &&
        this.applesEaten > 0 &&
        this.applesEaten % 2 === 0 &&
        (parseInt($('.milliseconds').html()) === 0)){
      this.placePowerUp();
    }

    if ((parseInt($('.seconds').html()) % 25 === 0) &&
        this.applesEaten > 0 &&
       (parseInt($('.milliseconds').html()) === 0)) {
        this.placeBadApples();
    }
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
    if (this.applesEaten % 3 === 0 && this.interval > 40 && !this.changeInterval) {
      this.interval -= 10;
      this.changeInterval = true;
    } else {
      this.changeInterval = false;
    }
  };

  Snake.prototype.eatPowerUp = function () {
    $('div').removeClass('power-up');
    if (this.segments.length > 6) {
      this.segments = this.segments.splice(this.segments.length/2);
    }

    this.score += 20;
  };

  Snake.prototype.checkIfAppleEaten = function () {
    if (this.head.equals(this.apple)) {
      this.eatApple();
    }

    if (this.head.equals(this.powerUp)) {
      this.eatPowerUp();
    }

    this.badApples && this.badApples.forEach(function (badApple) {
      if (this.head.equals(badApple)) {
        this.eatBadApple();
      }
    }.bind(this));
  };

  Snake.prototype.outOfBounds = function () {
    if (this.head[0] < 0 || this.head[1] < 0 || this.head[0] >= 40 || this.head[1] >= 40) {
      this.endGame = true;
    }
  };

  Snake.prototype.eatBadApple = function () {
    $('div').removeClass('bad-apple')
    this.score -= 20;
    this.badApples = [];
    var i = this.segments.length;
    var vec = this.vec;
    while (i > 0) {
      var newTail = [this.head[0] - vec[0], this.head[1] - vec[1]];
      this.segments.unshift(newTail);
      i -= 1;
    }
  };

  Snake.prototype.checkCollision = function () {
    this.outOfBounds();
    this.segments.slice(0,this.segments.length - 1).forEach(function (segment) {
      if (segment.equals(this.head)) {
        this.endGame = true;
      }
    }.bind(this));
  };

  Snake.prototype.placeBadApples = function () {
    if ($('div').hasClass('bad-apple')) {
      return;
    }
    this.badApples = [];

    var i = 5
    while (i > 0) {
      var x = parseInt(Math.random() * 39);
      var y = parseInt(Math.random() * 39);
      var pos = [x, y];

      if ($("div[pos = '" + pos + "']").attr('class') !== 'empty') {
        return;
      }

      $("div[pos = '" + pos + "']").addClass('bad-apple');
      this.badApples.push(pos);
      console.log(this.badApples);
      i -= 1;
    }

    setTimeout(function () {
      $('div').removeClass('bad-apple');
      this.badApples = [];
    }, 7000);
  }

  Snake.prototype.placeApple = function () {
    $('div').removeClass('apple');
    var x = parseInt(Math.random() * 39);
    var y = parseInt(Math.random() * 39);
    var pos = [x, y];
    if ($("div[pos = '" + pos + "']").attr('class') !== 'empty') {
      this.placeApple();
      return;
    }
    this.apple = pos;

    $("div[pos = '" + pos + "']").addClass("apple");
  };

  Snake.prototype.placePowerUp = function () {
    if ($('div').hasClass('power-up')) {
      return;
    }
    $('div').removeClass('power-up');
    var x = parseInt(Math.random() * 39);
    var y = parseInt(Math.random() * 39);
    var pos = [x, y];
    if ($("div[pos = '" + pos + "']").attr('class') !== 'empty') {
      this.placePowerUp();
      return;
    }
    this.powerUp = pos;

    $("div[pos = '" + pos + "']").addClass("power-up");
    setTimeout(function () {
      $('div').removeClass('power-up');
    }, 7000);
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
