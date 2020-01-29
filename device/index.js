const { spawn } = require('child_process');
const micri = require('micri').default;
const { send, json } = require('micri');

const server = micri(async (req, res) => {
    const body = await json(req);

    console.log(body);

    send(res, 200);
})

server.listen(3000)

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
