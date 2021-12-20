const express = require('express');
const path = require('path');

async function startServer(client) {
	const app = express();
	const leaderboard = client.db('Leaderboard').collection('leaderboard');

	app.use(
		express.static(path.join(__dirname, '/public'), {
			index: 'index.html',
			extensions: ['html'],
		})
	);

	app.use(express.json());

	app.post('/api', async (req, res) => {
		const student = req.body;
		console.log(student);
		try {
			leaderboard.insertOne(student);
			res.status(200).json({ ...student, status: 'success' });
		} catch (err) {
			console.log(err);
			res.status(500);
		}
	});

	app.get('/api/:name', async (req, res) => {
		const { name } = req.params;
		const data = await leaderboard.findOne({ name });
		if (data) {
			res.status(200).json({ ...data, status: 'success' });
		} else {
			res.status(500).json({
				status: 'failed',
				error: 'This student does not exist',
			});
		}
	});

	app.delete('/api', async (req, res) => {
		const { name } = req.body;

		const student = await leaderboard.deleteOne({ name });
		if (student.deletedCount === 0) {
			res.status(500).json({
				status: 'failed',
				error: 'This student does not exist',
			});
		} else {
			res.status(200).json({ status: 'success' });
		}
	});

	app.put('/api', async (req, res) => {
		const { name, points } = req.body;

		const student = await leaderboard.updateOne(
			{ name },
			{
				$set: {
					points,
				},
			}
		);

		if (student.modifiedCount === 0) {
			res.status(500).json({
				status: 'failed',
				error: 'This student does not exist',
			});
		} else {
			res.status(200).json({ ...req.body, status: 'success' });
		}
	});

	app.get('/api', async (req, res) => {
		try {
			const data = await leaderboard.find().toArray();
			res.status(200).json(data);
		} catch (err) {
			console.log(err);
			res.status(500);
		}
	});

	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});

	app.listen(process.env.PORT || 3001);
}

module.exports = startServer;
