import { color } from "chart.js/helpers";
import React, { useState, useEffect } from "react";

const D2 = ({ array, idx1, idx2 }) => {
  // SVGs
  const PlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 16 16"
      // className="mr-2"
    >
      <path d="M11.596 8.12L4.47 12.637a.5.5 0 0 1-.745-.433V3.796a.5.5 0 0 1 .745-.433l7.126 4.516a.5.5 0 0 1 0 .866z" />
    </svg>
  );

  const PauseIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 16 16"
      // className=""
    >
      <path d="M5.5 0h-2a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM10.5 0h-2a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5z" />
    </svg>
  );

  // LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC
  const [currentLayer, setCurrentLayer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentLayer((prev) => (prev + 1) % array.length);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, array.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setCurrentLayer(value);
  };

  const currentGrid = array[currentLayer];
  const chunks = [];
  for (let i = 0; i < 5; i++) {
    chunks.push(currentGrid.slice(i * 25, i * 25 + 25));
  }

  const curI1 = idx1[currentLayer];
  const curI2 = idx2[currentLayer];
  // LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC --- LOGIC

  return (
    <div
      className="w-full h-full rounded-3xl p-4"
      style={{ backgroundColor: "black" }}
    >
      <div className="flex justify-center mb-4">
        <div className="text-white font-bold">Step {currentLayer + 1}</div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {chunks.map((chunk, chunkIndex) => (
          <div
            key={chunkIndex}
            className="w-1/4 h-1/4 bg-blue-300 rounded-3xl p-2"
          >
            <div className="text-center text-black font-bold mb-2">
              Layer {chunkIndex + 1}
            </div>
            <div className="w-full h-full grid grid-cols-5 gap-1">
              {chunk.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center text-white rounded-lg h-10 w-full ${
                    chunkIndex * 25 + index === curI1 ||
                    chunkIndex * 25 + index === curI2
                      ? "bg-red-500"
                      : "bg-gray-800"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={togglePlayPause}
        className=" bg-green-600 mt-8 mb-8 text-white px-4 py-2 rounded-lg font-semibold justify-center"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
        {/* {isPlaying ? "Pause" : "Play"} */}
      </button>

      <input
        type="range"
        min="0"
        max={array.length - 1}
        value={currentLayer}
        onChange={handleSliderChange}
        className="w-full mb-4 mt-6"
        // style={{ color: "#ffffff" }}
      />
    </div>
  );
};

export default D2;
