(function () {
  if(window.Game === undefined){
    window.Game = {};
  }

  var Game = window.Game;

  Game.View = function (game, $board) {
    this.game = game;
    this.$board = $board;
    this.setBoard();
    this.bindKeyHandlers();
    this.render();
  };

  Game.View.prototype.setBoard = function () {
    console.log("set board called");
    var $board = this.$board;
     for (var i = 0; i < 20; i++) {
       for (var j = 0; j < 20; j++) {
         var $square = $('<div>').attr('pos', [i,j]).addClass('empty');
         $board.append($square);
       }
     }
  };

  Game.View.prototype.bindKeyHandlers = function () {
    var game = this.game;
    key('up', function () {
      game.turn("N");
    });
    key('down', function () {
      game.turn("S");
    });
    key('left', function () {
      game.turn("W");
    });
    key('right', function () {
      game.turn("E");
    });
  };

  Game.View.prototype.render = function () {
    this.game.placeApple();
    this.gameInterval = setInterval(this.run.bind(this), this.game.interval);
  };

  Game.View.prototype.run = function () {
    $("div").removeClass("display");
    for (var i = 0; i < this.game.segments.length; i++) {
      $("div[pos = '" + this.game.segments[i] + "']").addClass("display");
    }
    this.game.move();
    this.checkInterval();
  };

  Game.View.prototype.checkInterval = function () {
    if (this.game.changeInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.run.bind(this), this.game.interval);
    }
  };
})();
