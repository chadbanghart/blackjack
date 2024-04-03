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
let playerBusted;
let dealIsClicked;
let isDealerTurn;
let initRunning;

  /*----- cached elements  -----*/
const dealBtn = document.getElementById('deal');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const doubleDownBtn = document.getElementById('dd');
const betBtns = [ ...document.querySelectorAll('.bet-buttons > button') ];
const playerHandContainer = document.getElementById('player-container');
const dealerHandContainer = document.getElementById('dealer-container');
const dealerMsgEl = document.querySelector('.dealer-message');
const currentBetEl = document.getElementById('current-bet');
const blackjackOddsEl = document.getElementById('bj-odds');
const minBetEl = document.getElementById('min-bet');
const playerBankTextEl = document.getElementById('bank-value-text');
const playerBankResultEl = document.getElementById('bank-text');
const betBtnEls = document.querySelector('.bet-buttons');
const hiddenBtn = document.getElementById('hidden-button');

  /*----- event listeners -----*/
dealBtn.addEventListener('click', handleDeal);
hitBtn.addEventListener('click', playerHit);
standBtn.addEventListener('click', playerStand);
doubleDownBtn.addEventListener('click', playerDoubleDown);
betBtnEls.addEventListener('click', handleBetAmount);
betBtnEls.addEventListener('contextmenu', handleSubtractBetAmount);
hiddenBtn.addEventListener('click', init);

 

  /*----- functions -----*/
init();


function init() {
  handStatus = null;
  initRunning = true;
  dealIsClicked = false;
  isDealerTurn = false;
  shuffledDeck = getNewShuffledDeck();
  playerHand = [];
  dealerHand = [];
  playerTotal = dealerTotal = 0;
  betAmount = MINIMUM_BET;
  playerBank = INITIAL_PLAYER_BANK;
  playerBusted = false;
  hiddenBtn.style.visibility = 'hidden';
  minBetEl.innerText = `Minimum Bet: $${MINIMUM_BET}`;
  blackjackOddsEl.innerText = `Blackjack Pays ${ODDS_PAYOUT}x`;
  dealerMsgEl.innerHTML = '<span>Dealer: Welcome to the game of Blackjack. First input your bet amount by clicking the chips, then click Deal to begin!</span>';
  currentBetEl.innerText = `${MINIMUM_BET}`;
  playerBankResultEl.innerText = '';
  render();
}

function render() {
    renderHands();
    renderMessage();
    renderControls();
}

function renderHands() {
  if (initRunning) {
    renderCardsInContainer(playerHand, playerHandContainer);
    renderCardsInContainer(dealerHand, dealerHandContainer);
  }
  if (dealIsClicked) {
    renderCardsInContainer(playerHand, playerHandContainer);
    renderDealerCardsOnDealInContainer(dealerHand, dealerHandContainer);
  } 
  if (isDealerTurn) {
    renderCardsInContainer(dealerHand, dealerHandContainer);
  }
  if (handStatus) {
    renderCardsInContainer(playerHand, playerHandContainer);
    renderCardsInContainer(dealerHand, dealerHandContainer);
  }
  if (playerBusted) {
    renderCardsInContainer(playerHand, playerHandContainer);
    renderCardsInContainer(dealerHand, dealerHandContainer);
  }

}

function renderMessage() {
  playerBankTextEl.innerText = `${playerBank}`;
  checkEmptyBank();
}

function renderControls() {
  // on page load only deal and wager buttons should be available
  if (initRunning) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    doubleDownBtn.disabled = true;
    betBtnEls.style.visibility = 'visible';
    dealBtn.disabled = false;
    return;
  }

  // Deal & Bet Btns only available on init() & when handStatus is truthy
  if (!dealIsClicked || handStatus) {
    betBtnEls.style.visibility = 'visible';
    dealBtn.disabled = false;
  } else {
    betBtnEls.style.visibility = 'hidden';
    dealBtn.disabled = true;
  }

  // DD only available prior to any other action after deal
  doubleDownBtn.disabled = playerHand.length < 3 ? false : true;

  // Hit and Stand only available after deal and before the dealer turn starts
  if (!isDealerTurn) {
    hitBtn.disabled = false;
    standBtn.disabled = false;
  } else {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    doubleDownBtn.disabled = true;
  }

  // on bust or blackjack only deal and wager btns are available
  if (playerBusted || handStatus === 'PBJ' || handStatus === 'DBJ') {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    doubleDownBtn.disabled = true;
  }

  // player out of money hide all buttons
  if (playerBank < MINIMUM_BET) {
    betBtnEls.style.visibility = 'hidden';
    dealBtn.disabled = true;
  }

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
  dealIsClicked = true;
  handStatus = null;
  isDealerTurn = false;
  initRunning = false;
  playerBusted = false;
  dealerMsgEl.innerText = '';
  currentBetEl.innerText = `${betAmount}`;
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
    playerBusted = true;
    playerBust();
  }
}
  
