import React from "react";
import { Button, Label, Textarea, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../../utils/Axios/AxiosInstance";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import ApiError from "../../../Components/Errors/ApiError";

export default function CreatePost() {
  const errorClass = "text-red-600 ml-2 mt-1";
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: ({ data }) => axiosInstance.post("/post/createPost", data),
    onSuccess: (data) => {
      console.log(data);
      toast.success("created successfully");
      navigate("/teacher");
    },
    onError: (error) => {
      console.log(error);
      toast.error("failed to create");
    },
  });

  const schema = yup.object().shape({
    title: yup.string().required("name is required"),
    content: yup
      .string()
      .min(5, "should atleast have 5 characters")
      .required("description is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const inputTheme = {
    field: {
      input: {
        colors: {
          gray: "border-gray-300 bg-gray-50 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500",
        },
      },
    },
  };

  function onSubmit(data) {
    data.content =
      data.content + ":urlText:" + data.urlText + ":url:" + data.url;
    let [text, utext] = data.content.split(":urlText:");
    let [ut, u] = utext.split(":url:");
    console.log(data);
    mutation.mutate({ data });
  }

  return (
    <>
      <div className="my-4  mx-6 lg:mx-10">
        <h1 className="mb-4 text-2xl font-semibold">Add a New Post</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" flex  max-w-lg flex-col gap-4"
        >
          <div>
            <div className="mb-2 block">
              <Label htmlFor="committee-name" value="Committee name" />
            </div>
            <TextInput
              theme={inputTheme}
              id="committee-name"
              type="text"
              placeholder="committee"
              required
              {...register("title")}
            />
            {errors.name && (
              <p className={errorClass}> {errors.name.message} </p>
            )}
          </div>
          <div className="max-w-lg">
            <div className="mb-2 block">
              <Label htmlFor="description" value="Description" />
            </div>
            <Textarea
              color={" "}
              className="border-gray-300 bg-gray-50 text-gray-900"
              id="description"
              placeholder="write description about committee"
              required
              rows={5}
              {...register("content")}
            />
            {errors.description && (
              <p className={errorClass}> {errors.description.message} </p>
            )}
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="committee-name" value="URL Text (optional)" />
            </div>
            <TextInput
              theme={inputTheme}
              id="committee-name"
              type="text"
              placeholder="URL Text"
              required
              {...register("urlText")}
            />
          </div>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="committee-name" value="URL  (optional)" />
            </div>
            <TextInput
              theme={inputTheme}
              id="committee-name"
              type="text"
              placeholder="url"
              required
              {...register("url")}
            />
          </div>

          <Button
            disabled={mutation.isPending}
            color={""}
            className="bg-blue-medium hover:bg-blue-dark active:bg-blue-dark text-white"
            type="submit"
          >
            {mutation.isPending ? "Submitting" : "Submit"}
          </Button>
          <ApiError error={mutation.error} isError={mutation.isError} />
        </form>
      </div>
    </>
  );
}
