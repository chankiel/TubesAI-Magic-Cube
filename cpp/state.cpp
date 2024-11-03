#include "state.hpp"
#include <cstdlib>   // random
#include <ctime>     // time
#include <algorithm> // shuffle
#include <sstream>   // tostring
#include <cmath>

int getVectorIndex(int i, int j, int k)
{
    return (25 * i + 5 * j + k);
}

/*-------------------- CONSTRUCTOR -----------------------*/
State::State()
{
    buffer[0] = vector<int>(25, 0);
    buffer[1] = vector<int>(25, 0);
    buffer[2] = vector<int>(25, 0);
    buffer[3] = vector<int>(30, 0);
    buffer[4] = vector<int>(4, 0);

    for (int i = 0; i < 125; i++)
    {
        matriks.push_back(i + 1);
    }

    random_shuffle(matriks.begin(), matriks.end());

    this->calculateBuffer();
    this->val = this->objectiveFunction();
}

State::State(vector<int> &m)
{
    matriks = m;

    buffer[0] = vector<int>(25, 0);
    buffer[1] = vector<int>(25, 0);
    buffer[2] = vector<int>(25, 0);
    buffer[3] = vector<int>(30, 0);
    buffer[4] = vector<int>(4, 0);

    this->calculateBuffer();
    this->val = this->objectiveFunction();
}

State::State(const State &state) : val(state.val)
{
    matriks = state.matriks;

    for (int i = 0; i < 5; ++i)
    {
        buffer[i] = state.buffer[i];
    }
}

/*-------------------- GETTER/SETTER -----------------------*/

int State::getElement(int i, int j, int k)
{
    int idx = getVectorIndex(i, j, k);
    return this->matriks[idx];
}

void State::setElement(int i, int j, int k, int val)
{
    int idx = getVectorIndex(i, j, k);
    this->matriks[idx] = val;
}

int State::getStateValue()
{
    return this->val;
}

vector<int> State::getMatrix()
{
    return this->matriks;
}

/*-------------------- OUTPUT DEBUG -----------------------*/
string State::toString()
{
    std::ostringstream oss;
    int idx = 0;
    for (int i = 0; i < 5; ++i)
    {
        oss << "Layer " << i + 1 << ":\n";
        for (int j = 0; j < 5; ++j)
        {
            for (int k = 0; k < 5; ++k)
            {
                oss << matriks[idx] << "\t";
                idx++;
            }
            oss << "\n";
        }
        oss << "\n";
    }
    return oss.str();
}

void State::printBuffer()
{
    for (vector vec : this->buffer)
    {
        for (int segment : vec)
        {
            cout << segment << " ";
        }
        cout << endl;
    }
}

/*-------------------- HELPER DIAGONAL -----------------------*/

vector<int> State::diaBidangIndexes(int i, int j, int k)
{
    vector<int> bidang_indexes;

    if (j == k)
    {
        bidang_indexes.push_back(2 * i);
    }

    if (j + k == 4)
    {
        bidang_indexes.push_back(2 * i + 1);
    }

    if (i == k)
    {
        bidang_indexes.push_back((2 * j) + 10);
    }

    if (i + k == 4)
    {

        bidang_indexes.push_back((2 * j) + 11);
    }

    if (i == j)
    {

        bidang_indexes.push_back(2 * k + 20);
    }

    if (i + j == 4)
    {
        bidang_indexes.push_back(2 * k + 21);
    }

    return bidang_indexes;
}

vector<int> State::diaRuangIndexes(int i, int j, int k)
{
    vector<int> ruang_indexes;
    if (i == j && j == k)
    {
        ruang_indexes.push_back(0);
    }

    if ((4 - i) == j && j == k)
    {
        ruang_indexes.push_back(1);
    }

    if (i == (4 - j) && i == k)
    {
        ruang_indexes.push_back(2);
    }

    if (i == j && j == (4 - k))
    {
        ruang_indexes.push_back(3);
    }

    return ruang_indexes;
}

/*-------------------- BUFFER METHODS -----------------------*/

