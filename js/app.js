// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.firstTrackY = 60;
    this.dTrack = 85;
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
// Default random function
Enemy.prototype.randomize = function(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Bug speed randomization
Enemy.prototype.randomizeSpeed = function(min, max) {
    return this.randomize(min,max);
}
// Randomization of road choice
Enemy.prototype.randomizeRoad = function() {
    var track = this.randomize(0,4);
    var locY;

    if (track === 1) {
        locY = this.firstTrackY;
    }
    else if (track === 2) {
        locY = this.firstTrackY + this.dTrack;
    }
    else if (track === 3) {
        locY = this.firstTrackY + this.dTrack*2;
    }
    else {
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
    this.startPlayer();
    this.handleInput();
}
Player.prototype.update = function(dt) {

}
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(key) {
    this.dx = 100;
    this.dy = 85;
    if (key === 'left') {
        if (this.x > 0) {
            this.x = this.x - this.dx;
        }
        else {
            this.x = this.x;
        }
    }
    else if (key === 'right') {
        if (this.x < canvas.width - 2*this.dx) {
            this.x = this.x + this.dx;
        }
        else {
            this.x = this.x;
        }    
    }
    else if (key === 'up') {
        if (this.y > 0) {
            this.y = this.y - this.dy;
        }
        else {
            this.y = this.y;
        }
    }
    else if (key === 'down') {
        if (this.y < canvas.height - 3*this.dy) {
            this.y = this.y + this.dy;
        }
        else {
            this.y = this.y;
        }
    }
}
Player.prototype.startPlayer = function() {
    this.x = 200;
    this.y = 415;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(), new Enemy(), new Enemy()];

var player = new Player();


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
