document.addEventListener("DOMContentLoaded", function() {
    const computers = document.querySelectorAll('.computer');
    let hearts = document.querySelectorAll('.heart');
    let remainingHearts = hearts.length;
    const character = document.getElementById('character');
    const gameOverDiv = document.getElementById('game-over');
    const restartButton = document.getElementById('restart-button');
    let characterX = window.innerWidth / 2;
    let characterY = window.innerHeight / 2;
    let isDragging = false;
    let animationFrameId;
    let playInterval = 5000;  // Initial interval of 5 seconds
    let gameOver = false;

    computers.forEach(computer => {
        const monitor = document.createElement('div');
        monitor.classList.add('monitor');
        computer.appendChild(monitor);

        const screen = document.createElement('div');
        screen.classList.add('screen');
        monitor.appendChild(screen);

        const base = document.createElement('div');
        base.classList.add('base');
        computer.appendChild(base);

        // Add click event listener to each screen
        screen.addEventListener('click', () => {
            screen.classList.remove('playing');
        });
    });

    function randomPlay() {
        if (gameOver) return;

        const randomComputer = computers[Math.floor(Math.random() * computers.length)];
        const screen = randomComputer.querySelector('.screen');
        screen.classList.add('playing');

        setTimeout(() => {
            if (screen.classList.contains('playing')) {
                loseHeart();
                screen.classList.remove('playing');
            }
            // Speed up the game by reducing the interval by 5% each round
            playInterval = playInterval * 0.95;
            randomPlay();
        }, playInterval);
    }

    function loseHeart() {
        if (remainingHearts > 0) {
            hearts[remainingHearts - 1].style.display = 'none';
            remainingHearts -= 1;
            if (remainingHearts === 0) {
                triggerGameOver();
            }
        }
    }

    function triggerGameOver() {
        gameOver = true;
        gameOverDiv.style.display = 'block';
    }

    function resetGame() {
        hearts.forEach(heart => heart.style.display = 'block');
        remainingHearts = hearts.length;
        playInterval = 5000;
        gameOver = false;
        gameOverDiv.style.display = 'none';
        randomPlay();
    }

    function onMouseDown(event) {
        isDragging = true;
        character.classList.add('dragging');
        character.style.backgroundImage = "url('MSV.gif')";
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    function onMouseMove(event) {
        characterX = event.clientX;
        characterY = event.clientY;

        if (!animationFrameId) {
            animationFrameId = requestAnimationFrame(updateCharacterPosition);
        }
    }

    function updateCharacterPosition() {
        character.style.left = `${characterX}px`;
        character.style.top = `${characterY}px`;
        
        computers.forEach(computer => {
            const compRect = computer.getBoundingClientRect();
            if (
                Math.abs(characterX - (compRect.left + compRect.width / 2)) < 50 &&
                Math.abs(characterY - (compRect.top + compRect.height / 2)) < 50
            ) {
                const screen = computer.querySelector('.screen');
                screen.classList.remove('playing');
            }
        });

        animationFrameId = null;
    }

    function onMouseUp() {
        isDragging = false;
        character.classList.remove('dragging');
        character.style.backgroundImage = "url('character.png')";
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    character.addEventListener('mousedown', onMouseDown);
    restartButton.addEventListener('click', resetGame);

    randomPlay();
});
