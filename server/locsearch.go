package main

import (
	"math"
	"math/rand"
	"time"
)

// Constants
const (
	NMAX             = 10000
	MAX_SIDEWAYS     = 100
	SIMULATED_BOUND  = 0.5
	SIZE_MAGIC       = 125
	MUTATE_THRESHOLD = 0.9
	MIN_OBJ_RESTART  = 100
	GOAL_OBJ         = 0
)

// DataFormat Umum
type DataFormat struct {
	InitialState        [125]int
	LastState           [125]int
	BestObj             int
	ObjEachStep         []int
	RestartObj          [][]int
	Duration            float64
	NumRestarts         int
	IterationPerRestart []int
	PlotE               []float64
	FirstSwapIndex      []int
	SecondSwapIndex     []int
}

// Khusus Genetic
type GeneticFormat struct {
	InitialPopulation [][125]int
	LastPopulation    [][125]int
	BestState         [125]int
	BestObj           int
	MaxPerIteration   []int
	AvgPerIteration   []float64
	NumIterations     int
	Duration          float64
}

func SteepestAscentHC() DataFormat {
	var current State = NewState()
	df := DataFormat{
		InitialState: current.getMatrix(),
	}
	df.ObjEachStep = append(df.ObjEachStep, current.getStateValue())

	start := time.Now()
	for {
		neighbor, FirstSwapIndex, SecondSwapIndex := current.highestValuedSucc()
		if neighbor.getStateValue() >= current.getStateValue() {
			break
		}
		df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())
		df.FirstSwapIndex = append(df.FirstSwapIndex, FirstSwapIndex)
		df.SecondSwapIndex = append(df.SecondSwapIndex, SecondSwapIndex)

		current = neighbor
	}
	elapsed := time.Since(start)

	df.LastState = current.getMatrix()
	df.Duration = elapsed.Seconds()
	df.BestObj = current.val
	return df
}

func RandomRestartHC(maxRestart int) DataFormat {
	var current State
	var df DataFormat
	var bestState = State{val: math.MaxInt}
	start := time.Now()
	numRestart := 0
	for {
		current = NewState()
		if numRestart == 0 {
			df = DataFormat{
				InitialState: current.getMatrix(),
			}
		}

		df.RestartObj = append(df.RestartObj, []int{})
		iteration := 0
		for {
			iteration++
			neighbor, _, _ := current.highestValuedSucc()
			if neighbor.getStateValue() >= current.getStateValue() {
				break
			}
			df.RestartObj[numRestart] = append(df.RestartObj[numRestart], neighbor.getStateValue())

			current = neighbor
		}
		if current.val < bestState.val {
			bestState = current
		}

		df.IterationPerRestart = append(df.IterationPerRestart, iteration)

		numRestart++
		if numRestart == maxRestart || bestState.val == GOAL_OBJ {
			break
		}
	}
	elapsed := time.Since(start)

	df.NumRestarts = numRestart
	df.LastState = bestState.matriks
	df.Duration = elapsed.Seconds()
	df.BestObj = bestState.val
	return df
}

func SideWaysMoveHC(maxSideways int) DataFormat {
	var current State = NewState()
	df := DataFormat{
		InitialState: current.getMatrix(),
	}
	df.ObjEachStep = append(df.ObjEachStep, current.getStateValue())

	start := time.Now()
	sidewaysMove := 0
	for {
		neighbor, FirstSwapIndex, SecondSwapIndex := current.highestValuedSucc()

		if neighbor.getStateValue() > current.getStateValue() {
			break
		} else if neighbor.getStateValue() == current.getStateValue() {
			sidewaysMove++
			if sidewaysMove == maxSideways {
				break
			}
		} else {
			sidewaysMove = 0
		}

		df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())
		current = neighbor
		df.FirstSwapIndex = append(df.FirstSwapIndex, FirstSwapIndex)
		df.SecondSwapIndex = append(df.SecondSwapIndex, SecondSwapIndex)
	}
	elapsed := time.Since(start)

	df.LastState = current.getMatrix()
	df.Duration = elapsed.Seconds()
	df.BestObj = current.val
	return df
}

func Stochastic() DataFormat {
	var current State = NewState()
	df := DataFormat{
		InitialState: current.getMatrix(),
	}
	df.ObjEachStep = append(df.ObjEachStep, current.getStateValue())

	start := time.Now()
	for i := 0; i < NMAX; i++ {
		neighbor, FirstSwapIndex, SecondSwapIndex := current.randomSucc()

		if neighbor.getStateValue() < current.getStateValue() {
			current = neighbor
		}

		df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())

		df.FirstSwapIndex = append(df.FirstSwapIndex, FirstSwapIndex)
		df.SecondSwapIndex = append(df.SecondSwapIndex, SecondSwapIndex)
	}
	elapsed := time.Since(start)

	df.LastState = current.getMatrix()
	df.Duration = elapsed.Seconds()
	df.BestObj = current.val
	return df
}

func Schedule(t int) float64 {
	return 50000 * math.Pow(0.95, float64(t))
}

