document.addEventListener('DOMContentLoaded', function () {
    const airplane = document.getElementById('airplane');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const popupContainer = document.getElementById('popup-container');
    const finalScoreSpan = document.getElementById('final-score');
    const playAgainBtn = document.getElementById('play-again-btn');
    const goHomeBtn = document.getElementById('go-home-btn');
  
    let score = 0;
    let highScore = 0;
    let gameStartTime;
    let touchStartX;
  
    document.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowLeft' && airplane.style.left !== '0px') {
            moveAirplane(-20);
        } else if (event.key === 'ArrowRight' && airplane.style.left !== '360px') {
            moveAirplane(20);
        }
    });
  
    const storedHighScore = localStorage.getItem('highScore');
    if (storedHighScore) {
        highScore = parseInt(storedHighScore);
        updateHighScoreDisplay();
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
            increaseScore();
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
    
    function increaseScore() {
        score += 1;
        scoreDisplay.textContent = `${score}`;
          
        if (score > highScore) {
            highScore = score;
            updateHighScoreDisplay();
    
            localStorage.setItem('highScore', highScore);
        }
    }
    
    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = `${highScore}`;
    }
    
    setInterval(createObstacle, 2000);
    gameStartTime = new Date().getTime();
    
    function endGame() {
        alert(`Game Over! Your score is ${score}`);
        showPopup();
        setTimeout(function () {
            window.location.href = 'restdb_test.html'; // Replace with the desired page URL
            }, 1000);
    }
    
    function resetGame() {
        score = 0;
        updateHighScoreDisplay();
        location.reload();
    }
    
    function increaseScore() {
        score += 1;
        scoreDisplay.textContent = `${score}`;
  
        if (score > highScore) {
            highScore = score;
            updateHighScoreDisplay();
            localStorage.setItem('highScore', highScore);
        }
    }
  
    function updateHighScoreDisplay() {
        highScoreDisplay.textContent = `${highScore}`;
    }

    gameStartTime = new Date().getTime();
  
    function endGame() {
        finalScoreSpan.textContent = score;
        popupContainer.classList.remove('hidden');
        gameContainer.removeEventListener('click', gameOver); // Remove the click event listener
    }
  
    function resetGame() {
        score = 0;
        location.reload();
        updateHighScoreDisplay();
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