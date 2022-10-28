const fs = require('fs');
const events = require('events');
const readline = require('readline');
const readLineHelper = require('./readlineHelper')

async function start() {
    const filePath = await readLineHelper.getFilePath('Please enter the file path')
    const outputFileName = await readLineHelper.getFilePath('Please enter the name of the output file')
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });

        let indexLine = 0
        let scorePlayer1 = []
        let scorePlayer2 = []

        rl.on('line', (line) => {
            indexLine++
            var values = line.split(' ')
            validateLine(values, indexLine)

            if (indexLine != 1) {
                scorePlayer1.push(values[0])
                scorePlayer2.push(values[1])
            }            
        });

        await events.once(rl, 'close');

        let results = buildResults(scorePlayer1, scorePlayer2)
        console.log(results)

        let winner = getWinner(results)
        console.log("WINNER!",winner)

        //Create a output file
        createFile(outputFileName,winner)

    } catch (err) {
        console.error(err);
    }
};

function buildResults(scorePlayer1, scorePlayer2) {
    let results = []
    let difference = 0
    let scoreP1 = 0
    let scoreP2 = 0

    for (let index = 0; index < scorePlayer1.length; index++) {
        scoreP1 = scoreP1 + parseInt(scorePlayer1[index]);
        scoreP2 = scoreP2 + parseInt(scorePlayer2[index]);
        let winner = 0
        if (scoreP1 > scoreP2) {
            winner = 1
            difference = scoreP1 - scoreP2
        }
        if (scoreP2 > scoreP1) {
            winner = 2
            difference = scoreP2 - scoreP1
        }

        let data = { round: index + 1, winner: winner, difference: difference }
        results.push(data)
    }
    return results
}

function validateLine(values, indexLine) {
    let scorePlayer1 = values[0]
    let scorePlayer2 = values[1]
    //Validate first line game rounds
    if (indexLine == 1) {
        rounds = values[0]
        extraValue = values[1]
        if (!isNumeric(rounds)) {
            throw new Error('Rounds value must be a number')
        }
        if (rounds <= 0 || rounds > 10000) {
            throw new Error('Game Rounds must be between 1 and 10000')
        }
        if(extraValue != undefined){
            throw new Error('File incorrect format')
        }
        return
    }

    if(indexLine > 10000){
        throw new Error('Game Rounds must be between 1 and 10000')
    }

    //Validate round line
    let spacesLength = values.length - 1

    if (!isNumeric(scorePlayer1) || !isNumeric(scorePlayer2)) {
        throw new Error('Values must be a number')
    }

    if (spacesLength !== 1) {
        throw new Error(`Error: Check format of document Line: ${indexLine}`)
    }
}

function isNumeric(num) {
    return !isNaN(num)
}

function getWinner(arr) {
    var max;
    for (var i = 0; i < arr.length; i++) {
        if (max == null || parseInt(arr[i]['difference']) > parseInt(max['difference']))
            max = arr[i];
    }
    if(max.winner == 0){
        throw new Error('Draw is not allowed')
    }
    return max;
}

function createFile(outputFileName,jsonObj) {
    const winner = jsonObj.winner
    const difference = jsonObj.difference.toString()

    var fs = require('fs');
    var stream = fs.createWriteStream(`${outputFileName}.txt`);
    stream.once('open', function (fd) {
        stream.write(`${winner} ${difference}`);
        stream.end();
    });
}

start()