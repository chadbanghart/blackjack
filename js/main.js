  /*----- constants -----*/
const SUITS = ['s', 'c', 'd', 'h'];
const RANKS = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const ORIGINAL_DECK = buildOriginalDeck();
const MINIMUM_BET = 10;
const INITIAL_PLAYER_BANK = 500;
const ODDS_PAYOUT = 3/2;
const CHIPS = {
  'chip-5': 5, 
  'chip-10': 10, 
  'chip-25': 25, 
  'chip-100': 100
};
  /*----- state variables -----*/
  
let handStatus;
let shuffledDeck;
let playerHand;
let dealerHand;
let betAmount;
let playerBank;
let playerTotal;
let dealerTotal;

  /*----- cached elements  -----*/
const dealBtn = document.getElementById('deal');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const doubleDownBtn = document.getElementById('dd');
const playerHandContainer = document.getElementById('player-container');
const dealerHandContainer = document.getElementById('dealer-container');
const dealerMsgEl = document.querySelector('#dealer-message');
const currentBetEl = document.getElementById('current-bet');
const blackjackOddsEl = document.getElementById('bj-odds');
const minBetEl = document.getElementById('min-bet');
const playerBankTextEl = document.getElementById('bank-value-text');
const playerBankResultEl = document.getElementById('bank-text');
const betBtnEls = document.querySelector('.bet-buttons');
const hiddenBtn = document.getElementById('start-over');
const hiddenBtnEls = document.querySelector('.hidden-button');
const betInsEl = document.getElementById('bet-instruction');

  /*----- event listeners -----*/
dealBtn.addEventListener('click', handleDeal);
hitBtn.addEventListener('click', playerHit);
standBtn.addEventListener('click', playerStand);
doubleDownBtn.addEventListener('click', playerDoubleDown);
betBtnEls.addEventListener('click', (evt) => handleBetAmount(evt, false));
betBtnEls.addEventListener('contextmenu', (evt) => handleBetAmount(evt, true));
hiddenBtn.addEventListener('click', init);

 

  /*----- functions -----*/
init();


function init() {
  handStatus = 'P';
  shuffledDeck = getNewShuffledDeck();
  playerHand = [];
  dealerHand = [];
  playerTotal = dealerTotal = 0;
  betAmount = MINIMUM_BET;
  playerBank = INITIAL_PLAYER_BANK;
  minBetEl.innerText = `Minimum Bet: $${MINIMUM_BET}`;
  blackjackOddsEl.innerText = `Blackjack Pays ${ODDS_PAYOUT}x`;
  dealerMsgEl.innerHTML = '<span>Dealer: Welcome to the game of Blackjack. First input your bet amount by clicking the chips, to make your bet official and start the hand, click Deal!</span>';
  playerBankResultEl.innerText = '';
  render();
}

function render() {
  renderHands();
  renderMessage();
  renderControls();
  currentBetEl.innerText = `${betAmount}`;
}

function renderHands() {
  renderCardsInContainer(playerHand, playerHandContainer);
  renderCardsInContainer(dealerHand, dealerHandContainer);
}

function renderMessage() {
  playerBankTextEl.innerText = `${playerBank}`;
  if (playerBank < 10 && handStatus) dealerMsgEl.innerText = 'Dealer: Sorry you need at least $10 to play a hand. We do have an ATM if you would like to make a withdrawl.';
}

function renderControls() {
  hitBtn.disabled = !!handStatus;
  standBtn.disabled = !!handStatus;
  doubleDownBtn.disabled = !!handStatus || playerHand.length !== 2 || playerBank < betAmount;
  betBtnEls.style.visibility = handStatus && playerBank >= 10 ? 'visible' : 'hidden';
  betInsEl.style.visibility = handStatus && playerBank >= 10 ? 'visible' : 'hidden';
  dealBtn.disabled = !handStatus || playerBank < 10;
  hiddenBtnEls.style.visibility = playerBank < 10 && handStatus ? 'visible' : 'hidden';
}

function buildOriginalDeck() {
  const deck = [];
  // Use nested forEach to generate card objects
  SUITS.forEach(function(suit) {
    RANKS.forEach(function(rank) {
      deck.push({
        // The 'face' property maps to the library's CSS classes for cards
        face: `${suit}${rank}`,
        // Setting the 'value' property
        value: Number(rank) || (rank === 'A' ? 11 : 10)
      });
    });
  });
  return deck;
}

function getNewShuffledDeck() {
  // Create a copy of the originalDeck (leave originalDeck untouched!)
  const tempDeck = [...ORIGINAL_DECK];
  const newShuffledDeck = [];
  while (tempDeck.length) {
    // Get a random index for a card still in the tempDeck
    const rndIdx = Math.floor(Math.random() * tempDeck.length);
    // Note the [0] after splice - this is because splice always returns an array and we just want the card object in that array
    newShuffledDeck.push(tempDeck.splice(rndIdx, 1)[0]);
  }
  return newShuffledDeck;
}