function playerHit() {
  calculateHandTotal(playerHand, playerTotal);
  playerHand.push(shuffledDeck.shift());
  checkForPlayerBust(playerTotal);
  render();
  }

function playerStand() {
  playerTotal = calculateHandTotal(playerHand, playerTotal);
  dealerPlay();
  render();
}

function playerDoubleDown() {
  if (betAmount > playerBank) {
    dealerMsgEl.innerText = 'Dealer: You do not have enough money to double down. your bet will not be doubled, but I have given you a standard hit and you can resume playing.';
    playerHit();
    return;
  }
  playerBank -= betAmount;
  betAmount *= 2;
  currentBetEl.innerText = `${betAmount}`;
  playerHit();
  if (playerBusted) {
    playerBust();
  } else {
  playerStand();
  }
  render();  
}

function playerBust() {
    dealerMsgEl.innerHTML = '<span>Dealer: Tough break, you Busted! I win this hand!</span>';
    handStatus = 'D';
    settleBet();
    render();
    return;
  }; 

function dealerPlay() {
  isDealerTurn = true;
  dealerTotal = calculateHandTotal(dealerHand);
  render();
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
  dealerPlay();
}

function dealerStand() {
  getOutcome();
}

function dealerBust() {
  dealerMsgEl.innerHTML = '<span>Dealer: Ah, I Busted! You win this hand!</span>';
  handStatus = 'P'
  settleBet();
  render();
}

function getOutcome() {
  if (playerTotal > dealerTotal) {
    if (handStatus === 'PBJ') {
      dealerMsgEl.innerHTML = `<span>Dealer: Winner Winner, Chicken Dinner! You got a Blackjack this hand!</span>`;
      render();
    } else {
    handStatus = 'P';
    dealerMsgEl.innerHTML = `<span>Dealer: You won this hand! ${playerTotal} beats ${dealerTotal}.</span>`;
    }
  } else if (dealerTotal > playerTotal) {
    if (handStatus === 'DBJ') {
      dealerMsgEl.innerHTML = `<span>Dealer: Sorry! I got a Blackjack this hand!</span>`;
      render();
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
  return handStatus;
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
  } else {
    return;
  }
  render();
  return playerBank;
}

function checkEmptyBank() {
  if (playerBank < 10 && handStatus) {
    dealerMsgEl.innerText = 'Dealer: Sorry you need at least $10 to play a hand. We do have an ATM if you would like to make a withdrawl.';
    hiddenBtn.style.visibility = 'visible';
  } else return;
}

function checkLegalBetAmount() {
  if (betAmount > playerBank) {
    dealerMsgEl.innerText = `Dealer: You cannot bet more than what you have in your bank! The max you can bet right now is $${playerBank}. Your bet amount has been set to ${playerBank}`;
    betAmount = playerBank;
    currentBetEl.innerText = `${betAmount}`;
  }
}

function handleBetAmount(evt) {
  let chipId = evt.target.id;
  if (chipId in CHIPS) {
    betAmount += CHIPS[chipId];
    if (betAmount > playerBank) {
      dealerMsgEl.innerText = `Dealer: You cannot bet more than what you have in your Bank.`;
      betAmount = playerBank;
      currentBetEl.innerText = `${betAmount}`;
    } else {
    currentBetEl.innerText = `${betAmount}`;
    }
  } 
}

function handleSubtractBetAmount(evt) {
  evt.preventDefault();
  let chipId = evt.target.id;
  if (chipId in CHIPS) {
    betAmount -= CHIPS[chipId];
    if (betAmount < MINIMUM_BET) {
      dealerMsgEl.innerText = `Dealer: You cannot bet less than $${MINIMUM_BET}.`;
      betAmount = MINIMUM_BET; 
      currentBetEl.innerText = `${betAmount}`;
    } else {
    currentBetEl.innerText = `${betAmount}`;
    }
  }
}
