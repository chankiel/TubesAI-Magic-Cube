import React from "react";
import D3 from "./3D";

const D3Render = ({ array }) => {
  return (
    <div className="w-full h-full">
      <D3 array={array} />
    </div>
  );
};

export default D3Render;
