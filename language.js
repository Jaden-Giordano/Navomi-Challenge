const path = require('path');

const language = require('@google-cloud/language');

var client = language({
	projectId: 'navomi-challenge-181018',
	keyFilename: path.join(__dirname, 'keyfile.json')
});

function analyzeSentence(content) {
	return new Promise(function(resolve, reject) {
		let document = {
			content,
			type: 'PLAIN_TEXT'
		};

		client.analyzeSentiment({ document }).then((res) => {
			return resolve(res);
		}).catch((err) => {
			return reject(err);
		});
	});
}

function generateResponse(analysis) {
	return new Promise(async (resolve, reject) => {
		let response = '';

		if (analysis && analysis.sentences && analysis.sentences.length > 0) {
			for (let i = 0; i < analysis.sentences.length; i++) {
				let sentence = analysis.sentences[i];

				let entity;
				if (sentence.text && sentence.text.content) {
					let document = {
						content: sentence.text.content,
						type: 'PLAIN_TEXT'
					}
					entity = await client.analyzeEntities({ document }).then((res) => {
						if (res[0] && res[0].entities[0] && res[0].entities[0].mentions[0])
							return res[0].entities[0].mentions[0].text.content;
						else
							return false;
					}).catch((err) => {
						return false;
					});
				}

				if (sentence.sentiment.score > -.2) {
					if (sentence.sentiment.score < .2)
						response += entity?`I'm unbiased about ${entity}. `:'I\'m unbiased about that. ';
					else response += entity?`I love ${entity} too. `:'I love that too. ';
				} else response += entity?`Yeah, I hate ${entity} too. `:'I hate that too. ';
			}
		} else {
			return reject('Empty content');
		}

		return resolve(response.trim());
	});
}

module.exports = {
	analyzeSentence,
	generateResponse
}
