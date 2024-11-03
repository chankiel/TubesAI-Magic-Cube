import { useState } from "react";
import { useEffect } from "react";
import "./App.css";
import D2Render from "./components/2DRender";
import D3Render from "./components/3DRender";
import PlotChart from "./components/PlotChart";
import "./assets/kanit.css";
import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");

  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    //await loadFull(engine);
    await loadSlim(engine);
    }, []);

  const particlesLoaded = useCallback(async container => {
      await console.log(container);
  }, []);

  useEffect(() => {
    const tsparticles = document.getElementById("tsparticles");
    tsparticles.style.height = `${document.documentElement.scrollHeight}px`;
  }, []);

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

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const n = 5;
  const processA = [
    Array.from({ length: n }, () => {
      const numbers = Array.from({ length: 125 }, (_, i) => i + 1);
      shuffleArray(numbers);
      return numbers;
    }),

    Array.from({ length: n }, () => Math.floor(Math.random() * 125) + 1),

    Array.from({ length: n }, () => Math.floor(Math.random() * 125) + 1),
  ];

  processA[0].unshift(threeDArray);
  processA[1].unshift(7);
  processA[2].unshift(17);

  // console.log(processA);
  // console.log(threeDArray);
  // PLACEHOLDER --- WILL BE DELETED LATER --- WILL BE DELETED LATER --- WILL BE DELETED LATER --- WILL BE DELETED LATER

  const solveCube = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="App">
      <Particles 
      id="tsparticles" 
      init={particlesInit} 
      loaded={particlesLoaded} 
      options={{ "fullScreen": false, 
                 "background":{ 
                    "image":" linear-gradient(180deg, #000d0d 0%, #007373 100%)" 
                  }, 
                  "particles":{ 
                     "number":{ 
                        "value":45, 
                        "density":{ 
                          "enable":true, 
                          "value_area":700 
                        } 
                      }, 
                      "color":{ 
                        "value":"#005c5c" 
                      }, 
                      "shape": { 
                        "type": "square", 
                        "stroke":{ 
                          "width":0, 
                          "color":"#003b3b" 
                        }, 
                        "polygon":{ 
                          "nb_sides":5 
                        } 
                      }, 
                      "opacity":{ 
                        "value":0.50, 
                        "random":true, 
                        "anim":{ 
                          "enable":false, 
                          "speed":25, 
                          "opacity_min":0.1, 
                          "sync":false 
                        } 
                      }, 
                      "size":{ 
                        "value":34, 
                        "random":true, 
                        "anim":{ 
                          "enable":false, 
                          "speed":25, 
                          "size_min":0.1, 
                          "sync":false 
                        } 
                      }, 
                      "line_linked":{ 
                        "enable":false, 
                        "distance":300, 
                        "color":"#ffffff", 
                        "opacity":0, 
                        "width":0 
                      }, 
                      "move":{ 
                        "enable":true, 
                        "speed":3, 
                        "direction":"outside", 
                        "straight":true, 
                        "out_mode":"out", 
                        "bounce":false, 
                        "attract":{ 
                          "enable":false, 
                          "rotateX":900, 
                          "rotateY":1500 
                        } 
                      } 
                    }, 
                    "interactivity":{ 
                      "detect_on":"canvas", 
                      "events":{ 
                        "onhover":{ 
                          "enable":false, 
                          "mode":"repulse" 
                        }, 
                        "onclick":{ 
                          "enable":false, 
                          "mode":"push" 
                        }, 
                        "resize":true 
                      }, 
                      "modes":{ 
                        "grab":{ 
                          "distance":800, 
                          "line_linked":{ 
                            "opacity":1 
                          } 
                        }, 
                        "bubble":{ 
                          "distance":790, 
                          "size":79, 
                          "duration":2, 
                          "opacity":0.8, 
                          "speed":3 
                        }, 
                        "repulse":{ 
                          "distance":400, 
                          "duration":0.4 
                        }, 
                        "push":{ 
                          "particles_nb":4 
                        }, 
                        "remove":{ 
                          "particles_nb":2 
                        } 
                      } 
                    }, 
                    "retina_detect":true
                  }}
      />
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

              <div className="mx-[10%] min-h-[300px] flex rounded-3xl border-4 border-white mb-8">
                <div className="w-full h-full flex items-center justify-center">
                  {isSubmitted ? (
                    <D2Render
                      array={processA[0]}
                      idx1={processA[1]}
                      idx2={processA[2]}
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
