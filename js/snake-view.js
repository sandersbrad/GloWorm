(function () {
  if(window.Game === undefined){
    window.Game = {};
  }

  var Game = window.Game;

  Game.View = function (game, $board, $score, $highScore) {
    this.game = game;
    this.$board = $board;
    this.$score = $score;
    this.$highScore = $highScore;
    this.boardSize = 30;
    this.setBoard();
    this.bindKeyHandlers();
    this.render();
    $('.restart').click(this.replay.bind(this));
    this.setHighScore;
  };

  Game.View.prototype.setBoard = function () {
    var $board = this.$board;
    $board.empty();
     for (var i = 0; i < this.boardSize; i++) {
       for (var j = 0; j < this.boardSize; j++) {
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

  Game.View.prototype.setHighScore = function () {
    var highScore = Cookies.get('highscore');
    if (highScore !== undefined){
      this.$highScore.html(highScore);
    }
  };

  Game.View.prototype.replay = function () {
    this.game = new Game.Snake();
    this.$board.empty();
    this.$score.empty();
    this.setBoard();
    this.bindKeyHandlers();
    this.render();
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
    this.$score.html(this.game.score);
    this.checkInterval();
    this.checkLoss();
  };

  Game.View.prototype.checkInterval = function () {
    if (this.game.changeInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(this.run.bind(this), this.game.interval);
    }
  };

  Game.View.prototype.checkLoss = function () {
    if(this.game.endGame) {
      clearInterval(this.gameInterval);
      if (this.game.score > parseInt(this.$highScore.html())) {
        this.$highScore.html(this.game.score);
        Cookies.set('highscore', this.game.score, { expires: 7 });
        debugger
      }
    }
  };
})();
