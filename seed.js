const initMongoClient = require('./mongo');
const fs = require('fs/promises');

async function seedDB() {
	try {
		const client = await initMongoClient();
		const collection = client.db('Leaderboard').collection('leaderboard');

		let rawdata = await fs.readFile('leaderboard.json');
		let leaderboard = JSON.parse(rawdata);

		await collection.insertMany(leaderboard.students);

		console.log('Database seeded! :)');
		client.close();
	} catch (err) {
		console.log(err.stack);
	}
}

seedDB();
