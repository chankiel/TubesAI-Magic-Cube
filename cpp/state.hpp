#include <iostream>
#include <vector>
#include <string>
using namespace std;

#define MAGIC_NUMBER 315

class State {
private:    
    int matriks[5][5][5];
    vector<int> buffer[5];
    int val;
public:
    State();
    string toString();
    State(int m[5][5][5]);
    int objectiveFunction();
    void calculateBuffer();
    void updateBuffer(int,int,int,int,int);
    State highestValuedSucc();
    State randomSucc();
    vector<int> diaBidangIndexes(int,int,int);
    vector<int> diaRuangIndexes(int,int,int);
};
