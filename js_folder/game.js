const aUrl = 'https://bookish-bdb3.restdb.io/rest/accounts';
const aKey = '65b380d5802d9b35afa680d5';

document.addEventListener('DOMContentLoaded', function () {
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
    var highScore = sessionStorage.getItem('highscore') || 0;
    var newScore = 0;
    var gameOver = false;
    var collide = false;
  
    const storedHighScore = sessionStorage.getItem('highscore');
    updateHighScoreDisplay();

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

    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' && airplane.offsetLeft !== 0) {
            moveAirplane(-20);
        } else if (event.key === 'ArrowRight' && airplane.offsetLeft !== (gameContainer.offsetWidth - airplane.offsetWidth)) {
            moveAirplane(20);
        }
    });

    function moveAirplane(distance) {
        const currentPosition = airplane.offsetLeft;
        const newPosition = currentPosition + distance;
        if (newPosition >= 0 && newPosition <= (gameContainer.offsetWidth - airplane.offsetWidth)) {
            airplane.style.left = newPosition + 'px';
        }
    }


    function createObstacle() {
        if (gameOver) {
            return; // Do nothing if the game is over
        }
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        const randomPosition = Math.floor(Math.random() * 360);
        obstacle.style.left = `${randomPosition}px`;
        gameContainer.appendChild(obstacle);
  
        const randomImageIndex = Math.floor(Math.random() * obstacleImages.length);
        obstacle.style.backgroundImage = `url('${obstacleImages[randomImageIndex]}')`;
    
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
            console.log(newScore);
        });
    }
  
    const obstacleImages = [
        'imgs/bird_flying.PNG',
        'imgs/cloud_stats.PNG',
        'imgs/ufo.PNG',
    ];
    
    function checkCollision() {
        const airplaneRect = airplane.getBoundingClientRect();
        const obstacles = document.querySelectorAll('.obstacle');
        obstacles.forEach((obstacle) => {
        const obstacleRect = obstacle.getBoundingClientRect();
    
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

    function updateHighScore(username, highScore) {
        if (collide === true)
        {
            console.log('already run');
            return;
        }
        else 
        {
            collide = true;
        }
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
    
    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = `${highScore}`;
    }
    
    setInterval(createObstacle, 2000);
    gameStartTime = new Date().getTime();

    function increaseScore() {
        score += 1;
        scoreDisplay.textContent = `${score}`;
  
        if (score > storedHighScore) {
            highScore = score;
            updateHighScoreDisplay();
            sessionStorage.setItem('highscore', highScore);
        }
    }

    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = `${highScore}`;
    }

    gameStartTime = new Date().getTime();
  
    async function endGame() {
        newScore = score;
        finalScoreSpan.textContent = newScore;
        popupContainer.classList.remove('hidden');
        // Set the game over flag to true
        gameOver = true;
    
        // Wait for any pending asynchronous operations to complete before updating the high score
        await new Promise((resolve) => setTimeout(resolve, 100)); // Adjust the timeout value as needed
    
        // Update the high score after all operations are completed
        updateHighScore(username, newScore);
    }
  
    function resetGame() {
        score = 0;
        location.reload();
    }
  
    setInterval(checkCollision, 100);
  
    playAgainBtn.addEventListener('click', function () {
        resetGame();
        popupContainer.classList.add('hidden');
    });
  
    goHomeBtn.addEventListener('click', function () {
        resetGame();
        popupContainer.classList.add('hidden');
        window.location.href = 'home.html';
    });
}); 
