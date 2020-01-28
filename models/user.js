var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

const ObjectId = mongoose.Schema.Types.ObjectId;


// define the schema for user model
var UserSchema = new mongoose.Schema({

	"user_id": {
		type: String,
		index: true
	},

	"avatar": {
		type: String,
		default: 'https://media.licdn.com/dms/image/C5103AQE-vBVBqJ-ySw/profile-displayphoto-shrink_200_200/0?e=1570665600&v=beta&t=kT6jVGq0RFK8gxgo1erZtfOSmpnhaklkLvOrsb1V2L8'
	},

	"avatarindex" : {
		type : Number,
		default : 0
	},

	"name": {
		type: String,
		index: true
	},

	"firstname": {
		type: String,
		index: true
	},

	"lastname": {
		type: String,
		index: true
	},

	"displayname": {
		type: String,
		index: true
	},

	"username": {
		type: String,
		index: true
	},

	"displayusername": {
		type: String,
		index: true
	},

	"useremail": {
		type: String,
		index: true
	},

	"useremailverification": {
		type: Boolean,
		default: false
	},

	"verifyemailtoken": {
		type: String,
		default: null
	},

	"verifyemailtokenexpiry": {
		type: Number,
		default: null
	},

	"mobilenumber": {
		type: String,
		index: true
	},

	"mobileotp": {
		type: Number,
	},

	"password": {
		type: String,
	},
	"referral_code": {
		type: String,
		defaut:null
	},

	"wallet_id": {
		type: ObjectId,
		ref: "Wallet"
	},

	"transactionhistory": [
		{
			type: ObjectId,
			ref: 'TransactionHistory'
		}
	],

	"promocode": [
		{
			type: ObjectId,
			ref: 'PromoCode'
		}
	],

	"tokens": [{
		"token": {
			type: String,
			required: true
		}
	}],
	"token": {
		"deviceId": { type: String, default: null, trim: true },
		"jwttoken": { type: String, default: null, trim: true },
		"expireTime": { type: Number, default: null, trim: true },
	},
	"resetpasstoken": {
		type: String,
		default: null
	},

	"resetpassexp": {
		type: Number,
		default: null
	},

	"kyc": {
		"addressproof": {
			"idcardtype": { type: String, default: null, trim: true },
			"idcardnumber": { type: String, default: null, trim: true },

			"idfrontimagename": { type: String, default: null, trim: true },
			"idfrontimagepath": { type: String, default: null, trim: true },

			"idbackimagename": { type: String, default: null, trim: true },
			"idbackimagepath": { type: String, default: null, trim: true },

			"idfrontapproval": { type: String, default: null },
			"idfrontuploadtime": { type: String, default: null },
			"idfrontapprovaltime": { type: String, default: null },
			"idbackapproval": { type: String, default: null },
			"idbackuploadtime": { type: String, default: null },
			"idbackapprovaltime": { type: String, default: null },

		},

		"pancard": {
			"pancardnumber": { type: String, default: null, trim: true },
			"panimagename": { type: String, default: null, trim: true },
			"panimagepath": { type: String, default: null, trim: true },

			"pancardapproval": { type: String, default: null },
			"pancarduploadtime": { type: String, default: null },
			"pancardapprovaltime": { type: String, default: null },
		},

		"personalinfo": {
			"address": {
				"addressline1": { type: String, default: null, trim: true },
				"addressline2": { type: String, default: null, trim: true },
				"pincode": { type: Number, default: null, trim: true },
				"city": { type: String, default: null, trim: true },
				"state": { type: String, default: null, trim: true },
				"country": { type: String, default: null, trim: true },
			},

			"about": {
				"dateofbirth": { type: String, default: null, trim: true },
				"gender": { type: String, default: null, trim: true },
			},
			"updatedat": { type: Number, default: null }
		},

		"accountdetails": {
			"accountholdername": { type: String, default: null, trim: true },
			"accountnumber": { type: String, default: null, trim: true },
			"ifsc": { type: String, default: null, trim: true },
			"accounttype": { type: String, default: null, trim: true },
			"updatedat": { type: String, default: null },
			"cashfree_beneficiary": { type: String, default: null },
			"cashfree_status": { type: String, default: null }
		},

	},

	"created": {
		type: Number,
		default: null,
		trim: true
	},
	"created_by": {
		type: String,
		default: "self"
	},
	"group_name": {
		type: ObjectId,
		ref: "UserGroup"
	},

	"updated": {
		type: Number,
		default: null,
		trim: true
	},

	"active": {
		type: String,
		default: "true"
	},

	"userrole": {
		type: String,
		enum: ['user', 'admin','affiliate'],
		default: 'user'
	},

	"instantwithdrawal": {
		type: Boolean,
		default: false
	},

	"settings": {
		type: ObjectId,
		ref: "UserSettings"
	},
	"authorizationviauser": {
		active: {
			type: Boolean,
			default:false
		},
		password: {
			type: String
		},
		created: {
			type: Number
		},
		expireTime:{
			type:Number,
			default:0
		}
	},
},
	{
		timestamps: true
	});


UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		return next();
	}
	try {
		const hash = await bcrypt.hash(this.password, 10);
		this.password = hash;
		next();
	} catch (err) {
		next(err);
	}
});

UserSchema.methods.comparePassword = function (candidatePassword, next) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return next(err);
		next(null, isMatch)
	})
}

UserSchema.pre('save', function (next) {
	this.updated = Date.now()
	next();
});

module.exports = mongoose.model('User', UserSchema);