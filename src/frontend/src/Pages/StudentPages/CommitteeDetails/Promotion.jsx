import { Button, Label } from "flowbite-react";
import React, { useContext, useState } from "react";
import MediaUploader from "../../../Components/MediaUploader/MediaUploader";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ApiError from "../../../Components/Errors/ApiError";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../store/UserContextProvider";

const postData = async (data) => {
  const response = await axiosInstance.post("/promotion/createPromotion", data);
  return response.data;
};

export default function Promotion({ committeeId }) {
  const [url, setUrl] = useState("");
  const [publicURL, setPublicUrl] = useState("");
  const [filePath, setFilePath] = useState("");
  const navigate = useNavigate();
  const {
    userState: { accountType },
  } = useContext(UserContext);

  const [error, setError] = useState("");

  // Use the mutation hook
  const mutation = useMutation({
    mutationFn: postData,
    onSuccess: (data) => {
      setPublicUrl("");
      setFilePath("");
      toast.success("Promotion posted successfully!");
      navigate(`/${accountType.toLowerCase()}`);

      // alert("Data posted successfully!");
    },
    onError: (error) => {
      console.error("Error posting data:", error);
      toast.error("Error adding promotion!");
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!url || !publicURL) {
      setError("Please fill all fileds ");
      return;
    }
    setError("");
    const data = {
      promotedBy: [committeeId],
      link: url,
      image: [{ imageUrl: publicURL, imagePath: filePath }],
    };
    console.log(data);
    mutation.mutate(data);
  }

  return (
    <div className="px-3">
      {/* add promotion form */}
      <form onSubmit={handleSubmit}>
        {/* url input */}
        <div className="mt-6 mb-6">
          <div className="mb-2 block">
            <Label
              className="my-2 text-lg font-semibold"
              htmlFor="url"
              value="URL"
            />
            <sup className="text-red-500 text-base">*</sup>
          </div>
          <input
            disabled={mutation.isPending}
            type="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError("");
            }}
            id="url"
            placeholder="Promotional URL"
            className=" appearance-none rounded-md block w-full border disabled:cursor-not-allowed disabled:opacity-50 border-gray-300  text-gray-900     p-4 sm:text-base"
          />
        </div>

        {/* image input */}
        <div className="mt-6">
          <p className="my-2  text-lg font-semibold">Upload Image</p>

          <MediaUploader
            filePath={filePath}
            publicURL={publicURL}
            setFilePath={setFilePath}
            setPublicUrl={setPublicUrl}
            dir={"promotions/"}
          />
        </div>

        {/* submit button */}
        <div className="text-center">
          <Button
            type="submit"
            disabled={mutation.isPending}
            color="blue"
            className=" inline-block text-center ml-auto mt-4"
          >
            Submit
          </Button>
        </div>

        {/* error display */}
        {error && <p className="text-center text-red-600 mt-2">{error}</p>}
        {mutation.isError && (
          <div className="text-center">
            <ApiError isError={mutation.isError} error={mutation.error} />
          </div>
        )}
      </form>
    </div>
  );
}
