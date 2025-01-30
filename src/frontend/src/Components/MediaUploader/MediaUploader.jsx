import React from "react";
import Uploading from "./Uploading";
import ReactDropzone from "./ReactDropzone";
import UploadedImage from "./UploadedImage";
import { useFileUpload } from "../../hooks/useFileUpload";

function MediaUploader() {
  const {
    error,
    uploading,
    removing,
    handleFileChange,
    publicURL,
    handleRemove,
    filePath,
  } = useFileUpload();

  return (
    <>
      <div className="max-w-xl mt-6 border border-black rounded-md p-4 m-auto">
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
      </div>
    </>
  );
}

export default MediaUploader;
