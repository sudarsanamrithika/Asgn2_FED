const aUrl = 'https://airplanegame-17aa.restdb.io/rest/accounts';
const aKey = '65c61a19be534ae09fd9ef74';

document.addEventListener('DOMContentLoaded', function () {
    // naming vars and consts
    const airplane = document.getElementById('airplane');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const popupContainer = document.getElementById('popup-container');
    const finalScoreSpan = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    const goHomeBtn = document.getElementById('go-home-btn');
    const username = sessionStorage.getItem('username');
    
    var score = 0;
    var highScore = sessionStorage.getItem('highscore');
    var newScore = 0;
    var gameOver = false;
    var collide = false;
    
    // get highscore
    const storedHighScore = sessionStorage.getItem('highscore');
    updateHighScoreDisplay();

    // create mobile controls
    let touchStartX = 0;

    gameContainer.addEventListener('touchstart', function (event) {
        touchStartX = event.touches[0].clientX;
    });

    gameContainer.addEventListener('touchend', function (event) {
        const touchEndX = event.changedTouches[0].clientX;
        const swipeThreshold = 50;

        if (touchEndX - touchStartX > swipeThreshold && airplane.offsetLeft !== 0) {
            moveAirplane(-20);
        } else if (touchEndX - touchStartX < -swipeThreshold && airplane.offsetLeft !== (gameContainer.offsetWidth - airplane.offsetWidth)) {
            moveAirplane(20);
        }
    });

    // website controls
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' && airplane.offsetLeft !== 0) {
            moveAirplane(-20);
        } else if (event.key === 'ArrowRight' && airplane.offsetLeft !== (gameContainer.offsetWidth - airplane.offsetWidth)) {
            moveAirplane(20);
        }
    });

    // to move airplane
    function moveAirplane(distance) {
        const currentPosition = airplane.offsetLeft;
        const newPosition = currentPosition + distance;
        if (newPosition >= 0 && newPosition <= (gameContainer.offsetWidth - airplane.offsetWidth)) {
            airplane.style.left = newPosition + 'px';
        }
    }


    function createObstacle() {
        if (gameOver) {
            return; // do nothing if the game is over
        }
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        const randomPosition = Math.floor(Math.random() * 360); // spawn obstacles in random position
        obstacle.style.left = `${randomPosition}px`;
        gameContainer.appendChild(obstacle);

        // randomize img 
        const randomImageIndex = Math.floor(Math.random() * obstacleImages.length);
        obstacle.style.backgroundImage = `url('${obstacleImages[randomImageIndex]}')`;
        
        // increase speed as game goes on
        const initialAnimationDuration = 3; 
        const minAnimationDuration = 1; 
        const accelerationFactor = 0.1;
    
        const animationDuration = Math.max(
            initialAnimationDuration - score * accelerationFactor,
            minAnimationDuration
        );
    
        obstacle.style.animationDuration = `${animationDuration}s`;
        
        obstacle.addEventListener('animationiteration', function () {
            this.remove();
            increaseScore();
        });
    }
  
    const obstacleImages = [
        'imgs/bird_flying.PNG',
        'imgs/ufo.PNG',
        'imgs/enemy_plane.PNG',
        'imgs/cloud.PNG',
        'imgs/cloud2.PNG'
    ];
    
    // to check if obstacles collide with plane
    function checkCollision() {
        const airplaneRect = airplane.getBoundingClientRect();
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach((obstacle) => {
        const obstacleRect = obstacle.getBoundingClientRect();
        
        // if the coords overlap, end game
        if (
            obstacleRect.bottom >= airplaneRect.top &&
            obstacleRect.top <= airplaneRect.bottom &&
            obstacleRect.right >= airplaneRect.left &&
            obstacleRect.left <= airplaneRect.right
        ) {
            endGame();
            }
        });
    }

    // to update highscore in restdb
    function updateHighScore(username, highScore) {
        if (collide === true)
        {
            return;
        }
        else 
        {
            collide = true;
        }

        // find user
        fetch(`${aUrl}?q={"username":"${username}"}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-apikey': aKey,
            },
        })
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                var userData = data[0];

                // reassign highscore value
                userData.highscore = highScore; 
    
                fetch(`${aUrl}/${userData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': aKey,
                    },
                    body: JSON.stringify(userData),
                })
                .then(response => response.json())
                .then(() => console.log(`High score for ${username} updated to ${highScore}`))
                .catch(error => {
                    console.error('Error updating high score:', error);
                });
            } else {
                console.log('User not found in highscores collection. Cannot update high score.');
            }
        })
        .catch(error => {
            console.error('Error while getting high score:', error);
        });
    }
    
    // to update the highscore display
    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = `${highScore}`;
    }
    
    // time between obstacles spawning
    setInterval(createObstacle, 2000);

    // to increase score
    function increaseScore() {
        score += 1; // every time user survive obstacles, +1
        scoreDisplay.textContent = `${score}`;
  
        if (score > storedHighScore) {
            highScore = score;
            updateHighScoreDisplay();
            sessionStorage.setItem('highscore', highScore);
        }
    }
  
    // end game 
    async function endGame() {
        newScore = score;
        finalScoreSpan.textContent = newScore;
        popupContainer.classList.remove('hidden');
        // Set the game over flag to true
        gameOver = true;
    
        // Wait for any pending asynchronous operations to complete before updating the high score
        await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the timeout value as needed
    
        // Update the high score after all operations are completed
        updateHighScore(username, sessionStorage.getItem('highscore'));
    }
    
    // reset game when over
    function resetGame() {
        score = 0;
        collide = false;
        location.reload();
    }
  
    setInterval(checkCollision, 100);

    // to reset game if player choose to play again
    playAgainBtn.addEventListener('click', function () {
        resetGame();
        popupContainer.classList.add('hidden');
    });
  
    // go back to home page 
    goHomeBtn.addEventListener('click', function () {
        resetGame();
        popupContainer.classList.add('hidden');
        window.location.href = 'home.html';
    });
}); 