func SimulatedAnnealing() DataFormat {
	var current State = NewState()
	df := DataFormat{
		InitialState: current.getMatrix(),
	}
	df.ObjEachStep = append(df.ObjEachStep, current.getStateValue())


	start := time.Now()
	t := 0
	for {
		T := Schedule(t)
		if T <= 0.01 {
			break
		}
		neighbor, FirstSwapIndex, SecondSwapIndex := current.randomSucc()

		deltaE := neighbor.getStateValue() - current.getStateValue()
		if deltaE < 0 {
			current = neighbor

			df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())
			df.FirstSwapIndex = append(df.FirstSwapIndex, FirstSwapIndex)
			df.SecondSwapIndex = append(df.SecondSwapIndex, SecondSwapIndex)
		} else {
			eulerVal := math.Exp(float64(-deltaE) / T)
			df.PlotE = append(df.PlotE, eulerVal)
			if rand.Float64() <= eulerVal {
				current = neighbor

				df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())
				df.FirstSwapIndex = append(df.FirstSwapIndex, FirstSwapIndex)
				df.SecondSwapIndex = append(df.SecondSwapIndex, SecondSwapIndex)
			}
		}
		t++
	}
	elapsed := time.Since(start)

	df.LastState = current.getMatrix()
	df.Duration = elapsed.Seconds()
	df.BestObj = current.val
	return df
}

func randomSelectionGenetic(population []State, totalValue, nPopulation int) int {
	randomProb := rand.Float64()
	iteratorProb := 0.0
	for i := 0; i < nPopulation; i++ {
		state_prob := float64(population[i].getStateValue()) / float64(totalValue)
		if state_prob >= randomProb-iteratorProb {
			return i
		}
		iteratorProb += state_prob
	}
	return -1
}

// Order Crossover
func OX1(parent1, parent2 State) State {
	crossoverPoint1 := rand.Intn(SIZE_MAGIC)
	crossoverPoint2 := rand.Intn(SIZE_MAGIC)

	if crossoverPoint1 > crossoverPoint2 {
		crossoverPoint1, crossoverPoint2 = crossoverPoint2, crossoverPoint1
	}

	var offspring []int = make([]int, 125)

	copy(offspring[crossoverPoint1:crossoverPoint2], parent1.matriks[crossoverPoint1:crossoverPoint2])
	fillRemaining(offspring, parent2.matriks, crossoverPoint1, crossoverPoint2)

	return NewStateWithMatrix(offspring)
}

func fillRemaining(offspring []int, parent [125]int, start, end int) {
	currentPos := end
	for i := 0; i < SIZE_MAGIC; i++ {
		element := parent[i]

		if !contains(offspring[start:end], element) {
			for currentPos >= SIZE_MAGIC {
				currentPos -= SIZE_MAGIC
			}

			if offspring[currentPos] == 0 {
				offspring[currentPos] = element
				currentPos++
			}
		}
	}
}

func contains(arr []int, element int) bool {
	for _, val := range arr {
		if val == element {
			return true
		}
	}
	return false
}

func mutateProb() bool {
	return rand.Float64() > MUTATE_THRESHOLD
}

func GeneticAlgorithm(nPopulation, nIteration int) GeneticFormat {
	var gf GeneticFormat

	var population []State
	totalValue := 0
	for i := 0; i < nPopulation; i++ {
		state := NewState()
		population = append(population, state)
		gf.InitialPopulation = append(gf.InitialPopulation, state.matriks)
		totalValue += state.val
	}

	start := time.Now()

	var bestOverall = State{val: math.MaxInt}
	iteration := 0
	for iteration < nIteration && bestOverall.val > 0 {
		new_population := []State{}
		var bestChild = State{val: math.MaxInt}
		newTotalValue := 0

		for i := 0; i < nPopulation; i++ {
			x := randomSelectionGenetic(population, totalValue, nPopulation)
			y := randomSelectionGenetic(population, totalValue, nPopulation)
			child := OX1(population[x], population[y])
			if mutateProb() {
				child, _, _ = child.randomSucc()
			}
			if child.val < bestChild.val {
				bestChild = child
			}
			new_population = append(new_population, child)
			newTotalValue += child.val
		}
		iteration++
		population = new_population
		totalValue = newTotalValue
		if bestChild.val < bestOverall.val {
			bestOverall = bestChild
		}

		gf.MaxPerIteration = append(gf.MaxPerIteration, bestChild.val)
		gf.AvgPerIteration = append(gf.AvgPerIteration, float64(newTotalValue)/float64(nPopulation))
	}

	elapsed := time.Since(start)

	gf.BestState = bestOverall.matriks
	gf.BestObj = bestOverall.val
	gf.Duration = elapsed.Seconds()
	gf.NumIterations = iteration
	for _, state := range population {
		gf.LastPopulation = append(gf.LastPopulation, state.matriks)
	}

	return gf
}

// func main() {
//     // arr := [125]int{ 52, 16, 80, 104, 90, 115, 98, 4, 1, 97, 42, 111, 85, 2, 75, 66, 72, 27, 102, 48, 67, 18, 119, 106, 5,
//     //     91, 77, 71, 6, 70, 64, 25, 117, 69, 13, 30, 118, 21, 123, 23, 26, 39, 92, 44, 114, 116, 17, 14, 73, 95,
//     //     47, 61, 45, 76, 86, 107, 43, 38, 33, 94, 89, 68, 63, 58, 37, 32, 93, 88, 83, 19, 40, 50, 81, 65, 79,
//     //     31, 53, 112, 109, 10, 12, 82, 34, 87, 100, 103, 3, 105, 8, 96, 113, 57, 9, 62, 74, 56, 120, 55, 49, 35,
//     //     121, 108, 7, 20, 59, 29, 28, 122, 125, 11, 51, 15, 41, 124, 84, 78, 54, 99, 24, 60, 36, 110, 46, 22, 101}

//     // test := GeneticAlgorithm(1000,100);
// 	// rand.Seed(time.Now().UnixNano())
//     // for _,value:=range test.MaxPerIteration{
//     //     fmt.Println(value)
//     // }
// }
