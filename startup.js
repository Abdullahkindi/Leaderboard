const loadEnv = require('dotenv');
const startServer = require('./server');
const initMongoClient = require('./mongo');
loadEnv.config();

async function main() {
	const mongoClient = await initMongoClient();
	await startServer(mongoClient);
}

console.log('Starting up...');
main();
