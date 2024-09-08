import React from "react";

export default function ApiError({ error, isError }) {
  const errorClass = "text-red-600 ml-2 mt-1";

  return (
    <>
      {isError && (
        <p className={errorClass}>
          {error.response.data.message || error.message}
        </p>
      )}
    </>
  );
}