void State::updateBuffer(int i1, int j1, int k1, int i2 = -1, int j2 = -1, int k2 = -1)
{
    bool isSwap = i2 != -1;
    int val1 = this->getElement(i1, j1, k1);
    int val2 = isSwap ? this->getElement(i2, j2, k2) : -1;
    int diffVal = val1 - val2;

    int row1_idx = i1 + 5 * k1;
    if (!isSwap)
    {
        buffer[0][row1_idx] += val1;
    }
    else
    {
        int row2_idx = i2 + 5 * k2;
        this->val += 2 * diffVal * (buffer[0][row2_idx] - buffer[0][row1_idx] + diffVal);
        buffer[0][row1_idx] -= diffVal;
        buffer[0][row2_idx] += diffVal;
    }

    int col1_idx = j1 + 5 * k1;
    if (!isSwap)
    {
        buffer[1][col1_idx] += val1;
    }
    else
    {
        int col2_idx = j2 + 5 * k2;
        this->val += 2 * diffVal * (buffer[1][col2_idx] - buffer[1][col1_idx] + diffVal);
        buffer[1][col1_idx] -= diffVal;
        buffer[1][col2_idx] += diffVal;
    }

    int tiang1_idx = i1 + 5 * j1;
    if (!isSwap)
    {
        buffer[2][tiang1_idx] += val1;
    }
    else
    {
        int tiang2_idx = i2 + 5 * j2;
        this->val += 2 * diffVal * (buffer[2][tiang2_idx] - buffer[2][tiang1_idx] + diffVal);
        buffer[2][tiang1_idx] -= diffVal;
        buffer[2][tiang2_idx] += diffVal;
    }

    vector<int> bidang1_indexes = this->diaBidangIndexes(i1, j1, k1);
    if (!isSwap)
    {
        for (int bidang1_idx : bidang1_indexes)
        {
            this->buffer[3][bidang1_idx] += val1;
        }
    }
    else
    {
        vector<int> bidang2_indexes = this->diaBidangIndexes(i2, j2, k2);
        for (int bidang1_idx : bidang1_indexes)
        {
            this->val += (630 - 2 * buffer[3][bidang1_idx] + diffVal) * diffVal;
            this->buffer[3][bidang1_idx] -= diffVal;
        }
        for (int bidang2_idx : bidang2_indexes)
        {
            this->val -= (630 - 2 * buffer[3][bidang2_idx] - diffVal) * diffVal;
            this->buffer[3][bidang2_idx] += diffVal;
        }
    }

    vector<int> ruang1_indexes = this->diaRuangIndexes(i1, j1, k1);
    if (!isSwap)
    {
        for (int ruang1_idx : ruang1_indexes)
        {
            this->buffer[4][ruang1_idx] += val1;
        }
    }
    else
    {
        vector<int> ruang2_indexes = this->diaRuangIndexes(i2, j2, k2);
        for (int ruang1_idx : ruang1_indexes)
        {
            this->val += (630 - 2 * buffer[4][ruang1_idx] + diffVal) * diffVal;
            this->buffer[4][ruang1_idx] -= diffVal;
        }
        for (int ruang2_idx : ruang2_indexes)
        {
            this->val -= (630 - 2 * buffer[4][ruang2_idx] - diffVal) * diffVal;
            this->buffer[4][ruang2_idx] += diffVal;
        }
    }
}

void State::calculateBuffer()
{
    int idx = 0;
    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            for (int k = 0; k < 5; k++)
            {
                this->updateBuffer(i, j, k);
                idx++;
            }
        }
    }
    this->val = this->objectiveFunction();
}

/*-------------------- OBJECTIVE FUNCTIOn -----------------------*/

int State::objectiveFunction()
{
    int result = 0;
    for (vector vec : this->buffer)
    {
        for (int segment : vec)
        {
            result += pow((segment - MAGIC_NUMBER), 2);
        }
    }
    return result;
}

/*-------------------- SUCCESSOR METHODS -----------------------*/

State State::generateSucc(int i1, int j1, int k1, int i2, int j2, int k2)
{
    State succ(*this);
    int val1 = this->getElement(i1, j1, k1), val2 = this->getElement(i2, j2, k2);

    succ.updateBuffer(i1, j1, k1, i2, j2, k2);
    succ.setElement(i1, j1, k1, val2);
    succ.setElement(i2, j2, k2, val1);

    return succ;
}

State State::highestValuedSucc()
{
    State bestState = *this;
    for (int i = 0; i < 5; i++)
    {
        for (int j = 0; j < 5; j++)
        {
            for (int k = 0; k < 5; k++)
            {
                for (int l = (25 * i + 5 * j + k + 1); l < 125; l++)
                {
                    int iSucc = l / 25, jSucc = (l % 25) / 5, kSucc = l % 5;
                    State succ = this->generateSucc(i, j, k, iSucc, jSucc, kSucc);
                    if(succ.getStateValue()<0){
                        cout<<i<<", "<<j<<", "<<k<<endl;
                        cout<<iSucc<<", "<<jSucc<<", "<<kSucc<<endl;
                        cout<<succ.getStateValue()<<endl;
                    }
                    if (succ.getStateValue() < bestState.getStateValue())
                    {
                        bestState = succ;
                    }
                }
            }
        }
    }

    return bestState;
}

State State::randomSucc()
{
    int arr1[3], arr2[3];
    do
    {
        for (int i = 0; i < 3; i++)
        {
            arr1[i] = rand() % 5;
            arr2[i] = rand() % 5;
        }
    } while ((arr1[0] == arr2[0] && arr1[1] == arr2[1] && arr1[2] == arr2[2]));
    State neighbor = this->generateSucc(arr1[0], arr1[1], arr1[2], arr2[0], arr2[1], arr2[2]);

    // cout<<arr1[0] << arr2[0] << arr1[1] << arr2[1] << arr1[2] << arr2[2]<<endl;
    // cout<<"BEFORE: "<<this->objectiveFunction()<<endl<<"AFTER: "<<neighbor.objectiveFunction()<<endl;
    return neighbor;
}

/*-------------------- OPERATOR OVERLOADING -----------------------*/

State &State::operator=(const State &other)
{
    if (this != &other)
    {
        matriks = other.matriks;
        val = other.val;
        for (int i = 0; i < 5; i++)
        {
            buffer[i] = other.buffer[i];
        }
    }
    return *this;
}