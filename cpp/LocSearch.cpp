#include "state.hpp"
#include <fstream>
#include <chrono>
#include <vector>
#include <cmath>

using namespace std;

#define MAX_SIDEWAYS 100
#define MAX_RESTART 10
#define SIMULATED_BOUND 0.5

typedef struct
{
    vector<int> initial_state;
    vector<int> last_state;
    vector<int> objEachStep;
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

        if (neighbor.getStateValue() <= current.getStateValue())
        {
            break;
        }

        current = neighbor;
    }

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

        if (neighbor.getStateValue() < current.getStateValue())
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

    df.last_state = current.getMatrix();

    return df;
}

int schedule(int t)
{
    double x = 100 - 7.2 * log(t);
    return x > 0 ? x : 0;
}

DataFormat SimulatedAnnealing()
{
    srand(time(0));
    State current;
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };

    int t = 0;
    while (true)
    {
        double T = schedule(t);
        if(T == 0) break;
        State neighbor = current.randomSucc();
        df.objEachStep.push_back(neighbor.getStateValue());

        double deltaE = neighbor.getStateValue() - current.getStateValue();
        if(deltaE > 0){
            current = neighbor;
        } else{
            if(exp(deltaE/T) >= MAX_SIDEWAYS){
                current = neighbor;
            }
        }
    }

    df.last_state = current.getMatrix();
    return df;
}

// DataFormat GeneticAlgorithm(){
//     State current;
//     DataFormat df = {
//         .initial_state = current.getMatrix(),
//     };

// }

// }

void readMatrixFromFile(const std::string &filename, vector<int> &matrix)
{
    std::ifstream file(filename);

    if (!file)
    {
        std::cerr << "Error opening file " << filename << std::endl;
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
                    std::cerr << "Error reading data from file" << std::endl;
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
    vector<int> matrix(125, 0);

    readMatrixFromFile("matrix.txt", matrix);
    auto start = chrono::high_resolution_clock::now();

    DataFormat df;
    df = SideWaysMoveHC();

    auto end = chrono::high_resolution_clock::now();
    chrono::duration<double, micro> duration = end - start;

    cout << "INITIAL STATE: " << endl;
    displayMatrix(df.initial_state);

    cout << endl
         << "---------------------------------------------------------------------\nLAST STATE: " << endl;
    displayMatrix(df.last_state);
    cout << endl
         << "EXECUTION TIME: " << (float)duration.count() / 1000000 << "s" << endl;
}