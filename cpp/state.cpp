#include "state.hpp"
#include <cstdlib>   // random
#include <ctime>     // time
#include <algorithm> // shuffle
#include <sstream>   // tostring

int getVectorIndex(int i,int j,int k){
    return (25*i+5*j+k);
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
        matriks.push_back(i+1);
    }

    srand(static_cast<unsigned>(time(0)));
    random_shuffle(matriks.begin(), matriks.end());

    this->calculateBuffer();
    this->val = this->objectiveFunction();
}

State::State(vector<int>& m)
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
    int idx = getVectorIndex(i,j,k);
    return this->matriks[idx];
}

void State::setElement(int i, int j, int k, int val)
{
    int idx = getVectorIndex(i,j,k);
    this->matriks[idx] = val;
}

int State::getStateValue()
{
    return this->val;
}

vector<int> State::getMatrix(){
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

void State::updateBuffer(int i, int j, int k, int newVal, int oldVal)
{
    int diffVal = newVal - oldVal;
    if (diffVal == 0)
    {
        return;
    }

    int row_idx = i + 5 * k;

    // if(row_idx==0){
    //     cout<<i<<" "<<j<<" "<<k<<endl;
    // }

    buffer[0][row_idx] += diffVal;
    if (buffer[0][row_idx] == MAGIC_NUMBER)
        this->val += 1;
    if (buffer[0][row_idx] - diffVal == MAGIC_NUMBER)
        this->val -= 1;

    int col_idx = j + 5 * k;
    buffer[1][col_idx] += diffVal;
    if (buffer[1][col_idx] == MAGIC_NUMBER)
        this->val += 1;
    if (buffer[1][col_idx] - diffVal == MAGIC_NUMBER)
        this->val -= 1;

    int tiang_idx = i + 5 * j;
    // if(tiang_idx==0){
    //     cout<<i<<" "<<j<<" "<<k<<endl;
    // }
    buffer[2][tiang_idx] += diffVal;
    if (buffer[2][tiang_idx] == MAGIC_NUMBER)
        this->val += 1;
    if (buffer[2][tiang_idx] - diffVal == MAGIC_NUMBER)
        this->val -= 1;

    vector<int> bidang_indexes = this->diaBidangIndexes(i, j, k);

    // if(find(bidang_indexes.begin(),bidang_indexes.end(), 0) != bidang_indexes.end()){
    //     cout<<i<<" "<<j<<" "<<k<<endl;
    // }

    for (int bidang_idx : bidang_indexes)
    {
        this->buffer[3][bidang_idx] += diffVal;
        if (buffer[3][bidang_idx] == MAGIC_NUMBER)
            this->val += 1;
        if (buffer[3][bidang_idx] - diffVal == MAGIC_NUMBER)

            this->val -= 1;
    }

    vector<int> ruang_indexes = this->diaRuangIndexes(i, j, k);

    // if(find(ruang_indexes.begin(),ruang_indexes.end(), 2) != ruang_indexes.end()){
    //     cout<<i<<" "<<j<<" "<<k<<endl;
    // }

    for (int idx : ruang_indexes)
    {
        this->buffer[4][idx] += diffVal;
        if (buffer[4][idx] == MAGIC_NUMBER)
            this->val += 1;
        if (buffer[4][idx] - diffVal == MAGIC_NUMBER)
            this->val -= 1;
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
                this->updateBuffer(i, j, k, this->matriks[idx], 0);
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
            if (segment == 315)
            {
                result++;
            }
        }
    }
    return result;
}

/*-------------------- SUCCESSOR METHODS -----------------------*/

State State::generateSucc(int i1, int i2, int j1, int j2, int k1, int k2)
{
    State succ(*this);
    int val1 = this->getElement(i1, j1, k1), val2 = this->getElement(i2, j2, k2);
    succ.setElement(i1, j1, k1, val2);
    succ.setElement(i2, j2, k2, val1);

    succ.updateBuffer(i1, j1, k1, val2, val1);
    succ.updateBuffer(i2, j2, k2, val1, val2);

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
                    State succ = this->generateSucc(i, iSucc, j, jSucc, k, kSucc);
                    if (succ.getStateValue() > bestState.getStateValue())
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
    srand(time(0));

    int arr1[3], arr2[3];
    do
    {
        for (int i = 0; i < 3; i++)
        {
            arr1[i] = rand() % 5;
            arr2[i] = rand() % 5;
        }
    } while (!(arr1[0] == arr2[0] && arr1[1] == arr2[1] && arr1[2] == arr2[2]));

    State neighbor = this->generateSucc(arr1[0], arr2[0], arr1[1], arr2[1], arr1[2], arr2[2]);

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