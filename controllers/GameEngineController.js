const gameInternal=require("./common/gameInternal");
const gameDealModel=require("../models/gameDeal")

module.exports = {
  // User register

  initialize: async (req, res) => {
    var cards=gameInternal.deckOfCards(req,res);

        var shuffledCard=  await gameInternal.shuffle(cards,res);
        res.status(200).json(shuffledCard);
  },

  gamedeal:async (req, res) => {
    var cards=gameInternal.deckOfCards(req,res);

        var shuffledCard=  await gameInternal.shuffle(cards,res);
      
       var userCards=[shuffledCard[1],shuffledCard[2]];
       //user score calculation
       var userScore=0;
       for(var i=0;i<userCards.length;i++){
        if(typeof userCards[i].Value=="string"){
             if(userCards[i].Value=="A"){
                if(userScore<11)
                  userScore=userScore+11;
                  else
                  userScore=userScore+1;

             }
             else{
              userScore=userScore+10;
             }
        }
        else{
           userScore=userScore+Number(userCards[i].Value);
        }
       
       }

       //dealer score calculation 
       var dealerScore=0;
       if(typeof shuffledCard[0].Value=="string"){
         if(shuffledCard[0].Value=="A"){
              dealerScore=dealerScore+11;
            }
          else{
            dealerScore=dealerScore+10;
          }
       }
       else{
        dealerScore=dealerScore+Number(shuffledCard[0].Value);
     }
    
      
        var gameDeal=new gameDealModel({
          user_id:req.body.user_id,
          amount:req.body.amount,
          shuffle_cards:shuffledCard,
          user_cards:userCards,
          dealer_cards:[shuffledCard[0]],
          user_score:userScore,
          dealer_score:dealerScore

        })

        gameDeal.save(function(err,data){
          if(err){
            res.status(400).json(err);
          }
          else{
            res.status(200).json({
              "status": "success",
              "matchId":data._id,
              "userCards": data.user_cards,
              "dealerCards":data.dealer_cards,
              "Score":data.user_score,
              "dealerScore":data.dealer_score
            });
          }
        })
  },

  gamehit:(req, res) => {
        gameDealModel.findById({"_id":req.body.match_id},(err,data)=>{
          if(err){
            res.status(400).json(err);
          }
          else{
            var a=data.user_cards;
            var b=data.shuffle_cards[a.length+1];
            a.push(b)
           data.markModified('user_cards');

           //update user score
           if(typeof data.shuffle_cards[a.length].Value=="string"){
                if(data.shuffle_cards[a.length].Value=="A"){
                    data.user_score=data.user_score+11;
                  }
                else{
                  data.user_score=data.user_score+10;
                }
             }
          else{
            data.user_score=data.user_score+Number(data.shuffle_cards[a.length].Value);

           

           }

           if(data.user_score>20){
             if(data.user_score==21){
                function declare_result(){
                            let b=data.dealer_cards;
                            let c=data.shuffle_cards[a.length+1];
                            //update dealer card
                                b.push(c);
                            //update dealer score
                                if(typeof data.dealer_cards[data.dealer_cards.length-1].Value=="string"){
                                        if(data.dealer_cards[data.dealer_cards.length-1].Value=="A"){
                                          if(data.dealer_score<11)
                                          data.dealer_score=data.dealer_score+11;
                                          else
                                          data.dealer_score=data.dealer_score+1;
                                          }
                                        else{
                                          data.dealer_score=data.dealer_score+10;
                                        }
                                }
                                else{
                                    data.dealer_score=data.dealer_score+Number(data.dealer_cards[data.dealer_cards.length-1].Value);

                                  }
                            //update data in db
                            data.markModified('dealer_cards');
                            data.save(function(err,saveddata){
                              if(err){
                                return res.status(400).json(err);
                              }
                              else{
                                //check dealer current score
                                if(data.dealer_score>16){
                                  //final result here

                                  //calculate final result
                                  if(data.dealer_score>data.user_score){
                                      //credit wallet logic goes here
                                      if(data.dealer_score>21){
                                        return res.status(200).json({
                                          "status": "success",
                                          "matchId":data._id,
                                          "result": "You Won",
                                          "userCards": data.user_cards,
                                          "dealerCards":data.dealer_cards,
                                          "Score":data.user_score,
                                          "dealerScore":data.dealer_score
                                        });
                                      }
                                        return res.status(200).json({
                                          "status": "success",
                                          "matchId":data._id,
                                          "result": "You Loose",
                                          "userCards": data.user_cards,
                                          "dealerCards":data.dealer_cards,
                                          "Score":data.user_score,
                                          "dealerScore":data.dealer_score
                                        });
                                  }
                                  else if(data.dealer_score==data.user_score){
                                      //credit wallet logic goes here
                                    return res.status(200).json({
                                      "status": "success",
                                      "matchId":data._id,
                                      "result": "Game Tie",
                                      "userCards": data.user_cards,
                                      "dealerCards":data.dealer_cards,
                                      "Score":data.user_score,
                                      "dealerScore":data.dealer_score
                                    });
                                  }
                                  else {
                                    //credit wallet logic goes here
                                    return res.status(200).json({
                                      "status": "success",
                                      "matchId":data._id,
                                      "result": "you win",
                                      "userCards": data.user_cards,
                                      "dealerCards":data.dealer_cards,
                                      "Score":data.user_score,
                                      "dealerScore":data.dealer_score
                                    });
                                  }
                                  
                                }
                                else{
                                  // get antother card for dealer
                                  declare_result();
                                }



                                
                              }
                            })

                }
             declare_result();
            }
             else{
                    data.save(function(err,saveddata){
                      if(err){
                        return res.status(400).json(err);
                      }
                      else{
                        return res.status(200).json({
                          "status": "success",
                          "matchId":data._id,
                          "msg": "You Loose",
                          "userCards": data.user_cards,
                          "dealerCards":data.dealer_cards,
                          "Score":data.user_score,
                          "dealerScore":data.dealer_score
                        });
                      }
                    })
                 }
           }
           else{
            data.save(function(err,saveddata){
              if(err){
                res.status(400).json(err);
              }
              else{
                res.status(200).json({
                  "status": "success",
                  "matchId":data._id,
                  "userCards": data.user_cards,
                  "dealerCards":data.dealer_cards,
                  "Score":data.user_score,
                  "dealerScore":data.dealer_score
                });
              }
            })
           }
  
           
          

           
          }
        })   
  },
  //Show card here
  gameStand:(req,res)=>{
    gameDealModel.findById({"_id":req.body.match_id},(err,data)=>{
      if(err){
        res.status(400).json(err);
      }
      else{

        if(data.dealer_score<17){
          function declare_result(){
            var shown_cards=data.user_cards.length+data.dealer_cards.length;
            //console.log(shown_cards);
            let b=data.dealer_cards;
            let c=data.shuffle_cards[shown_cards];
            //update dealer card
                b.push(c);
            //update dealer score
                if(typeof data.dealer_cards[data.dealer_cards.length-1].Value=="string"){
                        if(data.dealer_cards[data.dealer_cards.length-1].Value=="A"){
                          if(data.dealer_score<11)
                          data.dealer_score=data.dealer_score+11;
                          else
                          data.dealer_score=data.dealer_score+1;
                          }
                        else{
                          data.dealer_score=data.dealer_score+10;
                        }
                }
                else{
                    data.dealer_score=data.dealer_score+Number(data.dealer_cards[data.dealer_cards.length-1].Value);

                  }
            //update data in db
            data.markModified('dealer_cards');
            data.save(function(err,saveddata){
              if(err){
                return res.status(400).json(err);
              }
              else{
                //check dealer current score
                if(data.dealer_score>16){
                  //final result here

                  //calculate final result
                  if(data.dealer_score>data.user_score){

                    if(data.dealer_score>21){
                      return res.status(200).json({
                        "status": "success",
                        "matchId":data._id,
                        "result": "You Win",
                        "userCards": data.user_cards,
                        "dealerCards":data.dealer_cards,
                        "Score":data.user_score,
                        "dealerScore":data.dealer_score
                      });
                    }
                    else{
                      return res.status(200).json({
                        "status": "success",
                        "matchId":data._id,
                        "result": "You Loose",
                        "userCards": data.user_cards,
                        "dealerCards":data.dealer_cards,
                        "Score":data.user_score,
                        "dealerScore":data.dealer_score
                      });
                    }
                      //credit wallet logic goes here
                       
                  }
                  else if(data.dealer_score==data.user_score){
                      //credit wallet logic goes here
                    return res.status(200).json({
                      "status": "success",
                      "matchId":data._id,
                      "result": "Game Tie",
                      "userCards": data.user_cards,
                      "dealerCards":data.dealer_cards,
                      "Score":data.user_score,
                      "dealerScore":data.dealer_score
                    });
                  }
                  else {
                    //credit wallet logic goes here
                    return res.status(200).json({
                      "status": "success",
                      "matchId":data._id,
                      "result": "you win",
                      "userCards": data.user_cards,
                      "dealerCards":data.dealer_cards,
                      "Score":data.user_score,
                      "dealerScore":data.dealer_score
                    });
                  }
                  
                }
                else{
                  // get antother card for dealer
                  declare_result();
                }



                
              }
            })

          }
          declare_result();
        }
        else{
          return res.status(400).json({
            "status":"error",
            "message":"winner already declared!"
          })
        }
       
      }
    });
  },

  //get shuffle_cards
  gameShuffleCard:(req,res)=>{
    
    gameDealModel.findById({"_id":req.body.match_id},(err,data)=>{
      if(err){
        res.status(400).json(err);
      }
      else{
        res.status(200).json({
          "status":"success",
          "cards" :data
        });
      }

    })
  },






}
