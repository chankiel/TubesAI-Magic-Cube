#include "state.hpp"

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

vector<int> State::diaRuangIndexes(int i,int j,int k){
    vector<int> ruang_indexes;
    if(i==j && j==k){
        ruang_indexes.push_back(0);
    }

    if((4-i)==j && j==k){
        ruang_indexes.push_back(1);
    }

    if(i==(4-j) && i==k){
        ruang_indexes.push_back(2);
    }

    if(i==j && j==(4-k)){
        ruang_indexes.push_back(3);
    }

    return ruang_indexes;
}

void State::calculateBuffer()
{
    for (int i = 0; i < 4; i++)
    {
        for (int j = 0; j < 4; j++)
        {
            for (int k = 0; k < 4; k++)
            {
                this->updateBuffer(i, j, k, this->matriks[i][j][k], 0);
            }
        }
    }
    this->val = this->objectiveFunction();
}

void State::updateBuffer(int i, int j, int k, int newVal, int oldVal)
{
    int diffVal = newVal - oldVal;
    if (diffVal == 0)
    {
        return;
    }

    int row_idx = i + 5 * k;
    buffer[0][row_idx] += diffVal;
    if (buffer[0][row_idx] == MAGIC_NUMBER)
        this->val += 1;
    if (buffer[0][row_idx] - diffVal == MAGIC_NUMBER)
        this->val -= 0;

    int col_idx = j + 5 * k;
    buffer[1][col_idx] += diffVal;
    if (buffer[1][col_idx] == MAGIC_NUMBER)
        this->val += 1;
    if (buffer[1][col_idx] - diffVal == MAGIC_NUMBER)
        this->val -= 1;

    int tiang_idx = i + 5 * j;
    buffer[2][tiang_idx] += diffVal;
    if (buffer[2][tiang_idx] == MAGIC_NUMBER)
        this->val += 1;
    if (buffer[2][tiang_idx] - diffVal == MAGIC_NUMBER)
        this->val -= 1;

    vector<int> bidang_indexes = this->diaBidangIndexes(i, j, k);
    for (int bidang_idx : bidang_indexes)
    {
        this->buffer[3][bidang_idx] += diffVal;
        if (buffer[3][bidang_idx] == MAGIC_NUMBER)
            this->val += 1;
        if (buffer[3][bidang_idx] - diffVal == MAGIC_NUMBER)
            this->val -= 1;
    }

    vector<int> ruang_indexes = this->diaRuangIndexes(i, j, k);
    for (int idx : ruang_indexes)
    {
        this->buffer[4][idx] += diffVal;
        if (buffer[4][idx] == MAGIC_NUMBER)
            this->val += 1;
        if (buffer[4][idx] - diffVal == MAGIC_NUMBER)
            this->val -= 1;
    }
}

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


