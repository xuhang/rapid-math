class MathSpeedGame {
    constructor() {
        // DOM Elements
        this.startButton = document.getElementById('startButton');
        this.numberDisplay = document.getElementById('numberDisplay');
        this.numberCard = this.numberDisplay.querySelector('.number-card');
        this.sumInput = document.getElementById('sumInput');
        this.submitButton = document.getElementById('submitSum');
        this.scoreDisplay = document.getElementById('scoreDisplay');
        this.highScoreDisplay = document.getElementById('highScoreDisplay');
        this.resultTracker = document.querySelector('.result-tracker');
        
        // Modal Elements
        this.resultModal = document.getElementById('resultModal');
        this.modalTitle = document.getElementById('modalTitle');
        this.modalMessage = document.getElementById('modalMessage');
        this.closeModal = this.resultModal.querySelector('.close-modal');
        this.modalCloseButton = document.getElementById('modalCloseButton');
        
        // Slider Elements
        this.numberRangeSlider = document.getElementById('numberRangeSlider');
        this.displayTimeSlider = document.getElementById('displayTimeSlider');
        this.numberCountSlider = document.getElementById('numberCountSlider');
        
        // Slider Value Displays
        this.rangeValueDisplay = document.getElementById('rangeValue');
        this.timeValueDisplay = document.getElementById('timeValue');
        this.countValueDisplay = document.getElementById('countValue');

        // Game State
        this.score = 0;
        this.highScore = 0;
        this.resultBlocks = [];

        this.setupEventListeners();
    }

    setupEventListeners() {
        // Slider Value Updates
        this.numberRangeSlider.addEventListener('input', () => {
            this.rangeValueDisplay.textContent = this.numberRangeSlider.value;
        });

        this.displayTimeSlider.addEventListener('input', () => {
            this.timeValueDisplay.textContent = this.displayTimeSlider.value;
        });

        this.numberCountSlider.addEventListener('input', () => {
            this.countValueDisplay.textContent = this.numberCountSlider.value;
        });

        // Start Button
        this.startButton.addEventListener('click', () => this.startGame());

        // Submit Button
        this.submitButton.addEventListener('click', () => this.checkSum());

        // Modal Close
        this.closeModal.addEventListener('click', () => this.hideModal());
        this.modalCloseButton.addEventListener('click', () => this.hideModal());
    }

    hideModal() {
        this.resultModal.classList.remove('show');
        this.resultModal.classList.add('hidden');
    }

    startGame() {
        // Hide start button, show number display and input section
        this.startButton.classList.add('hidden');
        this.numberDisplay.classList.remove('hidden');
        document.querySelector('.input-section').classList.remove('hidden');

        const numbers = this.generateNumbers();
        this.currentSum = numbers.reduce((a, b) => a + b, 0);
        this.displayNumbers(numbers);
    }

    generateNumbers() {
        const maxRange = parseInt(this.numberRangeSlider.value);
        const count = parseInt(this.numberCountSlider.value);
        
        return Array.from({length: count}, () => 
            Math.floor(Math.random() * (2 * maxRange + 1)) - maxRange
        );
    }

    displayNumbers(numbers) {
        const cardColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FDCB6E', '#6C5CE7'];
        let index = 0;
        const displayTime = parseFloat(this.displayTimeSlider.value) * 1000;

        const displayInterval = setInterval(() => {
            if (index < numbers.length) {
                this.numberCard.textContent = numbers[index];
                
                // Random rotation and color
                const rotation = (Math.random() * 20 - 10) + 'deg';
                const color = cardColors[Math.floor(Math.random() * cardColors.length)];
                
                this.numberCard.style.setProperty('--rotation', rotation);
                this.numberCard.style.backgroundColor = color;
                
                index++;
            } else {
                clearInterval(displayInterval);
                this.numberCard.textContent = '?';
                this.numberCard.style.backgroundColor = '#4a90e2';
                this.numberCard.style.setProperty('--rotation', '0deg');
            }
        }, displayTime);
    }

    checkSum() {
        const userSum = parseInt(this.sumInput.value);
        
        if (userSum === this.currentSum) {
            this.score++;
            this.scoreDisplay.textContent = this.score;
            
            // Update high score
            this.highScore = Math.max(this.score, this.highScore);
            this.highScoreDisplay.textContent = this.highScore;
            
            // Add green result block
            this.addResultBlock(true);
            
            // Show success modal
            this.showModal('Congratulations!', 'Correct answer! Your calculation speed is really fast!🎉');
            
            // Restart game
            setTimeout(() => this.startGame(), 2000);
        } else {
            // Reset score on wrong answer
            this.score = 0;
            this.scoreDisplay.textContent = this.score;
            
            // Add red result block
            this.addResultBlock(false);
            
            // Show error modal
            this.showModal('Oops!', `The correct answer is : ${this.currentSum}。Don't give up and keep pushing! `);
            
            // Restart after delay
            setTimeout(() => this.startGame(), 2000);
        }

        // Clear input
        this.sumInput.value = '';
    }

    addResultBlock(isCorrect) {
        const resultBlock = document.createElement('div');
        resultBlock.classList.add('result-block');
        resultBlock.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        this.resultTracker.appendChild(resultBlock);
        this.resultBlocks.push(resultBlock);

        // Limit to last 10 results
        if (this.resultBlocks.length > 10) {
            const oldestBlock = this.resultBlocks.shift();
            this.resultTracker.removeChild(oldestBlock);
        }
    }

    showModal(title, message) {
        this.modalTitle.textContent = title;
        this.modalMessage.textContent = message;
        this.resultModal.classList.remove('hidden');
        this.resultModal.classList.add('show');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MathSpeedGame();
});