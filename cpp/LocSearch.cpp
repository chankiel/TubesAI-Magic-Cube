#include "state.hpp"
#include <fstream>
#include <chrono>
#include <vector>
#include <cmath>

using namespace std;

#define NMAX 100000000
#define MAX_SIDEWAYS 100
#define MAX_RESTART 10
#define SIMULATED_BOUND 0.5

typedef struct
{
    vector<int> initial_state;
    vector<int> last_state;
    vector<int> objEachStep;
    vector<int> plotSimulated;
    float duration;
    int numRestarts;
} DataFormat;

// extern "C"
// {
DataFormat SteepestAscentHC()
{
    State current;
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };

    while (true)
    {
        State neighbor = current.highestValuedSucc();
        df.objEachStep.push_back(neighbor.getStateValue());

        if (neighbor.getStateValue() >= current.getStateValue())
        {
            break;
        }

        current = neighbor;
    }

    df.last_state = current.getMatrix();

    return df;
}

DataFormat SteepestAscentHC(vector<int> &m)
{
    State current(m);
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };
    bool did = false;
    while (true && !did)
    {
        State neighbor = current.highestValuedSucc();
        df.objEachStep.push_back(neighbor.getStateValue());
        if (neighbor.getStateValue() >= current.getStateValue())
        {
            break;
        }

        current = neighbor;
        did = true;
    }

    cout << "State Value: " << current.getStateValue() << endl;
    df.last_state = current.getMatrix();

    return df;
}

DataFormat SideWaysMoveHC()
{
    State current;
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };

    int sidewaysMove = 0;
    while (true)
    {
        State neighbor = current.highestValuedSucc();
        df.objEachStep.push_back(neighbor.getStateValue());

        if (neighbor.getStateValue() > current.getStateValue())
        {
            break;
        }
        else if (neighbor.getStateValue() == current.getStateValue())
        {
            if (sidewaysMove == MAX_SIDEWAYS - 1)
            {
                break;
            }
            sidewaysMove++;
        }
        else
        {
            sidewaysMove = 0;
        }

        current = neighbor;
    }

    cout << "value: " << current.getStateValue() << endl;

    df.last_state = current.getMatrix();

    return df;
}

DataFormat RandomRestartHC(int maxRestart) {
    State current;
    int stateVal = current.getStateValue();
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };
    DataFormat df2 = {
        .initial_state = current.getMatrix(),
    };
    for (int i = 0; i < maxRestart; i++) {
        while (true) {
            State neighbor = current.highestValuedSucc();
            df.objEachStep.push_back(neighbor.getStateValue());

            if (neighbor.getStateValue() >= current.getStateValue()) {
                break;
            }
            current = neighbor;
        }
        df.numRestarts = i+1;
        df2.numRestarts = i+1;
        df.last_state = current.getMatrix();
        if (current.getStateValue() < stateVal) {
            df2.initial_state = df.initial_state;
            df2.last_state = df.last_state;
            df2.objEachStep = df.objEachStep;
            df2.plotSimulated = df.plotSimulated;
            df2.duration = df.duration;
            stateVal = current.getStateValue();
            if (stateVal == 0) {
                return df2;
            }
        }
    }
    return df2;
}

DataFormat Stochastic()
{
    State current;
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };


    for(int i = 0; i < NMAX; i++){
        State neighbor = current.randomSucc();
        df.objEachStep.push_back(neighbor.getStateValue());

        if (neighbor.getStateValue() > current.getStateValue())
        {
            current = neighbor;
        }

    }

    df.last_state = current.getMatrix();
    // cout << "i: " << i << endl;
    cout << "value:" << endl;
    cout << current.getStateValue() << endl;

    return df;
}

double schedule(int t)
{
    double x = 50000 * pow(0.95, t);
    return x;
}

DataFormat SimulatedAnnealing()
{
    State current;
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };

    int t = 0;
    while (true)
    {
        double T = schedule(t);
        if (T <= 0.01)
            break;
        State neighbor = current.randomSucc();
        df.objEachStep.push_back(neighbor.getStateValue());

        double deltaE = neighbor.getStateValue() - current.getStateValue();
        if (deltaE < 0)
        {
            current = neighbor;
        }
        else
        {
            if (exp((-1 * deltaE) / T) >= SIMULATED_BOUND)
            {
                current = neighbor;
            }
        }

        t++;
    }

    df.last_state = current.getMatrix();
    return df;
}

// int randomSelectionGenetic(vector<State>& population, int totalValue, int nPopulation){
//     double random_prob = (rand() % 101) / 100;
//     double iterator_prob = 0;
//     for(int i=0;i<nPopulation;i++){
//         double state_prob = population[i].getStateValue()/totalValue;
//         if(state_prob >= random_prob - iterator_prob){
//             return i;
//         }
//         iterator_prob += state_prob;
//     }
// }

// DataFormat GeneticAlgorithm(int nPopulation, int nIterasi){
//     vector<State> population;
//     for(int i=0;i<nPopulation;i++){
//         State state;
//         population.push_back(state);
//     }

//     int it = 0;
//     do{
//         vector<State> newPopulation;
//         for(int i=0;i<nPopulation;i++){

//         }
//     }while();
// }

// }

void readMatrixFromFile(const string &filename, vector<int> &matrix)
{
    ifstream file(filename);

    if (!file)
    {
        cerr << "Error opening file " << filename << endl;
        return;
    }

    matrix.resize(125);

    int idx = 0;
    for (int i = 0; i < 5; ++i)
    {
        for (int j = 0; j < 5; ++j)
        {
            for (int k = 0; k < 5; ++k)
            {
                file >> matrix[idx];
                idx++;
                if (file.fail())
                {
                    cerr << "Error reading data from file" << endl;
                    return;
                }
            }
        }
    }

    file.close();
}

void displayMatrix(vector<int> &matriks)
{
    int idx = 0;
    for (int i = 0; i < 5; ++i)
    {
        for (int j = 0; j < 5; ++j)
        {
            for (int k = 0; k < 5; ++k)
            {
                cout << matriks[idx] << " ";
                idx++;
            }
            cout << endl;
        }
        cout << endl;
    }
}

// State RandomRestartHC()
// {
//     State current =
//     int i=0;
//     bool found = false;
//     while(n)
// }

int main()
{
    srand(time(0));
    vector<int> matrix(125, 0);

    readMatrixFromFile("matrix.txt", matrix);
    auto start = chrono::high_resolution_clock::now();

    DataFormat df;
    // df = SteepestAscentHC(matrix);
    // df = SteepestAscentHC();
    // df = SteepestAscentHC();
    df = RandomRestartHC(5);
    // df = Stochastic();
    // df = SimulatedAnnealing();

    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, micro> duration = end - start;

    cout << "INITIAL STATE: " << endl;
    displayMatrix(df.initial_state);

    cout << endl
         << "---------------------------------------------------------------------\nLAST STATE: " << endl;
    displayMatrix(df.last_state);
    cout << endl
         << "EXECUTION TIME: " << (float)duration.count() / 1000000 << "s" << endl;
    cout << "OBJ FUNCTION: " << df.objEachStep[df.objEachStep.size() - 1];
    cout << endl
         << df.objEachStep.size() << endl;
}