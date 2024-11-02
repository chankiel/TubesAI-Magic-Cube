#include "state.h"  // Include the header file

int main() {
    State s1;  // Create an instance of State
    int array[5][5][5];

    // Fill the 3D array using the 1D array
    for (int i = 0; i < 5; ++i) {
        for (int j = 0; j < 5; ++j) {
            for (int k = 0; k < 5; ++k) {
                array[i][j][k] = 2; // Map 3D indices to 1D index
            }
        }
    }
    State s2(array);  // Create an instance of State
    cout << s1.toString();  // Output the string representation of the state
    cout << s2.toString();  // Output the string representation of the state
    return 0;  // Exit the program
}
