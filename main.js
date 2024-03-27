  /*----- constants -----*/


  /*----- state variables -----*/
  
  // winner
  // deck
  // playerHand
  // dealerHand
  // betAmount
  // playerBank


  /*----- cached elements  -----*/


  /*----- event listeners -----*/


  /*----- functions -----*/

  

  /*
  notes from discussion with Jim - shuffle a new deck for every hand.
  deck should be an array of objects

  Pseudocode

  1) Define required constants
    1.1) Define a CARDS array of objects that stores all of the cards of the deck and declares each cards value
    1.2) Define the MINIMUM_BET
    1.3) Define the INITIAL_PLAYER_BANK value
    1.4) Define what the ODDS_PAYOUT of a player blackjack is

  2) Define required variables used to track the state of the game
    2.1) Use a deck variable to store an array to represent the cards available to play with
    2.2) Use a playerHand variable to store the players current hand
    2.3) Use a dealerHand variable to store the dealers current hand
    2.4) Use a winner variable to determine if the status of the game. i.e. player has busted, won, drawn-tied, or no result yet.
    2.5) Use a betAmount variable to accept input of the players desired wager amount for each hand
    2.6) Use a playerBank variable to track how much money the player has remaining

  3) Store elements on the page that will be accessed in code more 
  than once in variables to make code more consise, readable and performant.
    3.1) Store the buttons Hit, Stand, Double Down, and Deal.
    3.2) Store the playerInput for their betAmount.

  4) Upon loading the app should:
    4.1) Initialize the state variables
      4.1.1) Initialize the new deck to shuffledDeck
      4.1.2) Initialize the playerHand
      4.1.3) Initialize the dealerHand
      4.1.4) Initialize winner to null to represent that there is no winner yet
      4.1.5) Initialize the betAmount to MINIMUM_BET, this will later be updated to whatever the player decides, 
             so long as it is > MINIMUM_BET
      4.1.6) Initialize the playerBank to $100.
    4.2) Render those values to the page
      4.2.1) set a container and then a height for the playerHand
      4.2.2) set a container and then a height for the dealerHand   
    4.3) Render a message
      4.3.1) Ask the player how much they would like to bet, store value for this hand. This bet amount should be their default 
      amount unless they decide to change the amount later.
    4.4) Render Controls
      4.4.1) buttons should render to the page
        4.4.1.1) the deal button should be the only available/clickable button at this point
    4.4) Wait for the user to click a button

  5) Handle player clicking button
    5.1) user clicks deal button
      5.1.1) when clicked both hands should be dealt
        5.1.2) two cards from the shuffledDeck should be moved from the shuffledDeck to the playerHand
          5.1.2.1) Render the playerHand. Both cards should be face up
        5.1.3) two cards from the shuffledDeck should be moved from the deck to the dealerHand
          5.1.3.1) Render the dealerHand. The first card should be face down and the second should be face up.   
    5.2) Calculate playerHand value
      5.2.1) if player gets blackjack, they win the hand and get paid out at the blackjack ODDS_PAYOUT rate
        5.2.1.1) Blackjack only occurs if player gets 21 on their deal (only two cards exist in their hand).
      5.2.2) playerHand is still eligible as long as it is under 21
      5.2.3) if player has an 'Ace' in their hand assign its appropriate value
        5.2.3.1) value of Ace should equal 11 as long as they do not exceed 21. if it exceeds 21 with ace value of 11 it converts to a 1.
      5.2.4) most of logic should be applicable to both calculating player and dealer hands  
    5.3) Handle player stand
      5.3.1) all buttons become unavailable until computer turn has finished and hand is over
    5.4) Handle player hit
      5.4.1) deal player the next card from the shuffledDeck
      5.4.2) hit is available until they bust or stand
    5.5) Handle player double down
      5.5.1) can only be done after hand is dealt. cannot be used or accessed once a hit has occured on said hand
      5.5.2) player betAmount doubles
      5.5.3) player gets hit one and only one card. they either bust or are forced to stand with their new value and their turn ends.
    5.6) if player busts, they lose
    5.7) if player stands, it is now the computers turn
      5.7.1) flip over computers face down card
      5.7.2) computer must hit until they reach a soft 17 or have busted
        5.7.2.1) soft 17 means if they reach 17 with an Ace in their hand. that they must hit again if that Ace's value is 11 and not 1.
      5.7.3) once computer turn is over, return winner of hand
        5.7.3.1) update message
        5.7.3.2) update playerBank

  6) Handle player clicking deal button again...
    6.1) upon end of a hand, all buttons aside from from deal button should disappear
      6.1.1) player should be able to change their bet for the next hand if desired
      6.1.2) player click deal button to start a new hand
        6.1.2.1) Do steps 4.1.1 (init deck shuffle) and 5.1 (render player and dealer hands) 


  BONUS IDEAS)
    Splitting hands not necessary
    implement dealer messages with what the house recommends the player does in the situation
    if a player has not changed their bet value after 5 hands the dealer chimes in with a message to let them know they can increase their bet amount
    Dealer says "winner winner chicken dinner" on a blackjack
    implement a "How to play Blackjack link" - thinking if this link is clicked a popup happens on the screen that explains the basics and maybe a little about the more advanced bets
      hide/show - z-index property
    show a chips being added or disappearing from the pot  
    */  







    /*

  Blackjack has a deck of 52 cards. in this deck there are 4 suits - hearts, diamonds, clubs, and spades. 
  Each suit has a card ranging from 2-10 and then face cards of jack, queen, king, and ace.
  Each card number is the value that card holds, the face cards - jack, queen, and king 
  all equal 10, while the ace can equal 1 or 11.

  In the game of blackjack there are two players. the user and the dealer (computer).

  The objective is to beat the dealer. In order to beat the dealer the user must either score higher than
  the dealer or the dealer must bust. The user plays their turn first. the users goal is for the sum of 
  their cards to get as  close to 21 with out exceeding 21.
  If the users total card values exceed 21, the user loses (busts).
  To start a hand, you are dealt 2 cards, you now have the choice of either being dealt 
  another card(hit) or stick with your hand(stand).
  You are allowed to hit until you decide to stand or until you bust.

  player bank - the player will start with $100. the minimum wager per hand is $10, the maximum is however
  much money they have in their bank. The default wager will be $10. The game will end when you run out of 
  money.
  
  Dealer rules - once you have completed your turn, it is now the dealers turn. If you busted 
  then the dealer wins if you did not bust, the dealer must hit their hand until they have reached 17. 
  If the dealer reaches 17 with an ace whos value can still be 11 in their hand they must hit again.
  e.g. A & 6 - the dealer must hit. A, 6, & 10 - the dealer must stay.

  special plays - double down and splitting hand. 

    the user is allowed to "double down" only when they have two cards.
  when the user doubles down, they match their initial bet and that is now their total bet for the hand.
  now they get dealt one and only one card and that ends their turn.

    the user can split their hand, if the cards they were dealt are the same value. by splitting they are 
  now playing two separate hands and must match their initial bet for the second hand. they get another 
  card dealt to each hand and then play both hands separately from there. if they user gets a match on 
  their new hand they are allowed to split again if they wish. once they can split no more, all hands 
  they have must be played with a wager that is the same as their initial wager.
    
    
    e.g. of splitting hand - the user is dealt 8 of hearts & 8 of diamonds, they split it. they get dealt a 
    10 on the 8 of hearts. and the 8 of clubs on the 8 of diamonds they split the new set of 8s again and 
    now have 3 separate hands. the 8 of clubs gets a 2 and the 8 of diamonds gets dealt a King. the user 
    decides to stand on the 8 & 10 hand. they hit the 8 & 2 and get a Jack, they decide to stand. and they 
    stand on the 8 and King hand. the dealer gets a 19. so the user loses the first and third hand but wins 
    the second. If their initial bet was $10, they have bet $30 in total and won $20 amounting to losing 
    $10 that hand.
*/
