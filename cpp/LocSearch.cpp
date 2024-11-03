#include "state.hpp"
#include <fstream>
#include <chrono>
#include <vector>
#include <cmath>
#include <emscripten/bind.h>

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

DataFormat Stochastic()
{
    State current;
    DataFormat df = {
        .initial_state = current.getMatrix(),
    };

    for (int i = 0; i < NMAX; i++)
    {
        State neighbor = current.randomSucc();
        df.objEachStep.push_back(neighbor.getStateValue());

        if (neighbor.getStateValue() > current.getStateValue())
        {
            current = neighbor;
        }
    }

    df.last_state = current.getMatrix();

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
