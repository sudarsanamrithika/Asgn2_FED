document.addEventListener('DOMContentLoaded', function () {
    const airplane = document.getElementById('airplane');
    const gameContainer = document.getElementById('game-container');
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    let score = 0;
    let highScore = 0;
    
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
    
        let gameStartTime;
        let touchStartX;
    
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
            scoreDisplay.textContent = `Score: ${score}`;
          
            if (score > highScore) {
              highScore = score;
              updateHighScoreDisplay();
    
              localStorage.setItem('highScore', highScore);
            }
        }
    
        function updateHighScoreDisplay() {
            highScoreDisplay.textContent = `High Score: ${highScore}`;
        }
    
        setInterval(createObstacle, 2000);
        gameStartTime = new Date().getTime();
    
        function endGame() {
            alert(`Game Over! Your score is ${score}`);
            resetGame();
        }
    
        function resetGame() {
            score = 0;
            scoreDisplay.textContent = 'Score: 0';
            gameContainer.innerHTML = '';
            const newAirplane = document.createElement('div');
            newAirplane.id = 'airplane';
            newAirplane.style.left = '180px';
            newAirplane.style.position = 'absolute';
            newAirplane.style.width = '40px';
            newAirplane.style.height = '40px';
            newAirplane.style.backgroundColor = '#FFD700';
            newAirplane.style.bottom = '20px';
            
            gameContainer.appendChild(newAirplane);
            gameStartTime = new Date().getTime(); 
    
            updateHighScoreDisplay();
        }
    
        setInterval(checkCollision, 100);
});