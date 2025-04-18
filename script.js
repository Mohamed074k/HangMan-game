// By Mohamed Elsayed :[www.linkedin.com/in/mohamed-elsayed-2623602a1]

// Update current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();

document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    const wordDisplay = document.getElementById('wordDisplay');
    const wrongLettersEl = document.getElementById('wrongLetters');
    const guessesLeftEl = document.getElementById('guessesLeft');
    const keyboard = document.getElementById('keyboard');
    const restartBtn = document.getElementById('restartBtn');
    const resultModal = document.getElementById('resultModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const wordReveal = document.getElementById('wordReveal');
    const playAgainBtn = document.getElementById('playAgainBtn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.getElementById('gameContainer');
    const startBtn = document.getElementById('startBtn');
    
    // Game variables
    let selectedWord = '';
    let correctLetters = [];
    let wrongLetters = [];
    let guessesLeft = 6;
    let gameOver = false;
    let difficulty = 'easy';
    
    // Word categories by difficulty
    const words = {
        easy: [
            'APPLE', 'HOUSE', 'MOUNTAIN', 'OCEAN', 'SUNSHINE',
            'GARDEN', 'PIZZA', 'TIGER', 'WATER', 'LIGHT',
            'FLOWER', 'BEACH', 'SMILE', 'MUSIC', 'PILLOW'
        ],
        medium: [
            'JAVASCRIPT', 'DEVELOPER', 'KEYBOARD', 'ELEPHANT',
            'BUTTERFLY', 'ADVENTURE', 'HAMBURGER', 'NOTEBOOK',
            'UNIVERSE', 'PYTHON', 'BASKETBALL', 'CHOCOLATE'
        ],
        hard: [
            'QUIZZICAL', 'JUXTAPOSE', 'ZEPHYR', 'XYLOPHONE',
            'RHUBARB', 'QUINTESSENTIAL', 'KALEIDOSCOPE', 
            'JACKPOT', 'ZIGZAG', 'VAPORIZE'
        ]
    };
    
    // Initialize the game
    function init() {
        // Show start screen initially
        startScreen.style.display = 'block';
        gameContainer.style.display = 'none';
        
        // Set up event listeners
        startBtn.addEventListener('click', () => {
            startScreen.style.display = 'none';
            gameContainer.style.display = 'block';
            setTimeout(() => {
                gameContainer.classList.add('show');
            }, 50);
            startGame();
        });
        
        restartBtn.addEventListener('click', startGame);
        playAgainBtn.addEventListener('click', startGame);
        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                difficultyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                difficulty = btn.dataset.difficulty;
                startGame();
            });
        });
        
        // Set up keyboard
        createKeyboard();
        
        // Handle physical keyboard input
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Start a new game
    function startGame() {
        // Reset game state
        correctLetters = [];
        wrongLetters = [];
        guessesLeft = 6;
        gameOver = false;
        
        // Select a random word based on difficulty
        const wordList = words[difficulty];
        selectedWord = wordList[Math.floor(Math.random() * wordList.length)];
        
        // Update UI
        updateWordDisplay();
        updateWrongLetters();
        guessesLeftEl.textContent = guessesLeft;
        clearCanvas();
        drawHangmanBase();
        
        // Reset keyboard buttons
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            key.disabled = false;
            key.classList.remove('correct', 'incorrect');
        });
        
        // Hide modal if shown
        resultModal.classList.remove('active');
    }
    
    // Create on-screen keyboard
    function createKeyboard() {
        keyboard.innerHTML = '';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        
        letters.forEach(letter => {
            const button = document.createElement('button');
            button.className = 'key';
            button.textContent = letter;
            button.dataset.letter = letter;
            button.addEventListener('click', () => handleGuess(letter));
            keyboard.appendChild(button);
        });
    }
    
    // Handle letter guess
    function handleGuess(letter) {
        if (gameOver) return;
        
        const button = document.querySelector(`.key[data-letter="${letter}"]`);
        button.disabled = true;
        
        if (selectedWord.includes(letter)) {
            // Correct guess
            button.classList.add('correct');
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                updateWordDisplay();
                
                // Check for win
                if (checkWin()) {
                    gameOver = true;
                    setTimeout(() => showResult(true), 500);
                }
            }
        } else {
            // Wrong guess
            button.classList.add('incorrect');
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLetters();
                guessesLeft--;
                guessesLeftEl.textContent = guessesLeft;
                drawNextBodyPart();
                
                // Check for loss
                if (guessesLeft <= 0) {
                    gameOver = true;
                    setTimeout(() => showResult(false), 1000);
                }
            }
        }
    }
    
    // Handle physical keyboard press
    function handleKeyPress(e) {
        if (gameOver) return;
        
        const key = e.key.toUpperCase();
        if (/^[A-Z]$/.test(key)) {
            const button = document.querySelector(`.key[data-letter="${key}"]`);
            if (button && !button.disabled) {
                button.click();
                // Add visual feedback for key press
                button.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 100);
            }
        }
    }
    
    // Check if player has won
    function checkWin() {
        return selectedWord.split('').every(letter => correctLetters.includes(letter));
    }
    
    // Show game result modal
    function showResult(isWin) {
        if (isWin) {
            modalTitle.textContent = 'Congratulations!';
            modalMessage.textContent = 'You guessed the word correctly!';
            wordReveal.textContent = `The word was: ${selectedWord}`;
        } else {
            modalTitle.textContent = 'Game Over!';
            modalMessage.textContent = 'You ran out of guesses!';
            wordReveal.textContent = `The word was: ${selectedWord}`;
            // Add execution animation
            canvas.classList.add('executed');
        }
        resultModal.classList.add('active');
    }
    
    // Update the word display with correct letters
    function updateWordDisplay() {
        // Clear previous display
        wordDisplay.innerHTML = '';
        
        // Create a span for each character
        selectedWord.split('').forEach(letter => {
            const span = document.createElement('span');
            if (correctLetters.includes(letter)) {
                span.textContent = letter;
                span.classList.add('revealed-letter');
            } else {
                span.textContent = '_';
            }
            span.style.display = 'inline-block';
            span.style.minWidth = '20px';
            span.style.textAlign = 'center';
            span.style.margin = '0 5px';
            
            wordDisplay.appendChild(span);
        });
    }
    
    // Update the wrong letters display
    function updateWrongLetters() {
        wrongLettersEl.textContent = wrongLetters.join(', ');
    }
    
    // Hangman drawing functions
    function clearCanvas() {
        canvas.classList.remove('executed');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
    }
    
    function drawHangmanBase() {
        // Base
        ctx.beginPath();
        ctx.moveTo(50, 280);
        ctx.lineTo(150, 280);
        ctx.stroke();
        
        // Pole
        ctx.beginPath();
        ctx.moveTo(100, 280);
        ctx.lineTo(100, 50);
        ctx.stroke();
        
        // Top
        ctx.beginPath();
        ctx.moveTo(100, 50);
        ctx.lineTo(200, 50);
        ctx.stroke();
        
        // Rope
        ctx.beginPath();
        ctx.moveTo(200, 50);
        ctx.lineTo(200, 80);
        ctx.stroke();
    }
    
    function drawNextBodyPart() {
        const partsLeft = 6 - guessesLeft;
        
        switch(partsLeft) {
            case 1: // Head
                ctx.beginPath();
                ctx.arc(200, 100, 20, 0, Math.PI * 2);
                ctx.stroke();
                break;
            case 2: // Body
                ctx.beginPath();
                ctx.moveTo(200, 120);
                ctx.lineTo(200, 180);
                ctx.stroke();
                break;
            case 3: // Left arm
                ctx.beginPath();
                ctx.moveTo(200, 130);
                ctx.lineTo(170, 150);
                ctx.stroke();
                break;
            case 4: // Right arm
                ctx.beginPath();
                ctx.moveTo(200, 130);
                ctx.lineTo(230, 150);
                ctx.stroke();
                break;
            case 5: // Left leg
                ctx.beginPath();
                ctx.moveTo(200, 180);
                ctx.lineTo(170, 220);
                ctx.stroke();
                break;
            case 6: // Right leg
                ctx.beginPath();
                ctx.moveTo(200, 180);
                ctx.lineTo(230, 220);
                ctx.stroke();
                
                // Face - sad when game over
                ctx.beginPath();
                ctx.arc(195, 95, 3, 0, Math.PI * 2); // Left eye
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(205, 95, 3, 0, Math.PI * 2); // Right eye
                ctx.stroke();
                
                ctx.beginPath();
                ctx.arc(200, 110, 8, 0, Math.PI); // Mouth (sad)
                ctx.stroke();
                break;
        }
    }
    
    // Initialize the game
    init();
});