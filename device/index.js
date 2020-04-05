const { spawn } = require('child_process');
const micri = require('micri').default;
const { send, json } = require('micri');
const ms = require('ms');
const fetch = require('./fetch-graph-api');
const createWriter = require('./writer');

const ENVIRO_PATH = '/home';
const FILENAME = 'enviro-data.xlsx';
const INTERVAL = ms('5m');
const SAMPLE_SIZE = 6;

const server = micri(async (req, res) => {
	const body = await json(req);
	const { tempValues, pmValues } = body;

	write([
		Date.now() / 1000,
		tempValues.temperature,
		tempValues.pressure,
		tempValues.humidity,
		pmValues.P1_0,
		pmValues.P2_5,
		pmValues.P10
	]);

	send(res, 200);
})

server.listen(3000)

async function instantAuth() {
	const { userPrincipalName } = await fetch('/me');

	console.log(`Authenticated as ${userPrincipalName}`);
}

instantAuth().catch((err) => {
	console.error(err);
	process.exit(1);
});

const write = createWriter(ENVIRO_PATH, FILENAME, SAMPLE_SIZE, INTERVAL);

const collector = spawn('python', ['collector.py']);

collector.stdout.on('data', (data) => {
	console.log(`stdout: ${data}`);
});

collector.stderr.on('data', (data) => {
	console.error(`stderr: ${data}`);
});

collector.on('close', (code) => {
	console.log(`child process exited with code ${code}`);
});
