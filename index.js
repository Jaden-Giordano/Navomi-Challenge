const { info } = require('winston');
const path = require('path');

const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const language = require('./language');

const express = require('express');
const app = express();

app.use(compress());
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3030, () => {
	info('Listening on port 3030');
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/inform', async (req, res) => {
	const analysis = await language.analyzeSentence(req.body.content).then((res) => {
		return res[0];
	}, (err) => {
		return res.status(500).send('ERR 1: An error occured analyzing the content.');
	});

	if (analysis) {
		language.generateResponse(analysis).then((response) => {
			return res.json({ response });
		}, (err) => {
			return res.status(500).send('ERR 2: An error occured generating a response.');
		});
	}
});
