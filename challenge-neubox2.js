const fs = require('fs');
const events = require('events');
const readline = require('readline');

async function start() {
    const path_file = 'input2.txt'
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(path_file),
            crlfDelay: Infinity
        });

        let indexLine = 0
        let scorePlayer1 = []
        let scorePlayer2 = []
        let rounds = 0

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
        console.log(winner)

        //Create a output file
        createFile(winner)

    } catch (err) {
        console.error(err);
    }
};

function buildResults(scorePlayer1, scorePlayer2) {
    let results = []
    for (let index = 0; index < scorePlayer1.length; index++) {
        const scoreP1 = parseInt(scorePlayer1[index]);
        const scoreP2 = parseInt(scorePlayer2[index]);
        let winner = 0
        let difference = 0
        // console.log(scoreP1+"-"+scoreP2)
        if (scoreP1 > scoreP2) {
            winner = 1
            console.log(scoreP1)
            console.log(scoreP2)
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
    //Validate first line game rounds
    if (indexLine == 1) {
        rounds = values[0]
        if (rounds <= 0 || rounds > 10000) {
            throw new Error('Game Rounds must be between 1 and 10000')
        }
        return
    }

    //Validate All Lines
    let spacesLength = values.length - 1

    if (!isNumeric(values[0]) || !isNumeric(values[1])) {
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
    return max;
}

function createFile(jsonObj) {
    const winner = jsonObj.winner
    const difference = jsonObj.difference.toString()

    var fs = require('fs');
    var stream = fs.createWriteStream("output2.txt");
    stream.once('open', function (fd) {
        stream.write(`${winner} ${difference}`);
        stream.end();
    });
}

start()