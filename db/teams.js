var mongoose = require('mongoose');
var teamSchema = new mongoose.Schema({
	"ID"			: String,
	"NAME"			: String,
	"EATABLISH_DT"	: { type : Date , default : Date.now },
	"CREATE_DT"		: { type : Date , default : Date.now },
	"CAPTAIN"		: {
		"ID"		: String,
		"NAME"		: String
	},
	"MODIFIED_DT"	: { type : Date , default : Date.now },
	"MODIFIED_ACC"	: { type : String }
});

module.exports = mongoose.model('TEAMS' , teamSchema);
