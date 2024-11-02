#include "state.h" 
#include <cstdlib>  // random
#include <ctime>    // time
#include <algorithm> // shuffle
#include <sstream>  // tostring
using namespace std;

State::State(){
    vector<int> numbers;
    for (int i = 1; i <= 125; ++i) {
        numbers.push_back(i);
    }

    srand(static_cast<unsigned>(time(0))); 
    random_shuffle(numbers.begin(), numbers.end());

    for (int i = 0; i < 5; ++i) {
        for (int j = 0; j < 5; ++j) {
            for (int k = 0; k < 5; ++k) {
                matriks[i][j][k] = numbers[i * 25 + j * 5 + k];
            }
        }
        buffer[i].clear();
    }
    // calculateBuffer();
    // value = objectiveFunction();
}

State::State(int m[5][5][5]){
    for (int i = 0; i < 5; ++i) {
        for (int j = 0; j < 5; ++j) {
            for (int k = 0; k < 5; ++k) {
                matriks[i][j][k] = m[i][j][k];
            }
        }
        buffer[i].clear();
    }
    // calculateBuffer();
    // value = objectiveFunction();
}

int State::objectiveFunction(){
    int result = 0;
    // buffer[0] = baris 25
    // buffer[1] = kolom 25
    // buffer[2] = tiang 25
    // buffer[3] = diagonal bidang 30
    // buffer[4] = diagonal ruang 4 

    for (vector vec : this->buffer) {
        for (int segment : vec) {
            if(segment == 315){
                result ++;
            }
        }
    }
    return result;
}

string State::toString() {
    std::ostringstream oss;
    for (int i = 0; i < 5; ++i) {
        oss << "Layer " << i + 1 << ":\n";
        for (int j = 0; j < 5; ++j) {
            for (int k = 0; k < 5; ++k) {
                oss << matriks[i][j][k] << "\t";
            }
            oss << "\n";
        }
        oss << "\n";
    }
    return oss.str();
}


