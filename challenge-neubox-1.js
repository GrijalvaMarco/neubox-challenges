const fs = require('fs');
const events = require('events');
const readline = require('readline');

async function readFile() {
    const path_file = 'input.txt'
    try {
        const rl = readline.createInterface({
            input: fs.createReadStream(path_file),
            crlfDelay: Infinity
        });

        let indexLine = 0
        let dataValues = []

        rl.on('line', (line) => {
            indexLine++
            dataValues = validateRules(indexLine, line, dataValues)
        });

        await events.once(rl, 'close');

        //Create a output file
        console.log(dataValues)
        createFile(dataValues)

        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
    } catch (err) {
        console.error(err);
    }
};

function validateRules(index, line, previousValues) {
    console.log("Validating rules Line:" + index)
    switch (index) {

        case 1:
            //must be 3 columns
            const lineValues = line.split(' ')
            const spacesLength = lineValues.length - 1
            if (spacesLength !== 2) {
                throw new Error('Format first line not allowed. Please verify M1, M2 y N text line')
            }
            let m1 = parseInt(lineValues[0])
            let m2 = parseInt(lineValues[1])
            let n = parseInt(lineValues[2])

            //Validate numbers
            if (m1 < 2 || m1 > 50 || m2 < 2 || m2 > 50) {
                throw new Error('M1 or M2 values are not permitted')
            }
            if (n < 3 || n > 5000) {
                throw new Error('N values are not permitted')
            }
            console.log("Line1..........OK")
            //returning array values for consulting in the next line
            return data = { values: lineValues };

        //First instruction
        case 2:
            //compare instruction length
            if (line.length != previousValues.values[0]) {
                throw new Error('first instruction not match with length line')
            }
            if (!isValidText(line)) {
                throw new Error('instruction format text is invalid')
            }

            if (hasRepeatedLetters(line)) {
                throw new Error('Instruction contains 2 same letters secuencially. Please check book of instructions rules')
            }

            console.log("Line2..........OK")
            return data = {
                ...previousValues,
                firstIntruction: line
            };

        //Second instruction
        case 3:
            //compare instruction length
            if (line.length != previousValues.values[1]) {
                throw new Error('second instruction not match with length line')
            }
            if (!isValidText(line)) {
                throw new Error('instruction format text is invalid')
            }

            if (hasRepeatedLetters(line)) {
                throw new Error('Instruction contains 2 same letters secuencially. Please check book of instructions rules')
            }

            console.log("Line3..........OK")
            return data = {
                ...previousValues,
                secondInstruction: line
            };

        //Message
        case 4:
            if (line.length != previousValues.values[2]) {
                throw new Error('message not match with length line')
            }
            if (!isValidText(line)) {
                throw new Error('message format text is invalid')
            }

            console.log("Line4..........OK")

            const message = cleanMessage(line)
            return data = {
                ...previousValues,
                message
            };
        default:
            console.log(`indexLine: ${index}`)
            throw new Error('Format document input file not allowed');
    }
}

function isValidText(str) {
    return Boolean(str.match(/^[A-Za-z0-9]*$/));
}

function hasRepeatedLetters(str) {
    for (let index = 0; index < str.length; index++) {
        const letter = str[index];
        let previousLetter = str[index - 1]
        if (previousLetter != undefined) {
            if (letter === previousLetter) {
                return true
            }
        }
    }
    return false
}

function cleanMessage(str) {
    let last = "";
    let result = "";
    for (let i = 0; i < str.length; i++) {
        let char = str.charAt(i);
        if (char !== last) {
            result += char;
            last = char;
        }
    }
    return result
}

function createFile(dataValues) {
    const message = dataValues.message
    let checkFirstI = message.includes(dataValues.firstIntruction);
    let checkSecondI = message.includes(dataValues.secondInstruction);
    var fs = require('fs');
    var stream = fs.createWriteStream("output.txt");
    stream.once('open', function (fd) {
        stream.write(checkFirstI ? 'SI\n' : 'NO\n');
        stream.write(checkSecondI ? 'SI' : 'NO');
        stream.end();
    });
}

//Start program: node challenge-neubox-1.js
readFile()