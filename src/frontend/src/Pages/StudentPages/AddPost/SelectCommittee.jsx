import React, { useState } from "react";
import Select from "react-select";

export default function SelectCommittee() {
  const options = [
    { label: "committee one", value: 1 },
    { label: "committee two", value: 2 },
    { label: "committee three", value: 3 },
    { label: "committee four", value: 4 },
    { label: "committee five", value: 5 },
  ];

  function handleChange(e) {
    console.log(e);
  }
  return (
    <>
      <Select
        placeholder="Select Committee"
        styles={{
          input: (base) => ({
            ...base,
            "input:focus": {
              boxShadow: "none",
            },
          }),
          valueContainer: (base) => ({
            ...base,
            padding: "8px",
          }),
        }}
        defaultValue={""}
        isClearable
        isSearchable
        options={options}
        onChange={handleChange}
      />
    </>
  );
}
