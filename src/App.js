import { useState } from "react";
import "./App.css";
import D2Render from "./components/2DRender";
import D3Render from "./components/3DRender";
import PlotChart from "./components/PlotChart";

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  // PLACEHOLDER --- WILL BE DELETED LATER --- WILL BE DELETED LATER --- WILL BE DELETED LATER --- WILL BE DELETED LATER
  let threeDArray = Array.from({ length: 5 }, (_, layerIndex) =>
    Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from(
        { length: 5 },
        (_, cellIndex) => layerIndex * 25 + rowIndex * 5 + cellIndex + 1
      )
    )
  );

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

  threeDArray = flatten3DArray(threeDArray);

  const twoDArray = Array.from({ length: 5 }, (_, rowIndex) =>
    Array.from({ length: 5 }, (_, cellIndex) => rowIndex * 5 + cellIndex + 1)
  );

  const oneDArray = Array.from({ length: 30 }, (_, index) => index + 1);

  for (let i = oneDArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [oneDArray[i], oneDArray[j]] = [oneDArray[j], oneDArray[i]];
  }
  // PLACEHOLDER --- WILL BE DELETED LATER --- WILL BE DELETED LATER --- WILL BE DELETED LATER --- WILL BE DELETED LATER

  const solveCube = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Le Cube Magique</h1>
      </header>
      <main>
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
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                >
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

          {selectedAlgorithm !== "Genetic Algorithm" && (
            <div>
              <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                Process
              </h2>

              <div className="mx-[10%] h-[800px] rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <D2Render array={threeDArray} />
                  ) : (
                    <p className="text-white text-xl">
                      Submit to render the cube
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
            Initial State
          </h2>

          <div className="mx-[10%] h-[800px] rounded-3xl border-4 border-white mb-8">
            <div className="w-full h-full flex items-center justify-center">
              {isSubmitted ? (
                <D3Render array={threeDArray} />
              ) : (
                <p className="text-white text-xl">Submit to render the cube</p>
              )}
            </div>
          </div>

          <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
            Final State
          </h2>

          <div className="mx-[10%] h-[800px] rounded-3xl border-4 border-white mb-8">
            <div className="w-full h-full flex items-center justify-center">
              {isSubmitted ? (
                <D3Render array={threeDArray} />
              ) : (
                <p className="text-white text-xl">Submit to render the cube</p>
              )}
            </div>
          </div>

          <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
            Value Graph
          </h2>
          <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
            <div className="w-full h-full flex items-center justify-center">
              {isSubmitted ? (
                <PlotChart array={oneDArray} />
              ) : (
                <p className="text-white text-xl">Submit to render the graph</p>
              )}
            </div>
          </div>

          {selectedAlgorithm === "Simulated Annealing" && (
            <div>
              <h2 className="mx-[10%] text-4xl font-bold text-white mb-4">
                Simulated Annealing Graph
              </h2>
              <div className="mx-[10%] h-[400px] rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <PlotChart array={oneDArray} />
                  ) : (
                    <p className="text-white text-xl">
                      Submit to render the graph
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <footer className="flex flex-wrap mx-[9%] justify-center">
          <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-bold mx-4">
                {isSubmitted ? "Objective Function: Val" : "Objective Function"}{" "}
              </p>
            </div>
          </div>
          <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-bold mx-4">
                {isSubmitted ? "Duration: Val" : "Duration"}{" "}
              </p>
            </div>
          </div>
          <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-white text-lg font-bold mx-4">
                {isSubmitted ? "Iteration: Val" : "Iteration"}{" "}
              </p>
            </div>
          </div>
          {selectedAlgorithm === "Genetic Algorithm" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? "Population: Val" : "Population"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Sideways Move Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? "Max SIdeways: Val" : "Max Sideways"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? "Restart: Val" : "Restart"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted
                    ? "Iteration / Restart: Val"
                    : "Iteration / Restart"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Random Restart Hill Climbing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? "Max Restart: Val" : "Max Restart"}{" "}
                </p>
              </div>
            </div>
          )}
          {selectedAlgorithm === "Simulated Annealing" && (
            <div className="w-[200px] h-[200px] rounded-3xl border-4 border-white bg-black t mb-8 mx-4">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-lg font-bold mx-4">
                  {isSubmitted ? "Stuck Frequency: Val" : "Stuck Frequency"}{" "}
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