function handleDeal() {
  handStatus = null;
  dealerMsgEl.innerText = '';
  playerBankResultEl.innerHTML = '';
  checkLegalBetAmount();
  playerBank -= betAmount;
  shuffledDeck = getNewShuffledDeck();
  playerHand = [shuffledDeck.shift(), shuffledDeck.shift()];
  dealerHand = [shuffledDeck.shift(), shuffledDeck.shift()];
  playerTotal = calculateHandTotal(playerHand);
  dealerTotal = calculateHandTotal(dealerHand);
  if (playerTotal === 21 && dealerTotal === 21) {
    handStatus = 'T';
  } else if (dealerTotal === 21 && dealerHand.length === 2) {
    handStatus = 'DBJ';
  } else if (playerTotal === 21 && playerHand.length === 2) {
    handStatus = 'PBJ'
  }
  if (handStatus) getOutcome();
  render();
}

function renderCardsInContainer(hand, container) {
  let cardsHtml = '';
  hand.forEach(function(card, idx) {
    const cardClass = !handStatus && idx === 0 && hand === dealerHand ? 'back-red' : card.face;
    cardsHtml += `<div class="card large ${cardClass}"></div>`;
  });
  container.innerHTML = cardsHtml;
}
  
function calculateHandTotal(hand) {
  let handTotal = 0;
  let aces = 0;
  hand.forEach(card => {
    handTotal += card.value;
    if (card.value === 11) aces++;
  });
  while (handTotal > 21 && aces > 0) {
    handTotal -= 10;
    aces -= 1;
  }
  return handTotal;
}

function playerHit() {
  playerHand.push(shuffledDeck.shift());
  playerTotal = calculateHandTotal(playerHand);
  if (playerTotal > 21) playerBust();
  render();
}

function playerStand() {
  playerTotal = calculateHandTotal(playerHand);
  dealerPlay();
  render();
}

function playerDoubleDown() {
  playerBank -= betAmount;
  betAmount *= 2;
  playerHit();
  if (playerTotal <= 21) playerStand();
  render();  
}

function playerBust() {
  dealerMsgEl.innerHTML = '<span>Dealer: Tough break, you Busted! I win this hand!</span>';
  handStatus = 'D';
  settleBet();
  render();
}

function dealerPlay() {
  while (dealerTotal < 17) {
    dealerHand.push(shuffledDeck.shift());
    dealerTotal = calculateHandTotal(dealerHand);
  }
  if (dealerTotal <= 21) {
    getOutcome();
  } else {
    dealerBust();
  }
}

function dealerBust() {
  dealerMsgEl.innerHTML = '<span>Dealer: Ah, I Busted! You win this hand!</span>';
  handStatus = 'P';
  settleBet();
}

function getOutcome() {
  if (playerTotal > dealerTotal) {
    if (handStatus === 'PBJ') {
      dealerMsgEl.innerHTML = `<span>Dealer: Winner Winner, Chicken Dinner! You got a Blackjack this hand!</span>`;
    } else {
      handStatus = 'P';
      dealerMsgEl.innerHTML = `<span>Dealer: You won this hand! ${playerTotal} beats ${dealerTotal}.</span>`;
    }
  } else if (dealerTotal > playerTotal) {
    if (handStatus === 'DBJ') {
      dealerMsgEl.innerHTML = `<span>Dealer: Sorry! I got a Blackjack this hand!</span>`;
    } else {    
      handStatus = 'D';
      dealerMsgEl.innerHTML = `<span>Dealer: I won this hand! ${dealerTotal} beats ${playerTotal}.</span>`;
    }
  } else if (dealerTotal === playerTotal) {
    handStatus = 'T';
    dealerMsgEl.innerHTML = `<span>Dealer: This hand is a push! We both got ${playerTotal}.</span>`;
  } else {
    handStatus = null;
  }
  settleBet();
}

function settleBet() {
  if (handStatus === 'D') {
    playerBankResultEl.innerHTML = `<span>You lost $${betAmount} this hand!</span>`;
  } else if (handStatus === 'P') {
    playerBankResultEl.innerHTML = `<span>You won $${betAmount} this hand!</span>`;
    playerBank += betAmount * 2;
  } else if (handStatus === 'T') {
    playerBankResultEl.innerHTML = `<span>No money lost or won!</span>`;
    playerBank += betAmount;
  } else if (handStatus === 'PBJ') {
    let blackjackPayout = betAmount + (betAmount * ODDS_PAYOUT);
    playerBankResultEl.innerHTML = `<span>You won $${blackjackPayout - betAmount} this hand!</span>`;
    playerBank += blackjackPayout;
  } else if (handStatus === 'DBJ') {
    playerBankResultEl.innerHTML = `<span>You lost $${betAmount} this hand!</span>`;
  } 
  render();
}

function checkLegalBetAmount() {
  if (betAmount > playerBank) {
    dealerMsgEl.innerText = `Dealer: You cannot bet more than what you have in your bank! The max you can bet right now is $${playerBank}. Your bet amount has been set to ${playerBank}`;
    betAmount = playerBank;
    render();
  }
}

function handleBetAmount(evt, subtract) {
  evt.preventDefault();
  let chipId = evt.target.id;
  if (chipId in CHIPS) {
    betAmount += subtract ? -CHIPS[chipId] : CHIPS[chipId];
    if (betAmount > playerBank) {
      dealerMsgEl.innerText = `Dealer: You cannot bet more than what you have in your Bank.`;
      betAmount = playerBank;
    } else if (betAmount < MINIMUM_BET) {
      dealerMsgEl.innerText = `Dealer: You cannot bet less than $${MINIMUM_BET}.`;
      betAmount = MINIMUM_BET; 
    } 
    render(); 
  } 
}