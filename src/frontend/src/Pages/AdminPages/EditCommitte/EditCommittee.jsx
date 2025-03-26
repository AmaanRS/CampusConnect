import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PulseLoader } from "react-spinners";
import ApiError from "../../../Components/Errors/ApiError";
import { Button, Label, Textarea } from "flowbite-react";
import StudentSelect from "../CreateCommittee/slect/StudentSelect";
import TeacherSelect from "../CreateCommittee/slect/TeacherSelect";
import { toast } from "react-toastify";

const fetchData = async ({ committeeId }) => {
  const response = await axiosInstance.post(`/committee/getCommitteeById`, {
    committeeId,
  });
  return response.data;
};

const postData = async (data) => {
  const response = await axiosInstance.post("/updateCommitteeByAdmin", data);
  return response.data;
};

export default function EditCommittee() {
  const { committeeId } = useParams();
  const [desc, setDesc] = useState("");
  const [err, setErr] = useState("");
  const [studentIncharge, setStudentIncharge] = useState("");
  const [facultyIncharge, setFacultyIncharge] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["committee", committeeId], // Unique query key
    queryFn: () => fetchData({ committeeId }), // Function to fetch data
  });

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Committee Updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["committee", committeeId],
      });
      navigate("/admin");

      // alert("Data posted successfully!");
    },
    onError: (error) => {
      toast.error("Error Updating Committee!");
    },
  });

  useEffect(() => {
    if (data) {
      setDesc(data?.data?.description);
      setStudentIncharge(data?.data?.studentIncharge?.email);
      setFacultyIncharge(data?.data?.facultyIncharge?.email);
    }
  }, [data]);

  if (isLoading) {
    return (
      <>
        <div className="h-screen w-full flex items-center justify-center pb-32">
          <PulseLoader
            color="#1a56db"
            size={16}
            speedMultiplier={1}
            className="m-auto"
          />
        </div>
      </>
    );
  }

  if (isError) {
    console.error(fetchError);

    return <ApiError error={fetchError} isError={isError} />;
  }

  function handleStudentEmail(value) {
    setErr("");
    setStudentIncharge(value?.value);
  }

  function handleTeacherEmail(value) {
    setErr("");
    setFacultyIncharge(value?.value);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!desc || !studentIncharge || !facultyIncharge) {
      setErr("please fill all fields");
      return;
    }

    const dataObj = {
      committeeId,
      desc,
      newFacultyIncharge: facultyIncharge,
      newStudentIncharge: studentIncharge,
    };
    console.log(dataObj);
    mutation.mutate(dataObj);
  }

  return (
    <div className="ml-8 max-w-xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-8">Edit Committee</h1>

      <form onSubmit={handleSubmit}>
        {/* name input */}
        <div className="mb-6">
          <div className="mb-2 block">
            <Label
              htmlFor="Committee Name"
              className="my-2 text-lg font-semibold"
              value="Committee Name"
            />
            <sup className="text-red-500 text-base">*</sup>
          </div>
          <input
            required
            disabled
            value={data?.data?.name}
            // onChange={(e) => {
            //   setName(e.target.value);
            //   setError("");
            // }}
            id="Committee Name"
            placeholder="Committee Name"
            className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900  focus:outline-1 focus:outline-blue-700  p-4 sm:text-base"
          />
        </div>

        {/* description */}
        <div className="mb-6">
          <p className="my-2  text-lg font-semibold">
            Description <sup className="text-red-500">*</sup>
          </p>
          <Textarea
            disabled={mutation.isPending}
            value={desc}
            onChange={(e) => {
              setErr("");
              setDesc(e.target.value);
            }}
            color={" "}
            className="border-gray-300 bg-gray-50 text-gray-900"
            id="description"
            placeholder="write description about committee"
            required
            rows={5}
          />
        </div>

        {/* ------------student mail------------------------------- */}
        <div className="mb-6">
          <p className="my-2  text-lg font-semibold">
            Student Incharge Email <sup className="text-red-500">*</sup>
          </p>
          <StudentSelect
            key={studentIncharge}
            defaultValue={{ label: studentIncharge, value: studentIncharge }}
            handleStudentEmail={handleStudentEmail}
          />
        </div>

        {/* ----------teacher mail------------------------------ */}
        <div className="mb-6">
          <p className="my-2  text-lg font-semibold">
            Teacher Incharge Email <sup className="text-red-500">*</sup>
          </p>
          <TeacherSelect
            key={facultyIncharge}
            defaultValue={{ label: facultyIncharge, value: studentIncharge }}
            handleTeacherEmail={handleTeacherEmail}
          />
        </div>

        {/* submit button */}
        <div className="text-right">
          <Button
            disabled={mutation.isPending}
            type="submit"
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
        </div>

        {/* error display */}
        {err != "" && <p className="text-center mt-2 text-red-600">{err}</p>}
        {mutation.isError && (
          <>
            <div className="text-center mt-2 text-red-600">
              <ApiError isError={mutation.isError} error={mutation.error} />
            </div>
          </>
        )}
      </form>
    </div>
  );
}
