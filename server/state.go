package main

import (
	"fmt"
	"math"
	"math/rand"
	"time"
)

const MAGIC_NUMBER = 315

func getVectorIndex(i, j, k int) int {
	return (25 * i) + (5 * j) + k
}

type State struct {
	matriks [125]int
	buffer  [5][]int
	val     int
}

func NewState() State {
	var state State
	for i := 0; i < 125; i++ {
		state.matriks[i] = i + 1
	}

	for i := 0; i < 3; i++ {
		state.buffer[i] = make([]int, 25)
	}
	state.buffer[3] = make([]int, 30)
	state.buffer[4] = make([]int, 4)

	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(state.matriks), func(i, j int) {
		state.matriks[i], state.matriks[j] = state.matriks[j], state.matriks[i]
	})

	state.calculateBuffer()
	state.val = state.objectiveFunction()

	return state
}

func NewStateWithMatrix(m [125]int) State {
	var state State
	state.matriks = [125]int{}
	state.matriks = m

	for i := 0; i < 25; i++ {
		state.buffer[0] = append(state.buffer[0], 0)
		state.buffer[1] = append(state.buffer[1], 0)
		state.buffer[2] = append(state.buffer[2], 0)
	}
	for i := 0; i < 30; i++ {
		state.buffer[3] = append(state.buffer[3], 0)
	}
	for i := 0; i < 4; i++ {
		state.buffer[4] = append(state.buffer[4], 0)
	}

	state.calculateBuffer()
	state.val = state.objectiveFunction()

	return state
}

func (s *State) getElement(i, j, k int) int {
	idx := getVectorIndex(i, j, k)
	return s.matriks[idx]
}

func (s *State) setElement(i, j, k, val int) {
	idx := getVectorIndex(i, j, k)
	s.matriks[idx] = val
}

func (s *State) getStateValue() int {
	return s.val
}

func (s *State) getMatrix() [125]int {
	return s.matriks
}

func (s *State) toString() string {
	result := ""
	idx := 0
	for i := 0; i < 5; i++ {
		result += fmt.Sprintf("Layer %d:\n", i+1)
		for j := 0; j < 5; j++ {
			for k := 0; k < 5; k++ {
				result += fmt.Sprintf("%d\t", s.matriks[idx])
				idx++
			}
			result += "\n"
		}
		result += "\n"
	}
	return result
}

func (s *State) copy() State {
	copyState := *s

	for i := range s.buffer {
		if s.buffer[i] != nil {
			copyState.buffer[i] = make([]int, len(s.buffer[i]))
			copy(copyState.buffer[i], s.buffer[i])
		}
	}

	return copyState
}

func (s *State) printBuffer() {
	for _, vec := range s.buffer {
		for _, segment := range vec {
			fmt.Printf("%d ", segment)
		}
		fmt.Println()
	}
}

func (s *State) diaBidangIndexes(i, j, k int) []int {
	var bidangIndexes []int
	if j == k {
		bidangIndexes = append(bidangIndexes, 2*i)
	}
	if j+k == 4 {
		bidangIndexes = append(bidangIndexes, 2*i+1)
	}
	if i == k {
		bidangIndexes = append(bidangIndexes, (2*j)+10)
	}
	if i+k == 4 {
		bidangIndexes = append(bidangIndexes, (2*j)+11)
	}
	if i == j {
		bidangIndexes = append(bidangIndexes, 2*k+20)
	}
	if i+j == 4 {
		bidangIndexes = append(bidangIndexes, 2*k+21)
	}
	return bidangIndexes
}

func (s *State) diaRuangIndexes(i, j, k int) []int {
	var ruangIndexes []int
	if i == j && j == k {
		ruangIndexes = append(ruangIndexes, 0)
	}
	if (4-i) == j && j == k {
		ruangIndexes = append(ruangIndexes, 1)
	}
	if i == (4-j) && i == k {
		ruangIndexes = append(ruangIndexes, 2)
	}
	if i == j && j == (4-k) {
		ruangIndexes = append(ruangIndexes, 3)
	}
	return ruangIndexes
}

