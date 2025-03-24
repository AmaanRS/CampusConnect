import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../../utils/Axios/AxiosInstance";
import { HashLoader } from "react-spinners";
import ApiError from "../../../../../Components/Errors/ApiError";
import { Button, Label } from "flowbite-react";
import TipTap from "../../../../../Components/RichTextEditor/TipTap";
import { toast } from "react-toastify";

const fetchData = async ({ postId }) => {
  const response = await axiosInstance.post(`/post/getPostById`, {
    postId,
  });
  return response.data;
};

const postData = async (data) => {
  const response = await axiosInstance.post("/post/updatePost", data);
  return response.data;
};

export default function PostUpdateForm() {
  const { postId } = useParams();
  const queryClient = useQueryClient();
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["post", postId], // Unique query key
    queryFn: () => fetchData({ postId }), // Function to fetch data
  });

  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      toast.success("Event Updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["post", postId],
      });
      navigate("/student");

      // alert("Data posted successfully!");
    },
    onError: (error) => {
      toast.error("Error Updating Post!");
    },
  });

  useEffect(() => {
    if (data) {
      setName(data?.data?.title);
      setDescription(data?.data?.content);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex text-blue-600 items-center justify-center h-96 ">
        <HashLoader color="#1c64f2" size={40} />
      </div>
    );
  }

  if (isError) {
    return <ApiError isError={isError} error={fetchError} />;
  }

  function getEditorContent(richText) {
    setError("");
    setDescription(richText);
  }

  function handleClear() {
    setName("");
    setError("");
    setDescription("");
  }

  function handleSubmit() {
    if (!name || !description) {
      setError("please fill all fields");
      return;
    }
    mutation.mutate({ title: name, content: description, postId });
  }

  return (
    <div className="ml-8 max-w-2xl">
      <h1 className="font-bold text-slate-800 text-2xl mb-8">Edit Post</h1>

      <form>
        {/* name input */}
        <div className="mb-8">
          <div className="mb-2 block">
            <Label
              htmlFor="name"
              className="my-2 text-lg font-semibold"
              value="Event Name"
            />
            <sup className="text-red-500 text-base">*</sup>
          </div>
          <input
            disabled={mutation.isPending}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
            id="name"
            placeholder="Event Name"
            className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900  focus:outline-1 focus:outline-blue-700  p-4 sm:text-base"
          />
        </div>

        {/* description */}
        <div>
          <p className="my-2  text-lg font-semibold">
            Description <sup className="text-red-500">*</sup>
          </p>
          {description && (
            <TipTap content={description} getEditorContent={getEditorContent} />
          )}
        </div>

        {/* submit button */}
        <div className="text-right">
          {/* <Button
            // disabled={mutation.isPending}
            onClick={handleClear}
            color="error"
            className=" inline-block text-center ml-auto mt-4 mr-4 bg-red-600  text-white hover:bg-red-700 "
          >
            clear
          </Button> */}

          <Button
            disabled={mutation.isPending}
            onClick={handleSubmit}
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
        </div>

        {/* error display */}
        {error != "" && (
          <p className="text-center mt-2 text-red-600">{error}</p>
        )}
        {mutation.isError && (
          <>
            <p className="text-center mt-2 text-red-600">
              {mutation.error.message}
            </p>
          </>
        )}
      </form>
    </div>
  );
}
