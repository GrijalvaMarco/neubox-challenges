const fs = require('fs');
const events = require('events');
const readline = require('readline');
const readLineHelper = require('./readlineHelper')

async function start() {
    const args = process.argv;
    
    if(args.length < 4){
     throw new Error('Parameters like args not found. Please send input file path and output filename')
    }
    const filePath = args[2] 
    const outputFileName = args[3] 

    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(filePath),
            crlfDelay: Infinity
        });

        let indexLine = 0
        let rounds = 0
        let scorePlayer1 = []
        let scorePlayer2 = []

        rl.on('line', (line) => {
            indexLine++
            if(indexLine == 1){
                rounds = validateFirstLine(line)
            }else{
                validateLine(line, indexLine, rounds)
            }

            if (indexLine != 1) {
                scorePlayer1.push(line[0])
                scorePlayer2.push(line[1])
            }            
        });
       
        await events.once(rl, 'close');

        if (indexLine == 0) {
            throw new Error('Error: Nothing to read')
        }

        //Validate if total rounds are exactly as first line specified
        if(rounds != indexLine-1){
            throw new Error('Round specified at begin not match with total rounds.')
        }

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

function validateFirstLine(values){
    console.log("ValidateLine1",values)
    //Validate first line game rounds

    let valueLen = values.length
   
    if (valueLen != 1) {
        throw new Error('Error: Check format of document Line1')
    }

    let rounds = values[0]
    if (!isNumeric(rounds)) {
        throw new Error('Rounds value must be a number')
    }
    if (rounds <= 0 || rounds > 10000) {
        throw new Error('Game Rounds must be between 1 and 10000')
    }
 
    return rounds

}

function validateLine(line, indexLine, totalRounds) {
    console.log("ValidateLine"+indexLine)
    let values = line.split(' ')
    const spacesLength = values.length - 1

    if (spacesLength != 1) {
        throw new Error(`Error: Check format of document Line: ${indexLine}`)
    }

    let scorePlayer1 = values[0]
    let scorePlayer2 = values[1]
    if (!isNumeric(scorePlayer1) || !isNumeric(scorePlayer2)) {
        throw new Error('Values must be a number')
    }

    if(indexLine-1 > totalRounds){
        throw new Error('Round specified at begin not match with total rounds.')
    }

    if(indexLine > 10001){
        throw new Error('Game Rounds must be between 1 and 10000')
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