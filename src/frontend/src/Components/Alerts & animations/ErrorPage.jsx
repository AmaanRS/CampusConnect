/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import ErrorImg from "../../assets/pics/404page.svg";

import { Link, useNavigate } from "react-router-dom";

function ErrorPage({ error }) {
  const navigate = useNavigate();
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate("/");
  //   }, 2000); // Redirect after 2 seconds

  //   return () => clearTimeout(timer); // Cleanup the timer on component unmount
  // }, [navigate]);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-blue-lightone gap-20">
      <img src={ErrorImg} alt="" className=" w-full md:w-1/3" />
      <h1 className="text-2xl md:text-4xl text-blue-dark font-semibold">
        {error}
      </h1>
      <h2 className="text-lg md:text-2xl text-blue-light">
        Go to{" "}
        <Link className="underline" to={"/"}>
          Home Page
        </Link>
      </h2>
    </div>
  );
}

export default ErrorPage;
