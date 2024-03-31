  /*----- constants -----*/
const SUITS = ['s', 'c', 'd', 'h'];
const RANKS = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
const ORIGINAL_DECK = buildOriginalDeck();
const MINIMUM_BET = 10;
const INITIAL_PLAYER_BANK = 500;
const ODDS_PAYOUT = 3/2;
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
const betBtns = [ ...document.querySelectorAll('#bet-buttons > button') ];
const playerHandContainer = document.getElementById('player-container');
const dealerHandContainer = document.getElementById('dealer-container');
const msgEl = document.querySelector('.dealer-message');
const currentBetEl = document.getElementById('current-bet');
const playerBankTextEl = document.getElementById('bank-inner-text');
const playerBankResultEl = document.getElementById('bank-value');

  /*----- event listeners -----*/
const deal = dealBtn.addEventListener("click", renderDealCards);
const hit = hitBtn.addEventListener("click", playerHit);
const stand = standBtn.addEventListener("click", playerStand);
const doubleDown = doubleDownBtn.addEventListener("click", playerDoubleDown);
 

  /*----- functions -----*/
init();


function init() {
  handStatus = null;
  shuffledDeck = getNewShuffledDeck();
  playerHand = [];
  dealerHand = [];
  playerTotal = dealerTotal = 0;
  betAmount = MINIMUM_BET;
  playerBank = INITIAL_PLAYER_BANK;
  msgEl.innerHTML = '<span>Dealer: Welcome to the game of Blackjack. First input your bet amount by clicking the chips (the minimum bet at this table is $10), then click Deal to begin!</span>';
  render();
}

function render() {
    renderHands();
    renderMessage();
    renderControls();
}

function renderHands () {

}

function renderMessage() {
  playerBankTextEl.innerText = `${playerBank}`;
}

function renderControls() {
  // hide buttons
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

function renderDealCards() {
  shuffledDeck = getNewShuffledDeck();
  playerHand = [shuffledDeck.shift(), shuffledDeck.shift()];
  dealerHand = [shuffledDeck.shift(), shuffledDeck.shift()];
  renderCardsInContainer(playerHand, playerHandContainer);
  renderDealerCardsOnDealInContainer(dealerHand, dealerHandContainer);
  msgEl.innerHTML = '';
  playerBankResultEl.innerHTML = '';
  handStatus = null;
  }

function renderCardsInContainer(hand, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  hand.forEach(function(card) {
    cardsHtml += `<div class="card large ${card.face}"></div>`;
  });
  container.innerHTML = cardsHtml;
}

function renderDealerCardsOnDealInContainer(hand, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  hand.forEach(function(card, index) {
    if (index === 0) {
      cardsHtml += `<div class="card large back-red"></div>`;
    } else if (index === 1) {
      cardsHtml += `<div class="card large ${card.face}"></div>`;
    }
  });
  container.innerHTML = cardsHtml;
}
  
function calculateHandTotal(hand, player) {
  let handTotal = 0;
  player;
  let aces = 0;
  hand.forEach(card => {
    handTotal += card.value;
    if (card.value === 11) {
      aces += 1;
    }
  });
    while (handTotal > 21 && aces > 0) {
      handTotal -= 10;
      aces -= 1;
    }
  player = handTotal;
  return handTotal;
}

function checkForPlayerBust(handTotal) {
  handTotal = calculateHandTotal(playerHand, playerTotal);
  if (handTotal > 21) {
    playerBust();
  }
}
  
function playerHit() {
  calculateHandTotal(playerHand, playerTotal);
  playerHand.push(shuffledDeck.shift());
  renderCardsInContainer(playerHand, playerHandContainer);
  checkForPlayerBust(playerTotal);
  }

function playerStand() {
  playerTotal = calculateHandTotal(playerHand, playerTotal);
  // disable buttons
  dealerPlay();
}

function playerDoubleDown() {
  betAmount *= 2;
  playerHit();
  playerStand();
  dealerPlay();
}

function playerBust() {
    msgEl.innerHTML = '<span>Dealer: Tough break, you Busted! I win this hand!</span>';
    handStatus = 'D';
    bankCalculation();
    // end play. player must deal again
    return;
  }; 

function dealerPlay() {
  dealerTotal = calculateHandTotal(dealerHand);
  renderCardsInContainer(dealerHand, dealerHandContainer);

  if (dealerTotal < 17) {
    dealerHit();
  } else if (dealerTotal >= 17 && dealerTotal <= 21) {
    dealerStand();
  } else {
    dealerBust();
  }
}

function dealerHit() {
  dealerHand.push(shuffledDeck.shift());
  renderCardsInContainer(dealerHand, dealerHandContainer);
  dealerPlay();
}

function dealerStand() {
  getOutcome();
}

function dealerBust() {
  msgEl.innerHTML = '<span>Dealer: Ah, I Busted! You win this hand!</span>';
  handStatus = 'P'
  bankCalculation();
}

function getOutcome() {
  if (playerTotal > dealerTotal ) {
    handStatus = 'P';
    msgEl.innerHTML = '<span>Dealer: You won this hand!</span>';
  } else if (dealerTotal > playerTotal) {
    handStatus = 'D';
    msgEl.innerHTML = '<span>Dealer: I won this hand!</span>';
  } else if (dealerTotal === playerTotal) {
    handStatus = 'T';
    msgEl.innerHTML = '<span>Dealer: This hand is a push!</span>';
  } else {
    handStatus = null;
  }
  bankCalculation();
  return handStatus;
}

function bankCalculation () {
  
  if (handStatus === 'D') {
    playerBankResultEl.innerHTML = `<span>You lost $${betAmount} this hand!</span>`;
    playerBank -= betAmount;
  } else if (handStatus === 'P') {
    playerBankResultEl.innerHTML = `<span>You won $${betAmount} this hand!</span>`;
    playerBank += betAmount;
  } else if (handStatus === 'T') {
    playerBankResultEl.innerHTML = `<span>You pushed the last hand, no money lost or won!</span>`;
    playerBank;
  } else {
    return;
  }
  render();
  return playerBank;
}