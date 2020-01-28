var mongoose = require('mongoose');


// define the schema for deal
var gameDealSchema = new mongoose.Schema({

	"user_id": {
		type: String,
		index: true
    },
    "amount":{
        type:Number,
        index:true
	},
	"user_cards":{
		type:Object,
		default:[]
	},
	"dealer_cards":{
		type:Object,
		default:[]
	},
	"shuffle_cards":{
		type:Object,
		default:[]
	},
	"user_score":{
		type:Number,
		default:0
	},
	dealer_score:{
		type:Number,
		default:0
	},
	"winner_details":{
	 type:Object,
	 default:[],
	 "winner_amount":{
		 type:Number,
		 default:0
	 },
	 "winner":{
		 type:String,
		 default:"n/a"

	 }
	},
    "created": {
		type: Number,
		default:  Date.now(),
		trim: true
	},

	"updated": {
		type: Number,
		default: null,
		trim: true
	},

	"active": {
		type: String,
		default: true
	},
	
},
	{
		timestamps: true
	});






	gameDealSchema.pre('save', function (next) {
	this.updated = Date.now();
	
	next();
});

module.exports = mongoose.model('gameDeal', gameDealSchema);