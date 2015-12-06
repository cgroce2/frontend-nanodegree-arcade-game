// * Object creation and functions for updating and rendering
//  * each object
//  */

// Create enemy object
var Enemy = function(x, y) {
    "use strict";
    this.x = x;
    this.y = y;
    this.speed = Math.random() * (202 - 50.5) + 50.5;

    this.sprite = 'images/enemy-bug.png';
};

//Update enemies' position
var sx = -101; //constant start position variable
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    "use strict";
    var vx = dt * this.speed,
        width = 505;    

    if (this.x === sx) {
        this.x += vx;
    }   

    else {
        this.x += vx;
        if (this.x + vx > width) {
            this.x = sx;
        }
    }

    //Detect if enemy has colided with player
    if ((player.x - 41.5 < this.x) && (player.x + 41.5 > this.x) && this.y === player.y) {
        hasCollided = true;
    }
};

//Draw enemies on canvas
Enemy.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Create player object
var Player = function(character) {
    "use strict";
    this.x = 202;
    this.y = 373.5;
    this.vx = 101;
    this.vy = 83;

    this.sprite = 'images/char-' + character + '.png';
};

//If player has collided with an enemy, gone in water or collected a gem, reset position
Player.prototype.update = function() {
    "use strict";
    if (hasCollided) {
        this.x = 202;
        this.y = 373.5;
    }

    if (hasWater) {
        this.x = 202;
        this.y = 373.5;
    }

    if (scoreChanged) {
        this.x = 202;
        this.y = 373.5;
    }
};

//Handle arrow keys to move player
Player.prototype.handleInput = function(key) {
    "use strict";
    var height = 606;

    if (key == 'left') {
        this.x -= this.vx;
    }
    else if (key == 'up') {
        this.y -= this.vy;
    }
    else if (key == 'right') {
    this.x += this.vx;
    }
    else if (key == 'down') {
    this.y += this.vy;
    }

   //Detect if player has run into water
    if (this.y < 41.5) {
        hasWater = true;
    }

    //Make sure player doesn't move off screen
    if (this.y + this.vy > 373.5) {
        this.y = 373.5; 
    }
    if (this.x - this.vx < 0) {
        this.x = 0
    }   
    if (this.x + this.vx > 404) {
        this.x = 404    
    }

};

//Draw player on canvas
Player.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Create score object
var Score = function() {
    "use strict";
    this.x = 12;
    this.y = 93;
    this.score = 0;
    this.text = 'Score: ' + this.score.toString();
};

Score.prototype.scoreGem = function(value) {
    "use strict";
    this.score += value;
    this.text = 'Score: ' + this.score.toString();
    scoreChanged = false;
};

//Update score for various conditions
Score.prototype.update = function() {
    "use strict";
    if (blueWasCaught && scoreChanged && !blueScored) {
        score.scoreGem(50);
        blueScored = true;
    }
    if (greenWasCaught && scoreChanged && !greenScored) {
        score.scoreGem(100);
        greenScored = true;
    }
    if (orangeWasCaught && scoreChanged && !orangeScored) {
        score.scoreGem(150);
        orangeScored = true;
    }
    if (keyWasCaught && scoreChanged && !keyScored) {
        score.scoreGem(200);
        keyScored = true;
    }
    if (whichLevel === 1 && blueWasCaught) {
        levelFinished = true;
    }
    if (whichLevel === 2 && blueWasCaught && greenWasCaught) {
        levelFinished = true;
    }

    if (whichLevel === 3 && blueWasCaught && greenWasCaught && orangeWasCaught) {
        levelFinished = true;
    }
    if (keyWasCaught && blueWasCaught && greenWasCaught && orangeWasCaught) {
        hasWon = true;
    }

};

//Draw score on Canvas
Score.prototype.render = function() {
    "use strict";
    ctx.fillStyle = '#000';
    ctx.font = '20px sans-serif';
    ctx.fillText(this.text, this.x, this.y);
};

//Create lives object
var Lives = function() {
    "use strict";
    this.heartX = 412;
    this.textX = 463.5;
    this.heartY = 41.5;
    this.y = 93;
    this.lives = 5;
    this.sprite = 'iamges/Heart.png';
    this.text = 'X ' + this.lives.toString();
};

//Update lives for various conditions
Lives.prototype.update = function() {
    "use strict";
    if (hasCollided && this.lives > 0) {
        this.lives -= 1;
        this.text = 'X ' + this.lives.toString();
        hasCollided = false;
    }
    if (hasWater && this.lives > 0) {
        this.lives -= 1;
        this.text = 'X ' + this.lives.toString();
        hasWater = false;
    }
    if (this.lives === 0) {
        gameOver = true;
    }
};


