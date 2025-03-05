import React, { useState } from "react";
import Uploading from "./Uploading";
import ReactDropzone from "./ReactDropzone";
import UploadedImage from "./UploadedImage";
import { useFileUpload } from "../../hooks/useFileUpload";

function MediaUploader({
  publicURL,
  filePath,
  setFilePath,
  setPublicUrl,
  dir,
}) {
  const { error, uploading, removing, handleFileChange, handleRemove } =
    useFileUpload({
      dir: dir || "",
      publicURL,
      filePath,
      setFilePath,
      setPublicUrl,
    });

  return (
    <>
      {!uploading && !publicURL && (
        <ReactDropzone handleFileChange={handleFileChange} />
      )}
      {uploading && <Uploading />}
      {!uploading && publicURL && (
        <UploadedImage
          removing={removing}
          handleRemove={handleRemove}
          images={[publicURL]}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}

export default MediaUploader;