func (s *State) updateBuffer(i1, j1, k1 int, i2, j2, k2 int) {
	isSwap := i2 != -1
	val1 := s.getElement(i1, j1, k1)
	var val2 int
	if isSwap {
		val2 = s.getElement(i2, j2, k2)
	}

	diffVal := val1 - val2
	row1Idx := i1 + 5*k1
	if !isSwap {
		s.buffer[0][row1Idx] += val1
	} else {
		row2Idx := i2 + 5*k2
		if row2Idx != row1Idx {
			s.val += 2 * diffVal * (s.buffer[0][row2Idx] - s.buffer[0][row1Idx] + diffVal)
			s.buffer[0][row1Idx] -= diffVal
			s.buffer[0][row2Idx] += diffVal
		}
	}

	col1Idx := j1 + 5*k1
	if !isSwap {
		s.buffer[1][col1Idx] += val1
	} else {
		col2Idx := j2 + 5*k2

        if(col2Idx != col1Idx){
            s.val += 2 * diffVal * (s.buffer[1][col2Idx] - s.buffer[1][col1Idx] + diffVal)
            s.buffer[1][col1Idx] -= diffVal
            s.buffer[1][col2Idx] += diffVal
        }
	}

	tiang1Idx := i1 + 5*j1
	if !isSwap {
		s.buffer[2][tiang1Idx] += val1
	} else {
		tiang2Idx := i2 + 5*j2
        if(tiang2Idx != tiang1Idx){
            s.val += 2 * diffVal * (s.buffer[2][tiang2Idx] - s.buffer[2][tiang1Idx] + diffVal)
            s.buffer[2][tiang1Idx] -= diffVal
            s.buffer[2][tiang2Idx] += diffVal
        }
	}

	bidang1Indexes := s.diaBidangIndexes(i1, j1, k1)
	if !isSwap {
		for _, bidang1Idx := range bidang1Indexes {
			s.buffer[3][bidang1Idx] += val1
		}
	} else {
		bidang2Indexes := s.diaBidangIndexes(i2, j2, k2)

        bidang2Map := make(map[int]struct{})
		for _, bidang2Idx := range bidang2Indexes {
			bidang2Map[bidang2Idx] = struct{}{}
		}

		bidang1Map := make(map[int]struct{})
		for _, bidang1Idx := range bidang1Indexes {
			bidang1Map[bidang1Idx] = struct{}{}
		}

		for _, bidang1Idx := range bidang1Indexes {
            if _, exists := bidang2Map[bidang1Idx]; !exists {
                s.val += (2*MAGIC_NUMBER - 2*s.buffer[3][bidang1Idx] + diffVal) * diffVal
                s.buffer[3][bidang1Idx] -= diffVal
            }
		}
		for _, bidang2Idx := range bidang2Indexes {
            if _, exists := bidang1Map[bidang2Idx]; !exists {
                s.val -= (2*MAGIC_NUMBER - 2*s.buffer[3][bidang2Idx] - diffVal) * diffVal
                s.buffer[3][bidang2Idx] += diffVal
            }
		}
	}

	ruang1Indexes := s.diaRuangIndexes(i1, j1, k1)
	if !isSwap {
		for _, ruang1Idx := range ruang1Indexes {
			s.buffer[4][ruang1Idx] += val1
		}
	} else {

		ruang2Indexes := s.diaRuangIndexes(i2, j2, k2)

		ruang2Map := make(map[int]struct{})
		for _, ruang2Idx := range ruang2Indexes {
			ruang2Map[ruang2Idx] = struct{}{}
		}

		ruang1Map := make(map[int]struct{})
		for _, ruang1Idx := range ruang1Indexes {
			ruang1Map[ruang1Idx] = struct{}{}
		}

		for _, ruang1Idx := range ruang1Indexes {
			if _, exists := ruang2Map[ruang1Idx]; !exists {
				s.val += (2*MAGIC_NUMBER - 2*s.buffer[4][ruang1Idx] + diffVal) * diffVal
				s.buffer[4][ruang1Idx] -= diffVal
			}
		}
		for _, ruang2Idx := range ruang2Indexes {
            if _, exists := ruang1Map[ruang2Idx]; !exists {
                s.val -= (2*MAGIC_NUMBER - 2*s.buffer[4][ruang2Idx] - diffVal) * diffVal
                s.buffer[4][ruang2Idx] += diffVal
            }
		}
	}
}

func (s *State) calculateBuffer() {
	for i := 0; i < 5; i++ {
		for j := 0; j < 5; j++ {
			for k := 0; k < 5; k++ {
				s.updateBuffer(i, j, k, -1, -1, -1)
			}
		}
	}
	s.val = s.objectiveFunction()
}

func (s *State) objectiveFunction() int {
	result := 0
	for i := 0; i < 5; i++ {
		for _, sum := range s.buffer[i] {
			result += int(math.Pow(float64(MAGIC_NUMBER-sum), 2))
		}
	}
	return result
}

func (s *State) generateSucc(i1, j1, k1, i2, j2, k2 int) State {
	succ := s.copy()
	val1 := s.getElement(i1, j1, k1)
	val2 := s.getElement(i2, j2, k2)

	succ.updateBuffer(i1, j1, k1, i2, j2, k2)
	succ.setElement(i1, j1, k1, val2)
	succ.setElement(i2, j2, k2, val1)

	return succ
}

func (s *State) highestValuedSucc() State {
	bestState := s.copy()
	idx := 0
	for i := 0; i < 5; i++ {
		for j := 0; j < 5; j++ {
			for k := 0; k < 5; k++ {
				for l := (25*i + 5*j + k + 1); l < 125; l++ {
					iSucc := l / 25
					jSucc := (l % 25) / 5
					kSucc := l % 5
					succ := s.generateSucc(i, j, k, iSucc, jSucc, kSucc)

					if succ.getStateValue() < bestState.getStateValue() {
						// bestState.printBuffer()
						// fmt.Println("--------")
						// succ.printBuffer()
						// fmt.Println(i, j, k, iSucc, jSucc, kSucc)
						// fmt.Println(s.matriks[idx],s.matriks[l])
						// fmt.Println(bestState.getStateValue(),succ.getStateValue())
						bestState = succ
					}
				}
				idx++
			}
		}
	}

	return bestState
}

func (s *State) randomSucc() State {
	var arr1, arr2 [3]int
	for {
		for i := 0; i < 3; i++ {
			arr1[i] = rand.Intn(5)
			arr2[i] = rand.Intn(5)
		}
		if arr1 != arr2 {
			break
		}
	}

	return s.generateSucc(arr1[0], arr1[1], arr1[2], arr2[0], arr2[1], arr2[2])
}
