let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let timer;
let time = 0;
let moves = 0;
document.getElementById('reset-button').style.display = 'none';
const gameBoard = document.getElementById('game-board');
// Victory modal
const victoryModal = document.createElement('div');
victoryModal.classList.add('victory-modal');
victoryModal.innerHTML = `
    <div class="modal-content">
        <h2>Congratulations!</h2>
        <p>You won the game!</p>
        <p>Time: <span id="final-time"></span></p>
        <p>Moves: <span id="final-moves"></span></p>
        <button id="close-modal">Close</button>
    </div>
`;
document.body.appendChild(victoryModal);
document.getElementById('start-button').addEventListener('click', startGame);

function startGame() {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('reset-button').style.display = 'inline-block';
    resetGame();
    shuffleCards();
    createCards();
    startTimer();
}

function resetGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    time = 0;
    moves = 0;
    gameBoard.innerHTML = '';
    document.getElementById('time').textContent = time;
}

function shuffleCards() {
    const cardValues = ['1', '2', '3', '4', '5', '6', '7', '8'];
    // Duplicate the values to make pairs
    const doubledValues = [...cardValues, ...cardValues];
    // Shuffle the card values array
    for (let i = doubledValues.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [doubledValues[i], doubledValues[j]] = [doubledValues[j], doubledValues[i]];
    }
    cards = doubledValues.map(value => {
        return { value, flipped: false };
    });
}

function createCards() {
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.index = index;
        cardElement.addEventListener('click', flipCard);
        gameBoard.appendChild(cardElement);
    });
}

function flipCard(event) {
    const index = event.target.dataset.index;
    const card = cards[index];

    if (card.flipped || flippedCards.length === 2) return;

    card.flipped = true;
    event.target.textContent = card.value;
    event.target.classList.add('flipped');
    flippedCards.push({ card, element: event.target });
    moves++;

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    const [first, second] = flippedCards;
    if (first.card.value === second.card.value) {
        matchedPairs++;
        flippedCards = [];
        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        setTimeout(() => {
            first.element.textContent = '';
            second.element.textContent = '';
            first.element.classList.remove('flipped');
            second.element.classList.remove('flipped');
            first.card.flipped = false;
            second.card.flipped = false;
            flippedCards = [];
        }, 1000);
    }
}

function startTimer() {
    timer = setInterval(() => {
        time++;
        document.getElementById('time').textContent = time;
        document.getElementById('moves').textContent = Math.floor(moves/2);
    }, 1000);
}

function endGame() {
    clearInterval(timer);
    document.getElementById('moves').textContent = Math.floor(moves/2);
    document.getElementById('final-time').textContent = time;
    document.getElementById('final-moves').textContent = Math.floor(moves/2);
    victoryModal.classList.add('active');
}
document.getElementById('reset-button').addEventListener('click',function(){
    startGame();
});
document.getElementById('close-modal').addEventListener('click',function(){
    victoryModal.classList.remove('active');
});
