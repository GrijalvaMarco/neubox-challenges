
const readline = require('readline');

function readLineAsync(message, rl) {
    return new Promise((resolve, reject) => {
        rl.question(message, (answer) => {
            resolve(answer);
        });
    });
}

async function getFilePath(message) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    let filePath = await readLineAsync(`${message} >`, rl);
    rl.close();
    return filePath
}

module.exports = {
    getFilePath
}