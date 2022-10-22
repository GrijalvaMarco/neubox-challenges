def start():
    indexLine = 0
    scorePlayer1 = []
    scorePlayer2 = []

    with open("input2.txt") as f:
        for line in f:
            indexLine += 1
            values = line.split(' ')
            validateLine(values, indexLine)
            if (indexLine != 1) :
                scorePlayer1.append(values[0])
                scorePlayer2.append(values[1])
    results = buildResults(scorePlayer1,scorePlayer2)
    winnerDic = getWinner(results)
    print(winnerDic) 

    #Create a output file
    winner = winnerDic.get('winner')
    difference = winnerDic.get('difference')
    with open('outputpy.txt', 'w') as f:
        f.write(str(winner)+' '+str(difference))

def buildResults(scorePlayer1,scorePlayer2):
    results = []
    for index, value in enumerate(scorePlayer1):
        scoreP1 = int(value)
        scoreP2 = int(scorePlayer2[index])
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
    if(indexLine == 1):
        rounds = int(values[0])
        if(rounds <= 0 or rounds > 10000) :
            raise Exception("Game Rounds must be between 1 and 10000")

def getWinner(arr):
    max_value = max(arr, key=lambda x:x['difference'])
    return max_value

start()