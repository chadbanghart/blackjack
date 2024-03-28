  /*----- constants -----*/


  /*----- state variables -----*/
  
  let handStatus;
  let deck;
  let playerHand;
  let dealerHand;
  let betAmount;
  let playerBank;

  /*----- cached elements  -----*/


  /*----- event listeners -----*/


  /*----- functions -----*/

  function init() {
    handStatus = null;
    deck = [];
    playerHand = [];
    dealerHand = [];
    betAmount = 10;
    playerBank = 100;
  }