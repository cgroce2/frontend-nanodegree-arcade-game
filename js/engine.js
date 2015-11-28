    /* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
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
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        resetButton = doc.createElement("BUTTON"),
        buttontext = doc.createTextNode("Reset"),
        levelObjective;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    resetButton.appendChild(buttontext);
    doc.body.appendChild(resetButton);

    //resetButton.innerHTML = 'Reset';
    //doc.body.appendChild(resetButton);
    resetButton.addEventListener("click", resetGame);

  

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        if (!hasReset && !gameOver && !hasWon && !levelFinished) {
            win.requestAnimationFrame(main);
        }
        if (levelFinished) {
            whichLevel += 1;
            initLevel();
            levelFinished = false;
            main();
        }
        if (gameOver) {
            alert('I\'m sorry! You have lost. Please click "OK" and then Reset or ' +
                  'simply reload your browser to play again.');
            finalScore = score.score + 50 * lives.lives;
            updateHighScores(finalScore);
        }
        if (hasWon) {
            finalScore = score.score + 100 * lives.lives;
            alert('Congratulations! You have won! Your final score is ' + finalScore +
                  '!\nYou can find a list of your previous high scores below.');
            updateHighScores(finalScore);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        hasReset = false;
        isValid = false;
        lastTime = Date.now();
        initLevel();
        var welcome = $.alert('Welcome to my Frogger-like game. The rules are simple:\n' +
              '- Use the arrow keys to control the player\n' +
              '- Avoid the moving bugs - they are the enemy!\n' +
              '- Collect gems to score points. Your ultimate goal is ' +
              'the key at the end.\n' +
              '- Have fun!', function() {
                showHighScores();
                if (characterPrompt()) {
                    main();
                }
            });
    }    

    var isValid = false;

   function characterPrompt() {
        while (!isValid) {
            var character = $.prompt('Welcome! Which character would you like to be? Your ' +
                                   'options are (please type a letter):\n' +
                                   'a. Boy\nb. Cat Girl\nc. Horn Girl\nd. Pink Girl\n' +
                                   'e. Princess Girl')

            if (!character) {
                continue;
            }
            var characterMap = {
                'a': 'boy',
                'b': 'cat-girl',
                'c': 'horn-girl',
                'd': 'pink-girl',
                'e': 'princess-girl'
            };
            whichCharacter = characterMap[character.toLowerCase()];
            if (!whichCharacter) {
                continue;
            }
            player = new Player(whichCharacter);
            return true;
        }
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        
        if (!blueWasCaught) {
            blue.update('blue');
        }

        if (whichLevel === 2) {
            if (!greenWasCaught) {
                green.update('green');
            }
        } else if (whichLevel === 3) {
            if (!greenWasCaught) {
                green.update('green');
            }
            if (!orangeWasCaught) {
                orange.update('orange');
            }
        } else if (whichLevel === 4) {
            if (!greenWasCaught) {
                green.update('green');
            }
            if (!orangeWasCaught) {
                orange.update('orange');
            }
            if (!keyWasCaught) {
                key.update();
            }
        }
        player.update();
        score.update();
        lives.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
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
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }


        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        if (!blueWasCaught) {
            blue.render();
        }

        if (whichLevel === 2) {
            if (!greenWasCaught) {
                green.render();
            }
        } else if (whichLevel === 3) {
            if (!greenWasCaught) {
                green.render();
            }
            if (!orangeWasCaught) {
                orange.render();
            }
        } else if (whichLevel === 4) {
            if (!greenWasCaught) {
                green.render();
            }
            if (!orangeWasCaught) {
                orange.render();
            }
            if (!keyWasCaught) {
                key.render();
            }
        }

        player.render();
        score.render();
       // lives.render();
    }

    function initLevel() {
        if (whichLevel === 1) {
            blue = new Gem(whichLevel, 'blue');

            if (doc.getElementById('level-objective') !== null) {
                levelObjective.innerHTML = '';
            }

            levelObjective = doc.createElement('div');
            levelObjective.id = 'level-objective';
            levelObjective.innerHTML = levelOneHTML;

            doc.body.appendChild(levelObjective);
        } else if (whichLevel === 2) {
            blue = new Gem(whichLevel, 'blue');
            blueWasCaught = false;
            blueScored = false;

            green = new Gem(whichLevel, 'green');
            greenWasCaught = false;
            greenScored = false;

            levelObjective.innerHTML = levelTwoHTML;

            alert('Awesome! You beat level 1! Now how about level 2?');
        } else if (whichLevel === 3) {
            blue = new Gem(whichLevel, 'blue');
            blueWasCaught = false;
            blueScored = false;

            green = new Gem(whichLevel, 'green');
            greenWasCaught = false;
            greenScored = false;

            orange = new Gem(whichLevel, 'orange');
            orangeWasCaught = false;
            orangeScored = false;

            levelObjective.innerHTML = levelThreeHTML;

            alert('Sweet! You beat level 2! Up for level 3?');
        } else if (whichLevel === 4) {
            blue = new Gem(whichLevel, 'blue');
            blueWasCaught = false;
            blueScored = false;

            green = new Gem(whichLevel, 'green');
            greenWasCaught = false;
            greenScored = false;

            orange = new Gem(whichLevel, 'orange');
            orangeWasCaught = false;
            orangeScored = false;

            key = new Key();

            levelObjective.innerHTML = levelFourHTML;

            alert('Nice! You are a beast! You beat level 3! One more to go...you ready?');
        }
    }

    function resetGame() {
        hasReset = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        allEnemies = [];
        score = new Score();
        lives = new Lives();
        hasCollided = false;
        gameOver = false;
        hasWon = false;
        whichCharacter = undefined;
        finalScore = 0;
        levelFinished = false;
        whichLevel = 1;
        blueWasCaught = false;
        greenWasCaught = false;
        orangeWasCaught = false;
        keyWasCaught = false;
        blueScored = false;
        greenScored = false;
        orangeScored = false;
        keyScored = false;

        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 2; j++) {
                var newEnemy = new Enemy(-101, i*83 - 41.5);
                allEnemies.push(newEnemy);
            }
        }

        init();
    }


    function updateHighScores(score) {
        var highScores = [];
        if (!localStorage.scores) {
            highScores.push(score);   
        } else if (localStorage.scores) {
            highScores = JSON.parse(localStorage.scores);
            highScores.push(score);
        }
        highScores = highScores.sort(function(a, b) {return a-b;}).reverse();
        if (highScores.length > 10) {
            highScores = highScores.slice(0, 10);
        }
        localStorage.scores = JSON.stringify(highScores);

        showHighScores();
    }

    function showHighScores() {
        if (localStorage.scores) {
            var highScores = [];
            highScores = JSON.parse(localStorage.scores);

            var highScoreList = doc.getElementById('high-scores-list');
            highScoreList.innerHTML = '';

            for (var i = 0; i < highScores.length; i++) {
                var newScore = highScores[i];
                var highScoreHTML = doc.createElement('li');
                highScoreHTML.innerHTML = newScore;
                highScoreList.appendChild(highScoreHTML);
            }
        }
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/Gem Blue.png',
        'images/Gem Green.png',
        'images/Gem Orange.png',
        'images/Heart.png',
        'images/Key.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);