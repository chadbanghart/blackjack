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
  bankCalculation();
}

function renderControls() {

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
  renderCardsInContainer(dealerHand, dealerHandContainer);
  }

function renderCardsInContainer(hand, container) {
  container.innerHTML = '';
  let cardsHtml = '';
  hand.forEach(function(card) {
    cardsHtml += `<div class="card large ${card.face}"></div>`;
  });
  container.innerHTML = cardsHtml;
}
  
function calculateHandTotal(hand) {
  let handTotal = 0;
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
  return handTotal;
}
  
function playerHit(curPlayerHand) {
  curPlayerHand = calculateHandTotal(playerHand);
  if (curPlayerHand > 21) {
    playerBust();
  } else {
  playerHand.push(shuffledDeck.shift());
  renderCardsInContainer(playerHand, playerHandContainer);
  }
}

function playerStand() {

  playerTotal = calculateHandTotal(playerHand);
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
  let hand = calculateHandTotal(playerHand);
  if (hand > 21) {
    msgEl.innerHTML = '<span>Dealer: You Busted!</span>';
    handStatus = 'D';
    dealerPlay();
  };
}

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
console.log("Dealer must stay");
}

function dealerBust() {
  handStatus = 'P'
  console.log("Dealer Busts");
}

function getOutcome() {
  if (playerTotal > dealerTotal) {
    handStatus = 'P';
  } else if (dealerTotal > playerTotal) {
    handStatus = 'D';
  } else if (dealerTotal = playerTotal) {
    handStatus = 'T';
  } else {
    handStatus = null;
  }
  render();
  return handStatus;
}

function bankCalculation () {
  if (handStatus === null) return;
  if (handStatus === 'D') {
    playerBankResultEl.innerHTML = `<span>You lost $${betAmount} last hand!</span>`;
    playerBank -= betAmount;
  } else if (handStatus === 'P') {
    playerBankResultEl.innerHTML = `<span>You won $${betAmount} last hand!</span>`;
    playerBank += betAmount;
  } else {
    playerBankResultEl.innerHTML = `<span>You pushed the last hand, no money lost or won!</span>`;
  }
  return playerBank;
}