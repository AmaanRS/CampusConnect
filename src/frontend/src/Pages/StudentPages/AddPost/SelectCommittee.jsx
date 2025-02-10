import React, { useEffect, useState } from "react";
import Select from "react-select";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useQuery } from "@tanstack/react-query";
import { PulseLoader } from "react-spinners";

// Function to fetch data
const fetchData = async () => {
  const response = await axiosInstance.post("/student/getAllStudentData", {}); // Pass an empty object if needed
  return response.data;
};

export default function SelectCommittee({ handleChange }) {
  const [options, setOptions] = useState([]);

  // Fetch data using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["committememberlist"], // Unique query key
    queryFn: fetchData, // Function to fetch data
  });

  useEffect(() => {
    if (data?.data?.committeePositions) {
      const temp = data.data.committeePositions.map((position) => ({
        value: position.committeeObjId.committeeId,
        label: position.committeeObjId.name,
      }));
      setOptions(temp);
    }
  }, [data]);

  if (isLoading)
    return (
      <p className="">
        <PulseLoader size={9} />
      </p>
    );
  if (isError) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <Select
      placeholder="Select Committee"
      styles={{
        input: (base) => ({
          ...base,
          "input:focus": {
            boxShadow: "none",
          },
          cursor: "text",
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
  );
}
