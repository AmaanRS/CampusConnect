import React, { useCallback, useState } from "react";
import ImageViewer from "react-simple-image-viewer";
import SimpleImageWrapper from "../../../Components/ImageHelper/SimpleImageWrapper";

export default function PostImage({ images = [] }) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  // const images = [
  //   "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://plus.unsplash.com/premium_photo-1681530700755-e8079add58ef?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://plus.unsplash.com/premium_photo-1680582107403-04dfac02efc3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1531219572328-a0171b4448a3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //   "https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?q=80&w=1890&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // ];

  const openImageViewer = useCallback(() => {
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  let index = 0;

  return (
    <div
      style={{
        backgroundImage: `url(${images[index]})`,
      }}
      className="w-full my-1 cursor-pointer  bg-cover bg-center overflow-hidden  rounded-2xl"
    >
      <img
        className="rounded-2xl backdrop-blur-3xl   object-contain   w-full max-h-[400px] xl:max-h-[530px] "
        src={images[index]}
        alt="image"
        onClick={() => openImageViewer()}
      />
      {isViewerOpen && (
        <SimpleImageWrapper image={images[index]}>
          <ImageViewer
            backgroundStyle={{
              backgroundColor: "rgba(0, 0, 0,0)", // Dark with some transparency
              backdropFilter: "blur(64px)", // Apply blur effect to the backdrop
              cursor: "pointer",
            }}
            src={images}
            currentIndex={index}
            disableScroll={true}
            closeOnClickOutside={true}
            onClose={closeImageViewer}
          />
        </SimpleImageWrapper>
      )}
    </div>
  );
}
