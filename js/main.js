  /*----- constants -----*/
  const SUITS = ['s', 'c', 'd', 'h'];
  const RANKS = ['02', '03', '04', '05', '06', '07', '08', '09', '10', 'J', 'Q', 'K', 'A'];
  const ORIGINAL_DECK = buildOriginalDeck();
  const MINIMUM_BET = 10;
  const INITIAL_PLAYER_BANK = 100;
  const ODDS_PAYOUT = 3/2;
  /*----- state variables -----*/
  
  let handStatus;
  let shuffledDeck;
  let playerHand;
  let dealerHand;
  let betAmount;
  let playerBank;

  /*----- cached elements  -----*/
const dealBtn = document.getElementById('deal');
const hitBtn = document.getElementById('hit');
const standBtn = document.getElementById('stand');
const doubleDownBtn = document.getElementById('dd');
const chip5Btn = document.getElementById('chip-5');
const chip10Btn = document.getElementById('chip-10');
const chip25Btn = document.getElementById('chip-25');
const chip100Btn = document.getElementById('chip-100');


  /*----- event listeners -----*/


  /*----- functions -----*/
init();


  function init() {
    handStatus = null;
    shuffledDeck = getNewShuffledDeck();
    playerHand = [];
    dealerHand = [];
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