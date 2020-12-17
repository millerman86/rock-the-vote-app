const mongoose = require('mongoose');
require('dotenv').config()

console.log('this is just a test');

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI || 'mongodb://localhost:27017/rock-the-vote', {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;
