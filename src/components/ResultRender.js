import React from "react";
import D2 from "./2D";
import D3 from "./3D";

const ResultRender = () => {
  const threeDArray = Array.from({ length: 5 }, (_, layerIndex) =>
    Array.from({ length: 5 }, (_, rowIndex) =>
      Array.from(
        { length: 5 },
        (_, cellIndex) => layerIndex * 25 + rowIndex * 5 + cellIndex + 1
      )
    )
  );

  return (
    <div className="p-4 w-screen h-screen">
      {/* <h1 className="text-2xl font-bold mb-4">3D Array Renderer</h1> */}
      <D2 array={threeDArray} />
      <D3 array={threeDArray} />
    </div>
  );
};

export default ResultRender;
