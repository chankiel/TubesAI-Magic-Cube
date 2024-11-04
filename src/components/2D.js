import React, { useState, useEffect } from "react";
import "./2D.css";

const D2 = ({ array, idx1, idx2, valAr }) => {
  const PlayIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      viewBox="0 0 16 16"
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
    >
      <path d="M5.5 0h-2a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5zM10.5 0h-2a.5.5 0 0 0-.5.5v15a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V.5a.5.5 0 0 0-.5-.5z" />
    </svg>
  );

  const [currentLayer, setCurrentLayer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1000); // Initial duration of 1000ms

  useEffect(() => {
    const slider = document.querySelector(".custom-slider");
    if (slider) {
      slider.style.setProperty("--position", currentLayer);
      slider.style.setProperty("--min", slider.min);
      slider.style.setProperty("--max", slider.max);
    }
  }, [currentLayer]);

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentLayer((prev) => (prev + 1) % array.length);
      }, duration);

      return () => clearInterval(interval);
    }
  }, [isPlaying, array.length, duration]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setCurrentLayer(value);
  };

  const handleDurationChange = (event) => {
    setDuration(parseInt(event.target.value));
  };

  const currentGrid = array[currentLayer];
  const chunks = [];
  for (let i = 0; i < 5; i++) {
    chunks.push(currentGrid.slice(i * 25, i * 25 + 25));
  }

  const curI1 = idx1[currentLayer];
  const curI2 = idx2[currentLayer];

  const curII1 = idx1[currentLayer - 1];
  const curII2 = idx2[currentLayer - 1];

  return (
    <div
      className="w-full h-full rounded-3xl p-4"
      style={{ backgroundColor: "black" }}
    >
      <div className="flex justify-center mb-4">
        <div className="text-white text-4xl font-bold">
          Step {currentLayer + 1}
        </div>
      </div>
      {valAr && (
        <div className="flex justify-center mb-4">
          <div className="text-white font-bold">
            Value: {valAr[currentLayer]}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-wrap sm:flex-row justify-center gap-4">
        {chunks.map((chunk, chunkIndex) => (
          <div
            key={chunkIndex}
            className="w-full sm:w-1/4 h-1/4 bg-blue-300 border-8 border-white rounded-3xl p-2"
          >
            <div className="text-center text-black font-bold mb-2">
              Layer {chunkIndex + 1}
            </div>
            <div className="w-full h-full grid grid-cols-5 gap-1 mb-2">
              {chunk.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center text-white rounded-lg h-10 w-full ${
                    chunkIndex * 25 + index === curI1 ||
                    chunkIndex * 25 + index === curI2
                      ? "bg-red-500"
                      : chunkIndex * 25 + index === curII1 ||
                        chunkIndex * 25 + index === curII2
                      ? "bg-green-500"
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

      <div className="flex items-center justify-center mt-4 mb-4 gap-4">
        <button
          onClick={togglePlayPause}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <label className="text-white font-semibold">
          Duration:
          <select
            value={duration}
            onChange={handleDurationChange}
            className="ml-2 p-2 rounded bg-gray-700 text-white"
          >
            <option value={10}>0.01s</option>
            <option value={100}>0.1s</option>
            <option value={500}>0.5s</option>
            <option value={1000}>1s</option>
            <option value={1500}>1.5s</option>
            <option value={2000}>2s</option>
            <option value={5000}>5s</option>
            <option value={10000}>10s</option>
          </select>
        </label>
      </div>

      <input
        type="range"
        min="0"
        max={array.length - 1}
        value={currentLayer}
        onChange={handleSliderChange}
        className="w-full mb-4 custom-slider"
      />
    </div>
  );
};

export default D2;
