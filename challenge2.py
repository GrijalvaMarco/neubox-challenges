import sys
import os

class IntersectException(Exception):
    def __init__(self, msg):
        self.msg = msg
    def __str__(self):
        return self.msg  

class FileManager:
    def is_non_zero_file(self,fpath):  
        return os.path.isfile(fpath) and os.path.getsize(fpath) > 0

    def getWinner(self,arr):
        max_value = max(arr, key=lambda x:x['difference'])
        print(max_value)
        return max_value

    def buildResults(self,scorePlayer1,scorePlayer2):
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
        
    def read_file(self,filePath, outputFileName):
        indexLine = 0
        rounds = 0
        scorePlayer1 = []
        scorePlayer2 = []
        
        # try:
        with open(filePath) as f:
            if self.is_non_zero_file(filePath):
                
                for line in f:
                    indexLine += 1
                    values = line.split(' ')
                    # print(values)
                    if(indexLine == 1):
                        rounds = self.validate_first_line(values)
                    else: 
                        self.validate_line(values, indexLine, rounds)
                        scorePlayer1.append(values[0])
                        scorePlayer2.append(values[1])
                if(rounds != indexLine-1):
                    raise IntersectException("Round specified at begin not match with total rounds.")

                results = self.buildResults(scorePlayer1,scorePlayer2)
                print(results) 
                winnerDic = self.getWinner(results)
                # print(winnerDic)
                
                #Create a output file
                winner = winnerDic.get('winner')
                difference = winnerDic.get('difference')
                with open(outputFileName+'.txt', 'w') as f:
                    f.write(str(winner)+' '+str(difference))
                
            else:
                raise IntersectException("Empty file. Please check the file format")        

    def is_integer_num(self,n):
        if isinstance(n, int):
            return True
        if isinstance(n, float):
            return n.is_integer()
        return False   

    def validate_first_line(self,values):
        print("validateLine1")
        valuesLen = len(values)
        if(valuesLen != 1 and valuesLen > 0):
            raise IntersectException("Round format line not allowed.")  
        rounds = int(values[0])
        if not self.is_integer_num(rounds):
            raise IntersectException("Rounds must be a integer number.")
        if(rounds < 1 or rounds > 10000) :
            raise IntersectException("Round must be between 0 and 10000.")
        return rounds

    def validate_line(self, values, indexLine, total_rounds) :
        print("ValidateLine"+str(indexLine))
        valuesLen = len(values)
        if(valuesLen != 2):
            raise IntersectException("Score line format not allowed.")
        scorePlayer1 = values[0]
        scorePlayer2 = values[1].replace("\n", "")   
        
        if not scorePlayer1.isnumeric():
            raise IntersectException("Score number must be int.")
        if not scorePlayer2.isnumeric():
            raise IntersectException("Score number2 must be int.")
        if(indexLine-1 > total_rounds):
            raise IntersectException("Round specified at begin not match with total rounds.")
        if(indexLine > 10001) :
            raise IntersectException("Round must be between 0 and 10000.")

           

if __name__ == '__main__' :
    try :
        if len(sys.argv) != 3:
            raise Exception("Arguments are missing, please add the input file name and the output filename")
            
        inputFile = sys.argv[1]
        outputFile = sys.argv[2]


        file = FileManager()
        file.read_file(inputFile, outputFile)

    except Exception as e:
       print('FileError : ' + str(e))

