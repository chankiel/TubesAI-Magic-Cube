import React from "react";
import D2 from "./2D";

const D2Render = ({ array, idx1, idx2 }) => {
  return (
    <div className="w-full h-full">
      <D2 array={array} idx1={idx1} idx2={idx2} />
    </div>
  );
};

export default D2Render;
