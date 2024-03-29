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
    shuffledDeck = [];
    playerHand = [];
    dealerHand = [];
    betAmount = MINIMUM_BET;
    playerBank = INITIAL_PLAYER_BANK;
    render();
  }

  function render() {

  }

  function buildOriginalDeck() {

  }