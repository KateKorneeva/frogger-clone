// Enemies which player must avoid
var Enemy = function() {
    // The image/sprite for enemies, this uses
    // a helper to easily load images
    this.sprite = 'images/enemy-bug.png';
    // dTrack variable allows bugs stay at the middle of blocks
    this.dTrack = rowHeight;
    // Position enemy and give it speed value when emeny is initialised
    this.startBug();
}

// Update the enemy's position
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // Enemy position is updated with dX until enemy
    // reaches right border of the screen.
    // After that bug appears at left and starts again.
    // Due to dt multiplier the game runs at the same 
    // speed for all computers.
    this.x = this.x + (this.dx * dt);
    if (this.x > canvas.width) {
        this.startBug();
    }
}

// Draw the enemy on the screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Bug speed randomization
Enemy.prototype.randomizeSpeed = function(min, max) {
    return randomize(min,max);
}

// Randomization of road choice
Enemy.prototype.randomizeRoad = function() {
    var track = randomize(0,4),
        locY;
    for (var i = 0; i < 3; i++) {
        if (track === (i+1) ) {
            locY = firstTrackY + ( this.dTrack * i );
        }    
    }
    return locY;
}

// Initialization of new position and speed for
// bugs that have run to the end of the field
Enemy.prototype.startBug = function() {
    this.x = -50;
    this.y = this.randomizeRoad();
    this.dx = this.randomizeSpeed(50,200);
}

// Character which player can command
var Player = function() {
    // The image/sprite for character, this uses
    // a helper to easily load images    
    this.sprite = 'images/char-boy.png';
    // Set initial score value to 0
    this.score = 0;
    // Position character at the bottom of the game field
    this.startPlayer();
    // Transform keypress into movements of the character
    this.handleInput();
}

// Displays score on each player update
Player.prototype.update = function() {
    this.displayScore(this.score);
}

// Draw the character on the screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Transform keypress into character position shift
// If statements check that the character will stay 
// inside the game field after it moves.
Player.prototype.handleInput = function(key) {
    this.dx = colWidth;
    this.dy = rowHeight;
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

// Position character at the bottom of the game field
Player.prototype.startPlayer = function() {
    this.x = playerStartX;
    this.y = playerStartY;
}

// Summarise score which player had before (score)
// with score gained by current move (dScore)
Player.prototype.countScore = function(dScore) {
    this.dScore = dScore;
    this.score = this.score + this.dScore;
}
// Send score value to the div above game field
Player.prototype.displayScore = function(score) {
    scoreDispl.innerHTML = 'Your score is: ' + score;
}

// Gems which player should collect to
// gain score
var Gem = function() {
    this.randomizeAppear();
}

// Randomisation of gem location
Gem.prototype.randomizeAppear = function() {
    this.xCol = randomize(0,6) - 1;
    this.x = this.xCol * colWidth;
    this.yCol = randomize(0,4);
    this.y = this.yCol * rowHeight - gemFitY;
}

// Draw the gem on the screen
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

var GemOrange = function() {
    // This inherits properties from Gem superclass
    Gem.call(this);
    this.sprite = 'images/gem-orange.png';
    // Set score quantity gained for orange
    // gem collection to lowScore variable value
    this.dScoreGem = lowScore;
}

// This inherits methods from Gem superclass
GemOrange.prototype = Object.create(Gem.prototype);
GemOrange.prototype.constructor = Gem;

var GemGreen = function() {
    // This inherits properties from Gem superclass
    Gem.call(this);
    this.sprite = 'images/gem-green.png';
    // Set score quantity gained for green
    // gem collection to middle variable value    
    this.dScoreGem = middleScore;
}

// This inherits methods from Gem superclass
GemGreen.prototype = Object.create(Gem.prototype);
GemGreen.prototype.constructor  = Gem;

var GemBlue = function() {
    // This inherits properties from Gem superclass
    Gem.call(this);
    this.sprite = 'images/gem-blue.png';
    // Set score quantity gained for blue
    // gem collection to highScore variable value    
    this.dScoreGem = highScore;
}

// This inherits methods from Gem superclass
GemBlue.prototype = Object.create(Gem.prototype);
GemBlue.prototype.constructor  = Gem;

// Global random function. Used for different prototypes
var randomize = function(max, min) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set of global variables with digital values.
var colWidth = 101,
    rowHeight = 83,
    firstTrackY = 76,
    playerStartX = 200,
    playerStartY = 415,
    gemFitX = 5,
    gemFitY = 25,
    lowScore = 10,
    middleScore = 20,
    highScore = 30;

// Here objects are instantiated.
var allEnemies = [new Enemy(), new Enemy(), new Enemy()],
    player = new Player(),
    gems = [new GemOrange(), new GemGreen(), new GemBlue()];

// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});