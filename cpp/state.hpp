#include <iostream>
#include <vector>
#include <string>
using namespace std;

#define MAGIC_NUMBER 315

class State
{
private:
    vector<int> matriks;
    vector<int> buffer[5];
    int val;

public:
    State();
    State(vector<int>&);
    State(const State &);

    int getStateValue();
    int getElement(int, int, int);
    void setElement(int, int, int, int);
    vector<int> getMatrix();

    string toString();
    void printBuffer();

    vector<int> diaBidangIndexes(int, int, int);
    vector<int> diaRuangIndexes(int, int, int);

    void calculateBuffer();
    void updateBuffer(int, int, int, int, int);

    int objectiveFunction();

    State generateSucc(int, int, int, int, int, int);
    State highestValuedSucc();
    State randomSucc();

    State &operator=(const State &);
};
