/* eslint-disable no-unused-vars */
import React from "react";
import accCreatedImg from "../../utils/pics/accCreated.svg";

function AccCreated() {
  return (
    <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-5 rounded-3xl shadow-lg text-center flex flex-col items-center">
        <h2 className="text-xl font-semibold">Account Created Successfully!</h2>
        <img src={accCreatedImg} alt="" className="w-1/3 my-10 rounded-full" />
        <p className="mt-2">Redirecting to login page...</p>
      </div>
    </div>
  );
}

export default AccCreated;
