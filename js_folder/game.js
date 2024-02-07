const aUrl = 'https://airplanegame-0e10.restdb.io/rest/accounts';
const aKey = '65c2fea74405e1eb04db0819';

document.addEventListener('DOMContentLoaded', function () {
    const airplane = document.getElementById('airplane');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const popupContainer = document.getElementById('popup-container');
    const finalScoreSpan = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    const goHomeBtn = document.getElementById('go-home-btn');
    const username = document.getElementById("username");
    
    let score = 0;
    let highScore = 0;
    let newScore = 0;
  
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' && airplane.style.left !== '0px') {
            moveAirplane(-20);
        } else if (event.key === 'ArrowRight' && airplane.style.left !== '360px') {
            moveAirplane(20);
        }
    });

    const storedHighScore = sessionStorage.getItem('highscore');
    console.log(storedHighScore);
    // Function to get high score
    function getHighScore(username) {
        // Fetch user data based on the username
        fetch(`${aUrl}?q={"username":"${username}"}`, {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            'x-apikey': aKey,
            },
        })
        .then(response => response.json())
        .then(data => {
        // Check if user with provided username exists
        if (data.length > 0) {
            const userHighScore = data[0].highscore;
            console.log(`High score for ${username}: ${userHighScore}`);
            return userHighScore;
        } 
        else {
            console.log('User not found in highscores collection.');
        }
        })
        .catch(error => {
            console.error('Error while getting high score:', error);
        });
    }
  
    function moveAirplane(distance) {
        const currentPosition = parseInt(airplane.style.left) || 0;
        airplane.style.left = `${currentPosition + distance}px`;
    }

    function createObstacle() {
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
            newScore = increaseScore();
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

    function updateHighScore(username, newHighScore) {
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
                const userData = data[0];
                userData.highscore = newHighScore; // Corrected variable name

                fetch(`${aUrl}/${userData._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-apikey': aKey,
                    },
                    body: JSON.stringify(userData),
                })
                .then(response => response.json())
                .then(updatedData => {
                    console.log(`High score for ${username} updated to ${newHighScore}`);
                })
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
  
        if (score > highScore) {
            newHighScore = score;
            updateHighScoreDisplay();
            localStorage.setItem('highScore', newHighScore);
            return newHighScore;
        }
        else {
            return score;
        }
    }

    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = `${highScore}`;
    }

    gameStartTime = new Date().getTime();
  
    function endGame() {
        console.log(localStorage.getItem('highScore'))
        updateHighScore(username, localStorage.getItem('highScore'));
        finalScoreSpan.textContent = newScore;
        popupContainer.classList.remove('hidden');
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