//Create gem object
var Gem = function(level, color) {
    "use strict";
    var possibleX = [0, 101, 202, 303, 404];

    if (color === 'blue') {
        //place blue gem in different position for each level
        if (level === 1) {
            //Top center
            this.x = 202;
            this.y = 41.5;
        }
        else if (level === 2) {
            //Randomly in bottom two tiers
            var choiceX = Math.random();
            var choiceY = Math.random();

            if (choiceX < 0.2) {
                this.x = possibleX[0];
            }
            else if (choiceX >= 0.2 && choiceX < 0.4) {
                this.x = possibleX[1];
            }
            else if (choiceX >= 0.4 && choiceX < 0.6) {
                this.x = possibleX[2];
            }
            else if (choiceX >= 0.6 && choiceX < 0.8) {
                this.x = possibleX[3];
            }
            else if (choiceX >= 0.8 && choiceX < 1) {
                this.x = possibleX[4];
            }

            if (choiceY < 0.5) {
                this.y = 124.5;
            }
            else if (choiceY >= 0.5 && choiceY < 1) {
                this.y = 207.5;
            } 

        }

        else if (level === 3 || level === 4) {
            //Randomly in bottom tier
            var choice1 = Math.random();

            if (choice1 < 0.2) {
                this.x = possibleX[0];
            }
            else if (choice1 >= 0.2 && choice1 < 0.4) {
                this.x = possibleX[1];
             }
             else if (choice1 > 0.4 && choice1 < 0.6) {
                this.x = possibleX[2];
             }
             else if (choice1 >= 0.6 && choice1 < 0.8) {
                this.x = possibleX[3];
             }
             else if (choice1 >= 0.8 && choice1 < 1) {
                this.x = possibleX[4];
             }

             this.y = 207.5;
         }

         this.sprite = 'images/Gem Blue.png';   
    }  

    else if (color === 'green') {
        if (level === 2) {
            //Top center
            this.x = 202;
            this.y = 41.5;
        }
        else if (level === 3 || level === 4) {
            //Randomly in middle tier
            var choice2 = Math.random();

            if (choice2 < 0.2) {
                this.x = possibleX[0];
            }
            else if (choice2 >= 0.2 && choice2 < 0.4) {
                this.x = possibleX[1];
            }
            else if (choice2 >= 0.4 && choice2 < 0.6) {
                this.x = possibleX[2];
            }
            else if (choice2 >= 0.6 && choice2 < 0.8) {
                this.x = possibleX[3];
            } 
            else if (choice2 >= 0.8 && choice2 < 1) {
                this.x = possibleX[4];
            }

            this.y = 124.5;
        }

        this.sprite = 'images/Gem Green.png';   
    }   

    else if (color === 'orange') {
        possibleX = [0, 101, 303, 404];

        if (level === 3) {
            //Top center
            this.x = 202;
            this.y = 41.5;
        }
        else if (level === 4) {
            //Randomly on top tier not in top center
            var choice3 = Math.random();

            if (choice3 < 0.25) {
                this.x = possibleX[0];
            }
            else if (choice3 >= 0.25 && choice3 < 0.5) {
                this.x = possibleX[1];
            }
            else if (choice3 >= 0.5 && choice3 < 0.75) {
                this.x = possibleX[2];
            }
            else if (choice3 >= 0.75 && choice3 < 1) {
                this.x = possibleX[3];
            }

            this.y = 41.5;
        }

        this.sprite = 'images/Gem Orange.png';
    }

};

//Detect if a gem has been collected by player
Gem.prototype.update = function(color) {
    "use strict";
    if (player.x === this.x && player.y === this.y) {
        if (color === 'blue') {
            blueWasCaught = true;
        }
        else if (color === 'green') {
            greenWasCaught = true;
        }    
        else if (color === 'orange') {
            orangeWasCaught = true;
        }    

        scoreChanged = true;
    }
};

//Draw gem on canvas
Gem.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Create key object
var Key = function() {
    "use strict";
    this.x = 202;
    this.y = 41.5;

    this.sprite = 'images/Key.png';
};

//Detect if player has collected key
Key.prototype.update = function() {
    "use strict";
    if (player.x === this.x && player.y === this.y) {
        keyWasCaught = true;
        scoreChanged = true;
    }
};

//Draw key on canvas
Key.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
/*
*
*
* Game state variables
*/

var hasCollided = false, //if player has collided with enemy
    hasWater = false, //if player runs into water
    gameOver = false,
    hasWon = false,
    whichCharacter, //Which character the user chooses
    finalScore,
    levelFinished = false,
    whichLevel = 1,
    blueWasCaught = false, //if the blue gem was caught
    greenWasCaught = false, //if the green gem was caught
    orangeWasCaught = false, //if the orange gem was caught
    keyWasCaught = false, //if the key was caught
    scoreChanged = false,
    blueScored = false,
    greenScored = false,
    orangeScored = false,
    keyScored = false;

/* Instantiate enemy, score and lives objects.
* Player is instantiated after user chooses character
* Gem and key objects are instantiated at begining
* of appropriate level
*/

var player,
    allEnemies = [],
    score = new Score(),
    lives = new Lives(),
    blue,
    green,
    orange,
    key;

for (var i = 1; i < 4; i++) {
    for (var j = 0; j < 2; j++) {
        var newEnemy = new Enemy(sx, i*83 - 41.5);
        allEnemies.push(newEnemy);
    }
}

//Add listener for key input to move player
document.addEventListener('keyup', function(e) {
    "use strict";
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//HTML to add to screen depending on which level
var levelOneHTML = '<h2>Level 1</h2>' +
                    '<p>Objective:<br><br>' +
                    'Capture the blue gem without getting hit by the bugs.</p>';   

var levelTwoHTML = '<h2>Level 2</h2>' +
                    '<p>Objective:<br><br>' +
                    'Capture the blue and green gems without getting hit by the bugs.</p>';

var levelThreeHTML = '<h2>Level 3</h2>' +
                     '<p>Objective:<br><br>' +
                     'Capture the blue, green and orange gems without getting hit by the bugs.</p>';

var levelFourHTML =  '<h2>Level 1</h2>' +
                     '<p>Objective:<br><br>' +
                     'Capture the gems and the key without getting hit by the bugs.</p>';
 
