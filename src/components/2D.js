import React from "react";

const D2 = ({ array }) => {
  // Ensure the input is a 5x5x5 array
  if (
    !Array.isArray(array) ||
    array.length !== 5 ||
    !array.every(
      (layer) => layer.length === 5 && layer.every((row) => row.length === 5)
    )
  ) {
    return (
      <div className="text-red-500">
        Invalid array. Please provide a 5x5x5 array.
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row space-y-6 my-16 w-screen">
      {/* Map over each row and column, treating depth as the final dimension */}
      {Array.from({ length: 5 }, (_, rowIndex) => (
        <div
          key={rowIndex}
          className="border rounded-lg shadow-lg p-4 bg-white mr-8 lg:mr-0 mx-2 mt-6"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Layer {rowIndex + 1}
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {/* Map through each column in this row */}
            {Array.from({ length: 5 }, (_, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="flex flex-col">
                {/* For each depth layer (front to back), get the cell value */}
                {array.map((layer, depthIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}-${depthIndex}`}
                    className="border border-gray-400 p-2 text-center flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors my-2"
                  >
                    {array[depthIndex][rowIndex][colIndex]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default D2;
