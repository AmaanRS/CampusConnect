/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ProgressBar = ({ currentStep, totalSteps }) => {
  const steps = ["Select Your Role", "Form Filling", "Profile Completed"];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-xl bg-blue-light bg-opacity-30 rounded-full h-2.5 mb-4">
        <div
          className={`bg-blue-dark h-2.5 rounded-full`}
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
      </div>
      <div className="w-full max-w-xl flex justify-between text-xs md:text-sm text-gray-700 tracking-tighter">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded-full font-bold ${
                currentStep >= index + 1
                  ? "bg-blue-dark text-white"
                  : "bg-blue-light text-white"
              }`}
            >
              {index + 1}
            </div>
            <span className="mt-1 text-center font-semibold text-blue-dark text-xs md:text-sm">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
