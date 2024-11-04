import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import D2Render from "./components/2DRender";
import D3Render from "./components/3DRender";
import PlotChart from "./components/PlotChart";
import "./assets/kanit.css";
import LoadingModal from "./components/LoadingModal";
import Particlebg from "./components/Particlebg";

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxRes, setMaxRes] = useState(5);
  const [maxSide, setMaxSide] = useState(1);
  const [population, setPopulation] = useState(10);
  const [plotE, setplotE] = useState([0, 9, 1, 2]);
  const [oneDArray, setOneDArray] = useState([0, 9, 1, 2]);
  const [multipleOneD, setMultipleOneD] = useState([0, 9, 1, 2], [0, 9, 1, 2]);
  const [iterPerRes, setIterPerRes] = useState([0, 9, 1, 2]);
  const [iterGA, setIterGA] = useState(5);
  const [bestObj, setBestObj] = useState(0);

  // -----------------------------------------------------------------------------------------
  function flatten3DArray(array) {
    if (
      !Array.isArray(array) ||
      array.length !== 5 ||
      !array.every(
        (layer) =>
          Array.isArray(layer) &&
          layer.length === 5 &&
          layer.every((row) => Array.isArray(row) && row.length === 5)
      )
    ) {
      throw new Error("Invalid input: must be a 5x5x5 array.");
    }

    const flatArray = [];

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        for (let z = 0; z < 5; z++) {
          flatArray.push(array[x][y][z]);
        }
      }
    }

    return flatArray;
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  let threeDArray = Array.from({ length: 5 }, (_, layerIndex) =>
    Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from(
        { length: 5 },
        (_, cellIndex) => layerIndex * 25 + rowIndex * 5 + cellIndex + 1
      )
    )
  );

  threeDArray = flatten3DArray(threeDArray);

  // const [processA, setProcessA] = useState([
  //   [threeDArray, threeDArray],
  //   [1, 3],
  //   [6, 7],
  // ]);
  const [initState, setInitState] = useState(threeDArray);
  const [finalState, setFinalState] = useState(threeDArray);
  const [time, setTime] = useState(0);
  const [initPop, setInitPop] = useState([threeDArray]);
  const [finalPop, setFinalPop] = useState([threeDArray]);
  const [bestState, setBestState] = useState(threeDArray);
  const [maxPerIter, setMaxPerIter] = useState(threeDArray);
  const [avgPerIter, setAvgPerIter] = useState(threeDArray);
  const [processA, setProcessA] = useState([threeDArray]);
  const [changeIdx1, setChangeIdx1] = useState([0, 0]);
  const [changeIdx2, setChangeIdx2] = useState([0, 0]);

  function mapValue(input) {
    const mapping = {
      "Steepest Ascent Hill Climbing": "steepest-ascent",
      "Sideways Move Hill Climbing": `sideways-move/${maxSide}`,
      "Random Restart Hill Climbing": `random-restart/${maxRes}`,
      "Stochastic Hill Climbing": "stochastic",
      "Simulated Annealing": "simulated-annealing",
      "Genetic Algorithm": `genetic-algo/${population}/${iterGA}`,
    };

    const output = mapping[input];

    return output !== undefined ? output : "Not Found";
  }

  function swapAndGenerateArrays(initialArray, indexArray1, indexArray2) {
    const result = [initialArray];

    const swapIndices = (array, idx1, idx2) => {
      const newArray = [...array];
      const temp = newArray[idx1];
      newArray[idx1] = newArray[idx2];
      newArray[idx2] = temp;
      return newArray;
    };

    for (let i = 0; i < indexArray1.length; i++) {
      let modifiedArray = swapIndices(
        result[i],
        indexArray1[i],
        indexArray2[i]
      );
      result.push(modifiedArray);
    }

    return result;
  }
  // -----------------------------------------------------------------------------------------

  const solveCube = async () => {
    setIsSubmitted(false);
    setLoading(true);

    try {
      console.log(`http://localhost:8080/${mapValue(selectedAlgorithm)}`);
      const response = await fetch(
        `http://localhost:8080/${mapValue(selectedAlgorithm)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch processA");
      }
      const data = await response.json();

      console.log("data");
      console.log(data);

      if (selectedAlgorithm === "Genetic Algorithm") {
        setInitPop(data.InitialPopulation);
        setFinalPop(data.LastPopulation);
        setBestState(data.BestState);
        setBestObj(data.BestObj);
        setMaxPerIter(data.MaxPerIteration);
        setAvgPerIter(data.AvgPerIteration);
        setTime(data.Duration);
        setOneDArray(data.MaxPerIteration);
      } else if (selectedAlgorithm === "Random Restart Hill Climbing") {
        setInitState(data.InitialState);
        setFinalState(data.LastState);
        setTime(data.Duration);
        setMultipleOneD(data.RestartObj);
        setBestObj(data.BestObj);
        setIterPerRes(data.IterationPerRestart);
      } else {
        setInitState(data.InitialState);
        setFinalState(data.LastState);
        setTime(data.Duration);
        setOneDArray(data.ObjEachStep);
        setBestObj(oneDArray[oneDArray.length - 1]);
        // setOneDArray(oneDArray.reverse());
        setMaxRes(data.NumRestarts);
        setplotE(data.PlotE);
        setChangeIdx1(data.FirstSwapIndex);
        setChangeIdx2(data.SecondSwapIndex);
        setProcessA(
          swapAndGenerateArrays(
            data.InitialState,
            data.FirstSwapIndex,
            data.SecondSwapIndex
          )
        );
        console.log("dsini");
        console.log(processA, data.FirstSwapIndex, data.SecondSwapIndex);
      }

      // console.log("wandi");
      // console.log(oneDArray);
    } catch (error) {
      console.error("Error fetching processA:", error);
    } finally {
      setLoading(false);
      setIsSubmitted(true);
    }
  };

  // console.log("new");
  // console.log(processA);

  return (
    <div className="App">
      <Particlebg />
      <header className="header">
        <h1>Le Cube Magique</h1>
      </header>
      <main>
        <LoadingModal isLoading={loading} />
        <div className="main-element">
          <div className="input-result-container flex flex-row">
            <div className="w-full justify-center pb-8">
              <div className="form-texts">
                <h1>Solve This Magical Cube</h1>
                <h2 className="pb-4">
                  A magic cube is a three-dimensional extension of a magic
                  square, where multiple magic squares are arranged in a cube
                  formation. In a magic cube of order n×n×n, each layer
                  (horizontal, vertical, and depth) forms an n×n magic square.
                </h2>
              </div>
              <div className="input-container">
                <select
                  id="input-select"
                  className="selectors"
                  onChange={(e) => {
                    setSelectedAlgorithm(e.target.value);
                    setIsSubmitted(false);
                  }}
                >
                  <option value="" disabled selected hidden>
                    Select an algorithm
                  </option>
                  <option value="Steepest Ascent Hill Climbing">
                    Steepest Ascent Hill Climbing
                  </option>
                  <option value="Sideways Move Hill Climbing">
                    Sideways Move Hill Climbing
                  </option>
                  <option value="Random Restart Hill Climbing">
                    Random Restart Hill Climbing
                  </option>
                  <option value="Stochastic Hill Climbing">
                    Stochastic Hill Climbing
                  </option>
                  <option value="Simulated Annealing">
                    Simulated Annealing
                  </option>
                  <option value="Genetic Algorithm">Genetic Algorithm</option>
                </select>
                <button id="solve" onClick={solveCube} className="selectors">
                  Solve
                </button>
              </div>
            </div>
          </div>

          {selectedAlgorithm == "Genetic Algorithm" && (
            <div className="mb-6 flex justify-center">
              {" "}
              <div className="w-1/3">
                <h2 className="text-2xl font-bold text-blue-400 mb-4">
                  Genetic Algorithm Parameter
                </h2>
                <div className="block mb-2">
                  {" "}
                  <label className="text-white">Population:</label>
                  <input
                    type="number"
                    placeholder={population}
                    onChange={(e) => setPopulation(Number(e.target.value))}
                    min="1"
                    // value={population}
                    className="mt-1 ml-2 w-1/2 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    style={{
                      MozAppearance: "textfield",
                      WebkitAppearance: "none",
                    }}
                  />
                </div>
                <div className="block mb-2">
                  {" "}
                  <label className="text-white">Iteration:</label>
                  <input
                    type="number"
                    placeholder={iterGA}
                    onChange={(e) => setIterGA(Number(e.target.value))}
                    min="1"
                    // value={iterGA}
                    className="mt-1 ml-2 w-1/2 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    style={{
                      MozAppearance: "textfield",
                      WebkitAppearance: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {selectedAlgorithm == "Random Restart Hill Climbing" && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Random Restart Parameter
              </h2>
              <label className="block text-white mb-2">
                Max Restart:
                <input
                  type="number"
                  placeholder={maxRes}
                  onChange={(e) => setMaxRes(Number(e.target.value))}
                  min="1"
                  // value={maxRes}
                  className="mt-1 mx-4 w-1/5 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                />
              </label>
            </div>
          )}

          {selectedAlgorithm == "Sideways Move Hill Climbing" && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Sideways Parameter
              </h2>
              <label className="block text-white mb-2">
                Max Sideways:
                <input
                  type="number"
                  placeholder={maxSide}
                  onChange={(e) => setMaxSide(Number(e.target.value))}
                  min="1"
                  // value={maxRes}
                  className="mt-1 mx-4 w-1/5 p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  style={{
                    MozAppearance: "textfield",
                    WebkitAppearance: "none",
                  }}
                />
              </label>
            </div>
          )}

          {selectedAlgorithm !== "Genetic Algorithm" &&
            selectedAlgorithm !== "Random Restart Hill Climbing" && (
              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Process
                </h2>

                <div className="mx-[10%] min-h-[300px] flex rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* <p>Variable Value: {processA}</p> */}
                    {isSubmitted ? (
                      <D2Render
                        // array={processA[0]}
                        // idx1={processA[1]}
                        // idx2={processA[2]}
                        array={processA}
                        idx1={changeIdx1}
                        idx2={changeIdx2}
                        valAr={oneDArray}
                      />
                    ) : (
                      <p className="text-white text-xl mt-[130px]">
                        Submit to render the process
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          {selectedAlgorithm === "Genetic Algorithm" && (
            <div>
              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Initial Population Process
                </h2>

                <div className="mx-[10%] min-h-[300px] flex rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* <p>Variable Value: {processA}</p> */}
                    {isSubmitted ? (
                      <D2Render
                        // array={processA[0]}
                        // idx1={processA[1]}
                        // idx2={processA[2]}
                        array={initPop}
                        idx1={999}
                        idx2={999}
                      />
                    ) : (
                      <p className="text-white text-xl mt-[130px]">
                        Submit to render the process
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Final Population Process
                </h2>

                <div className="mx-[10%] min-h-[300px] flex rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {/* <p>Variable Value: {processA}</p> */}
                    {isSubmitted ? (
                      <D2Render
                        // array={processA[0]}
                        // idx1={processA[1]}
                        // idx2={processA[2]}
                        array={finalPop}
                        idx1={999}
                        idx2={999}
                      />
                    ) : (
                      <p className="text-white text-xl mt-[130px]">
                        Submit to render the process
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedAlgorithm !== "Genetic Algorithm" ? (
            <div>
              <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                Initial State
              </h2>

              <div className="mx-[10%] h-[800px] rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <D3Render array={initState} imeji="./background.jpg" />
                  ) : (
                    <p className="text-white text-xl">
                      Submit to render the cube
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                Best State
              </h2>

              <div className="mx-[10%] h-[800px] rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <D3Render array={bestState} imeji="./background.jpg" />
                  ) : (
                    <p className="text-white text-xl">
                      Submit to render the cube
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {selectedAlgorithm !== "Genetic Algorithm" && (
            <div>
              <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                Final State
              </h2>

              <div className="mx-[10%] h-[800px] rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <D3Render array={finalState} imeji="./background3.jpg" />
                  ) : (
                    <p className="text-white text-xl">
                      Submit to render the cube
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedAlgorithm !== "Genetic Algorithm" &&
            selectedAlgorithm !== "Random Restart Hill Climbing" && (
              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Value Graph
                </h2>
                <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {isSubmitted ? (
                      <PlotChart
                        array={oneDArray}
                        infoX={"Iterations"}
                        infoY={"Objective Value"}
                      />
                    ) : (
                      <p className="text-white text-xl">
                        Submit to render the graph
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

          {selectedAlgorithm === "Simulated Annealing" && (
            <div>
              <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                Simulated Annealing Graph
              </h2>
              <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <PlotChart
                      array={plotE}
                      infoX={"Iterations"}
                      infoY={"e^(Delta(E)/T)"}
                    />
                  ) : (
                    <p className="text-white text-xl">
                      Submit to render the graph
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div>
              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Random Restart Graph
                </h2>
                {isSubmitted ? (
                  multipleOneD.map((dataR, index) => (
                    <div
                      key={index}
                      className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8"
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <PlotChart
                          array={dataR}
                          infoX={"Iterations"}
                          infoY={`Objective Value Restart ${index}`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-white text-xl">
                    Submit to render the graph
                  </p>
                )}
              </div>

              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Iteration per Restart Graph
                </h2>
                <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {isSubmitted ? (
                      <PlotChart
                        array={iterPerRes}
                        infoX={"Restart"}
                        infoY={"Iteration"}
                      />
                    ) : (
                      <p className="text-white text-xl">
                        Submit to render the graph
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedAlgorithm === "Genetic Algorithm" && (
            <div>
              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Maximum Value Graph
                </h2>
                <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {isSubmitted ? (
                      <PlotChart
                        array={maxPerIter}
                        infoX={"Iterations"}
                        infoY={"Maximum Population"}
                      />
                    ) : (
                      <p className="text-white text-xl">
                        Submit to render the graph
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                  Average Value Graph
                </h2>
                <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
                  <div className="w-full h-full flex items-center justify-center">
                    {isSubmitted ? (
                      <PlotChart
                        array={avgPerIter}
                        infoX={"Iterations"}
                        infoY={"Average Population"}
                      />
                    ) : (
                      <p className="text-white text-xl">
                        Submit to render the graph
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className="flex flex-wrap mx-[9%] justify-center">
          {selectedAlgorithm === "Genetic Algorithm" ? (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted
                    ? `Objective Function: ${oneDArray[oneDArray.length - 1]}`
                    : "Objective Function"}{" "}
                </p>
              </div>
            </div>
          ) : (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted
                    ? `Objective Function: ${bestObj}`
                    : "Objective Function"}{" "}
                </p>
              </div>
            </div>
          )}
          <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-bold mx-4">
                {isSubmitted ? `Duration: ${time} second(s)` : "Duration"}{" "}
              </p>
            </div>
          </div>
          {selectedAlgorithm !== "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? `Iteration: ${oneDArray.length}` : "Iteration"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Genetic Algorithm" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? `GA Iteration: ${iterGA}` : "Population"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Genetic Algorithm" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? `Population: ${population}` : "Population"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Sideways Move Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? `Max Sideways: ${maxSide}` : "Max Sideways"}{" "}
                </p>
              </div>
            </div>
          )}

          {/* {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? "Restart: Val" : "Restart"}{" "}
                </p>
              </div>
            </div>
          )} */}

          {/* {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted
                    ? "Iteration / Restart: Val"
                    : "Iteration / Restart"}{" "}
                </p>
              </div>
            </div>
          )} */}

          {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? `Max Restart: ${maxRes}` : "Population"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Simulated Annealing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted
                    ? `Stuck Frequency: ${plotE.length}`
                    : "Stuck Frequency"}{" "}
                </p>
              </div>
            </div>
          )}
        </footer>
      </main>
    </div>
  );
}

export default App;
