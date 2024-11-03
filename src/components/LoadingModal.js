import React from "react";

const LoadingModal = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center">
        <h2 className="text-xl font-bold mb-4">Loading...</h2>
        <p>Please wait while we process your request.</p>
        <div className="mt-4">
          <div className="loader"></div>{" "}
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
