import React from "react";

const Loading = () => {
  return (
    <div className="relative">
      <span className="absolute w-4 h-4 left-2 -top-1 transform translate-y-1/2 before:absolute before:w-full before:h-full before:border-2  before:border-dashed before:border-cyan-400 before:rounded-full before:animate-customSpin"></span>
    </div>
  );
};

export default Loading;
