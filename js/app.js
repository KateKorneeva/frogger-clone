var trackWidth = 101;
var trackHeight = 83;
var la = true;


// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.firstTrackY = 76;
    this.dTrack = trackHeight;
    this.startBug();
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.dx;
    if (this.x > canvas.width) {
        this.startBug();
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Bug speed randomization
Enemy.prototype.randomizeSpeed = function(min, max) {
    return randomize(min,max);
}

// Randomization of road choice
Enemy.prototype.randomizeRoad = function() {
    var track = randomize(0,4);
    var locY;
    for (var i = 0; i < 3; i++) {
        if (track === (i+1) ) {
            locY = this.firstTrackY + ( this.dTrack * i );
        }    
    }
    return locY;
}

// Initialization of new position and speed for
// bugs that have run to the end of the field
Enemy.prototype.startBug = function() {
    this.x = -50;
    this.y = this.randomizeRoad();
    this.dx = this.randomizeSpeed(1,5);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.dScoreRow = 10;
    this.dScoreGem = 20;
    this.score = 0;
    this.startPlayer();
    this.handleInput();
}

Player.prototype.update = function(dt) {

}

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.handleInput = function(key) {
    this.dx = trackWidth;
    this.dy = trackHeight;
    switch (key) {
    case 'left': 
        if (this.x > 0) {
            this.x = this.x - this.dx;
        }
        else {
            this.x = this.x;
        }    
        break;
    case 'right':
        if (this.x < canvas.width - 2*this.dx) {
            this.x = this.x + this.dx;
        }
        else {
            this.x = this.x;
        }
        break;
    case 'up':
        if (this.y > 0) {
            this.y = this.y - this.dy;
            this.countScore(this.dScoreRow);
        }
        else {
            this.y = this.y;
        }
        break;
    case 'down':
        if (this.y < canvas.height - 3*this.dy) {
            this.y = this.y + this.dy;
        }
        else {
            this.y = this.y;
        }
        break;
    default:
        this.x = this.x;
        this.y = this.y;
    }
}

Player.prototype.startPlayer = function() {
    this.x = 200;
    this.y = 415;
}

Player.prototype.countScore = function(dScore) {
    this.dScore = dScore;
    this.score = this.score + this.dScore;
}

var Gem = function() {
    this.x = 0;
    this.y = 0;
    this.gemFitX = 5;
    this.gemFitY = 25;
    this.randomizeAppear();
}

Gem.prototype.randomizeAppear = function() {
    this.xCol = randomize(0,6) - 1;
    this.x = this.xCol * trackWidth;
    this.yCol = randomize(0,4);
    this.y = this.yCol * trackHeight - this.gemFitY;
}

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var GemOrange = function() {
    Gem.call(this);
    this.sprite = 'images/gem-orange.png';
    this.dScoreGem = 30;
}

GemOrange.prototype = Object.create(Gem.prototype);
GemOrange.prototype.constructor = Gem;

var GemGreen = function() {
    Gem.call(this);
    this.sprite = 'images/gem-green.png';
    this.dScoreGem = 40;
}

GemGreen.prototype = Object.create(Gem.prototype);
GemGreen.prototype.constructor  = Gem;

// Default global random function
var randomize = function(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

var player = new Player();

var gemOrange = new GemOrange();
var gemGreen = new GemGreen();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

