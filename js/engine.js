/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on player and enemy objects (defined in app.js).
 *
 * A game engine works by drawing the entire game screen over and over.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        scoreDispl = doc.createElement('div'),
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime;

    canvas.width = 505;
    canvas.height = 606;
    scoreDispl.id = 'score-displ';
    doc.body.appendChild(scoreDispl);
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is)
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call update/render functions, pass along the time delta to
         * update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        win.requestAnimationFrame(main);
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data.
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
        checkGemPicks();
    }

    /* This is called by the update function  and loops through all of the
     * objects within allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for
     * player object.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }
    /*
     * Checks if character and enemy are standing at the same square.
     * If yes, collision happens and game restarts from beginning 
    */
    function checkCollisions() {
        for (var en in allEnemies){
            if ( ( player.x <= allEnemies[en].x + 60 ) &&
                ( player.x > allEnemies[en].x - allEnemies[en].dx) &&
                ( player.y === allEnemies[en].y + 7 ) 
                )
            {   
                player.score = 0;
                player.startPlayer();
            }
        }
    }

    /*
     * Checks if character and gem are at the same square.
     * If yes, gem is picked by player and he gains score
     * specified in this gem's class
    */
    function checkGemPicks() {
        for (var i = 0, max = gems.length; i < max; i++) {
            var dX = colWidth - gemFitX;
            var dY = rowHeight - gemFitY;

            if ( (player.x <= gems[i].x + dX) &&
                 (player.x > gems[i].x - dX) &&
                 (player.y <= gems[i].y + dY) &&
                 (player.y > gems[i].y - dY) )
            {
                player.countScore(gems[i].dScoreGem);
                gems[i].randomizeAppear();
            }
        }
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * Resources helpers are used to refer to images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * colWidth, row * rowHeight);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions defined
     * on enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        gems.forEach(function(gem) {
            gem.render();
        });
    }

    /* Load all of the images needed to draw game. 
     * Then set init as the callback method, so that when
     * all of these images are properly loaded game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/gem-blue.png',
        'images/gem-orange.png',
        'images/gem-green.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object, canvas' object itself
     * and scoreDispl to the global variable (the window
     * object when run in a browser) so it can be used more easily
     * from within app.js files.
     */
    global.ctx = ctx;
    global.canvas = canvas;
    global.scoreDispl = scoreDispl;
})(this);