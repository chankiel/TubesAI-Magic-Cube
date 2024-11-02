#include <iostream>
#include <vector>
#include <string>
using namespace std;

class State {
private:    
    int matriks[5][5][5];
    vector<int> buffer[5];
    int val;
public:
    State();
    string toString();
    // State(int m[5][5][5]);
    // int objectiveFunction();
    // void calculateBuffer();
    // void updateBuffer(i,j,k,newVal,oldVal);
    // State highestValuedSucc();
    // State randomSucc();
};
