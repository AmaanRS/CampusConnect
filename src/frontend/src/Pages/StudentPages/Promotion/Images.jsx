import React from "react";
import { Link } from "react-router-dom";

export default function Images({ img, url = "https://www.google.com/" }) {
  return (
    <Link target="_blank" to={url}>
      <div
        style={{
          backgroundImage: `url(${img})`,
        }}
        className="w-full my-1  bg-cover bg-center overflow-hidden  rounded-2xl"
      >
        <img
          className="rounded-2xl backdrop-blur-3xl   object-contain  w-full h-96 "
          src={img}
          alt="image"
        />
      </div>
    </Link>
  );
}
