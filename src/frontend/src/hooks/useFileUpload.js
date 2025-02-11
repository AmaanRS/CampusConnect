import { useEffect, useRef, useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/Axios/AxiosInstance";

const MAX_FILE_SIZE = 11 * 1024; // 11 KB in bytes

export function useFileUpload({
  dir,
  publicURL,
  filePath,
  setPublicUrl,
  setFilePath,
}) {
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);

  const filePathRef = useRef(filePath);
  const publicURLRef = useRef(publicURL);

  // Update the refs whenever filePath or publicURL changes
  useEffect(() => {
    filePathRef.current = filePath;
    publicURLRef.current = publicURL;
  }, [filePath, publicURL]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (publicURLRef.current) {
        const url = `https://campusconnect-wep1.onrender.com/images/delete/${encodeURIComponent(
          filePathRef.current
        )}`;
        const payload = JSON.stringify({ filePath: filePathRef.current });
        const headers = { "Content-Type": "application/json" };

        const blob = new Blob([payload], headers);
        navigator.sendBeacon(url, blob);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (publicURLRef.current && filePathRef.current) {
        axiosInstance.post(
          `https://campusconnect-wep1.onrender.com/images/delete/${encodeURIComponent(
            filePathRef.current
          )}`
        );
      }
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // Still empty so that the effect and cleanup run only once at mount/unmount

  async function handleFileChange(image) {
    setError("");
    if (image && image.size > MAX_FILE_SIZE) {
      setError("File size should not exceed 10 KB.");
      return;
    }

    const currFilePath = dir + `${Date.now()}_${image.name}`;
    const formData = new FormData();
    formData.append("image", image);
    formData.append("filePath", currFilePath);
    setUploading(true);

    try {
      const res = await axiosInstance.post(
        "https://campusconnect-wep1.onrender.com/images/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(res);
      setPublicUrl(res.data.data.publicURL);
      setFilePath(currFilePath);
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setUploading(false);
    }
  }

  async function handleRemove() {
    if (!filePath) {
      return alert("no image to delete");
    }
    setRemoving(true);
    try {
      const res = await axiosInstance.post(
        `https://campusconnect-wep1.onrender.com/images/delete/${encodeURIComponent(
          filePath
        )}`
      );
      setPublicUrl("");
      setFilePath("");
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setRemoving(false);
    }
  }

  return {
    uploading,
    removing,
    error,
    handleRemove,
    handleFileChange,
  };
}
