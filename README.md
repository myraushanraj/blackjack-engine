# blackjack-engine
# Run Project
1. npm install
2. enter mongodb details in .env file
3. node ./bin/www or nodemon
4. app is running on 8080 port

API Details
1. Initiate(deal):- localhost:8080/game/deal //pass random user_id and bet amount
2. Draw cards(hit):- localhost:8080/game/hit //pass match_id which got frpm 1 API
3. Draw cards to Dealer(stand) :-  localhost:8080/game/stand //pass match_id which got frpm 1 API
3. Game history or all data(stand) :-  localhost:8080/game/shuffle-card //pass match_id which got frpm 1 API
