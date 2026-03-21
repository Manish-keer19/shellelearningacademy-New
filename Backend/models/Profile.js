const mongoose = require("mongoose");

// Define the Profile schema
const profileSchema = new mongoose.Schema({
	gender: {
		type: String,
	},
	dateOfBirth: {
		type: String,
	},
	about: {
		type: String,
		trim: true,
	},
	contactNumber: {
		type: Number,
		trim: true,
	},
	batch: {
		type: String,
		trim: true,
	},
	state: {
		type: String,
		trim: true,
	},
	college: {
		type: String,
		trim: true,
	},
});

// Export the Profile model
module.exports = mongoose.model("Profile", profileSchema);