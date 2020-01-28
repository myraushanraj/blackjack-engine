

//fortuna requirement
const fortuna = require('javascript-fortuna');
const si = require('systeminformation');
const sha512 = require('js-sha512');
const jsspg = require('javascript-strong-password-generator');

var suits = ["spades", "diamonds", "clubs", "hearts","spades", "diamonds", "clubs", "hearts","spades", "diamonds", "clubs", "hearts"];
var values = ["A", 2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K"];
module.exports = {
    // User register
  
    deckOfCards: (req, res) => {
        var deck = new Array();

        for(var i = 0; i < suits.length; i++)
        {
            for(var x = 0; x < values.length; x++)
            {
                var card = {Value: values[x], Suit: suits[i]};
                deck.push(card);
            }
        }
    
        return deck;
        
    },

    shuffle:async (deck,res)=>{
        // for 1000 turns
	// switch the values of two random cards
	for (var i = 0; i < 1000; i++)
	{
		var location1 = Math.floor((Math.random() * deck.length)); //get a random no b/w 1 to 156 ?15
		var location2 = Math.floor((Math.random() * deck.length)); //get a random no b/w 1 to 156 ?10
		var tmp = deck[location1];                                 // store in temp=14

		deck[location1] = deck[location2];
		deck[location2] = tmp;
    }
    

   return await deck;
    },
    fortunaShuffle: (cardsDecksArray) => {
        try {
            // console.log(cardsDecksArray,'cardsDecksArray')
            return new Promise(async (resolve) => {
                function entropyAccumFunction() {
                    return new Promise(async (resolve) => {
                        const cpuSpeed = await si.cpu();
                        const processes = await si.processes();
                        const disksIO = await si.disksIO();
                        const memory = await si.mem();
                     
                        jsspg.entropyVal = sha512(`${JSON.stringify(cpuSpeed)}:${JSON.stringify(processes)}:${JSON.stringify(disksIO)}:${JSON.stringify(memory)}`);
                        
                        // jsspg.entropyVal = await sha512(`sdfasdfsdfsdfsdf`);
                    
                        // console.log(`ent: ${jsspg.entropyVal}`);
                        resolve();
                    });
                }
    
                function entropyFunction() {
                    console.log(jsspg.entropyVal);
                    return jsspg.entropyVal;
                }
    
                let entropyInterval = setInterval(async () => {
                    console.log('111111111111111111111111')
                  //  await entropyAccumFunction();
                    console.log('222222222222222222222222')
                }, 300);
    
                jsspg.initialized = true;
    
                setTimeout(() => {
                    // console.log(`################################################I picked 111 !`);
                    fortuna.init({ timeBasedEntropy: true, accumulateTimeout: 100, entropyFxn: entropyFunction });
                    const num1 = fortuna.random();
                    clearInterval(entropyInterval);
                    fortuna.stopTimer();
                    // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@I sdfsdfdsfds ${num1}!`);
                    var currentIndex = cardsDecksArray.length
                        , temporaryValue
                        , randomIndex
                        ;
    
                    // While there remain elements to shuffle...
                    while (0 !== currentIndex) {
    
                        // Pick a remaining element...
                        randomIndex = Math.floor(fortuna.random() * currentIndex);
                        currentIndex -= 1;
    
                        // console.log('ssssssssssssssssssssssssssssssssss - ', currentIndex, 'randomIndex', randomIndex)
                        // And swap it with the current element.
                        temporaryValue = cardsDecksArray[currentIndex];
                        cardsDecksArray[currentIndex] = cardsDecksArray[randomIndex];
                        cardsDecksArray[randomIndex] = temporaryValue;
    
    
                    }
                    resolve(cardsDecksArray);
                }, 750);
            })
        }
        catch (err) {
            console.log(err, 'ssss')
        }
    }
  
  
  
  
  };