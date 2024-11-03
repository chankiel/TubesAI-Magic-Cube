package main

import (
	"math"
	"math/rand"
	"time"
)

// Constants
const (
    NMAX           = 10000
    MAX_SIDEWAYS   = 100
    SIMULATED_BOUND = 0.5
)

// DataFormat struct
type DataFormat struct {
    InitialState   [125]int
    LastState      [125]int
    ObjEachStep    []int
    Duration       float64
    NumRestarts    int
    PlotE          []float64
}

func SteepestAscentHC() DataFormat {
    var current State = NewState();
    df := DataFormat{
        InitialState: current.getMatrix(),
    }

    start := time.Now()
    for {
        neighbor := current.highestValuedSucc()
        df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())
        if neighbor.getStateValue() >= current.getStateValue() {
            break
        }

        current = neighbor
    }
    elapsed := time.Since(start)

    df.LastState = current.getMatrix()
    df.Duration = elapsed.Seconds()
    return df
}

func SideWaysMoveHC(maxSideways int) DataFormat {
    var current State = NewState()
    df := DataFormat{
        InitialState: current.getMatrix(),
    }

    start := time.Now()
    sidewaysMove := 0
    for {
        neighbor := current.highestValuedSucc()
        
        df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())

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

        current = neighbor
    }
    elapsed := time.Since(start)

    df.LastState = current.getMatrix()
    df.Duration = elapsed.Seconds()
    return df
}

func Stochastic() DataFormat {
    var current State = NewState()
    df := DataFormat{
        InitialState: current.getMatrix(),
    }

    start := time.Now()
    for i := 0; i < NMAX; i++ {
        neighbor := current.randomSucc()
        df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())

        if neighbor.getStateValue() > current.getStateValue() {
            current = neighbor
        }
    }
    elapsed := time.Since(start)

    df.LastState = current.getMatrix()
    df.Duration = elapsed.Seconds()
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

    start := time.Now()
    t := 0
    for {
        T := Schedule(t)
        if T <= 0.01 {
            break
        }
        neighbor := current.randomSucc()
        df.ObjEachStep = append(df.ObjEachStep, neighbor.getStateValue())

        deltaE := neighbor.getStateValue() - current.getStateValue()
        if deltaE < 0 {
            current = neighbor
        } else {
            eulerVal := math.Exp(float64(-deltaE)/T)
            df.PlotE = append(df.PlotE, eulerVal)
            if rand.Float64() <= eulerVal {
                current = neighbor
            }
        }
        t++
    }
    elapsed := time.Since(start)

    df.LastState = current.getMatrix()
    df.Duration = elapsed.Seconds()
    return df
}

// func main() {
//     // arr := [125]int{ 52, 16, 80, 104, 90, 115, 98, 4, 1, 97, 42, 111, 85, 2, 75, 66, 72, 27, 102, 48, 67, 18, 119, 106, 5,
//     //     91, 77, 71, 6, 70, 64, 25, 117, 69, 13, 30, 118, 21, 123, 23, 26, 39, 92, 44, 114, 116, 17, 14, 73, 95,
//     //     47, 61, 45, 76, 86, 107, 43, 38, 33, 94, 89, 68, 63, 58, 37, 32, 93, 88, 83, 19, 40, 50, 81, 65, 79,
//     //     31, 53, 112, 109, 10, 12, 82, 34, 87, 100, 103, 3, 105, 8, 96, 113, 57, 9, 62, 74, 56, 120, 55, 49, 35,
//     //     121, 108, 7, 20, 59, 29, 28, 122, 125, 11, 51, 15, 41, 124, 84, 78, 54, 99, 24, 60, 36, 110, 46, 22, 101}

//     // test := SteepestAscentHCInput(arr);
//     test := SideWaysMoveHC(10);
//     for _,value:=range test.ObjEachStep{
//         fmt.Println(value)
//     }
//     // test := NewStateWithMatrix(arr)
//     // succ := test.generateSucc(0,0,0,0,0,1)
//     // test.printBuffer()

//     // succ.printBuffer()
//     // fmt.Println(test.Duration)
// }