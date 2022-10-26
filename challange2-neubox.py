def start():
    indexLine = 0
    scorePlayer1 = []
    scorePlayer2 = []
    filePath = raw_input("Please enter full path of the file: ")
    outputFileName = raw_input("Please enter the name of the output file: ")

    with open('input2.txt') as f:
        for line in f:
            indexLine += 1
            values = line.split(' ')
            validateLine(values, indexLine)
            if (indexLine != 1) :
                scorePlayer1.append(values[0])
                scorePlayer2.append(values[1])
    results = buildResults(scorePlayer1,scorePlayer2)
    print(results) 
    winnerDic = getWinner(results)
    print(winnerDic) 

    #Create a output file
    winner = winnerDic.get('winner')
    difference = winnerDic.get('difference')
    with open(outputFileName+'.txt', 'w') as f:
        f.write(str(winner)+' '+str(difference))

def buildResults(scorePlayer1,scorePlayer2):
    results = []
    scoreP1 = 0
    scoreP2 = 0
    for index, value in enumerate(scorePlayer1):
        scoreP1 = scoreP1 + int(value)
        scoreP2 = scoreP2 + int(scorePlayer2[index])
        winner = 0
        difference = 0

        if(scoreP1 > scoreP2):
            winner = 1
            difference = scoreP1 - scoreP2
        else: 
          winner = 2
          difference = scoreP2 - scoreP1  

        dataDict = {"round": index, "winner": winner, "difference": difference}
        results.append(dataDict)
    return results

def validateLine(values, indexLine) :
    valuesLen = len(values)
    if(indexLine == 1):
        rounds = int(values[0])
        if(rounds <= 0 or rounds > 10000) :
            raise IntersectException("Round must be between 0 and 10000.")
        if(valuesLen != 1):
            raise IntersectException("Round format line not allowed.")
    else:        
        if(valuesLen != 2):
            raise IntersectException("Score line format not allowed.")
        scorePlayer1 = int(values[0])
        scorePlayer2 = int(values[1])
        if not is_integer_num(scorePlayer1):
            raise IntersectException("Score number must be int.")
        if(indexLine > 10000):
            raise IntersectException("Round must be between 0 and 10000.")

def getWinner(arr):
    max_value = max(arr, key=lambda x:x['difference'])
    return max_value

def is_integer_num(n):
    if isinstance(n, int):
        return True
    if isinstance(n, float):
        return n.is_integer()
    return False

class IntersectException(Exception):
    def __init__(self, msg):
        self.msg = msg
    def __str__(self):
        return self.msg    

start()