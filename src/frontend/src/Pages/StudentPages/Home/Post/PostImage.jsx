import React, { useCallback, useState } from "react";
import ImageViewer from "react-simple-image-viewer";

export default function PostImage() {
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const images = [
    "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1888&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1681530700755-e8079add58ef?q=80&w=1930&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1680582107403-04dfac02efc3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const openImageViewer = useCallback(() => {
    setIsViewerOpen(true);
  }, []);

  const closeImageViewer = () => {
    setIsViewerOpen(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${images[1]})`,
      }}
      className="w-full my-1  bg-cover bg-center  rounded-2xl"
    >
      <img
        className="rounded-2xl backdrop-blur-3xl   object-contain   w-full max-h-96"
        src={images[1]}
        alt="image"
        onClick={() => openImageViewer()}
      />
      {isViewerOpen && (
        <ImageViewer
          backgroundStyle={{
            backgroundColor: "rgba(0, 0, 0, 0.8)", // Dark with some transparency
            backdropFilter: "blur(10px)", // Apply blur effect to the backdrop
            cursor: "pointer",
            zIndex: 51,
          }}
          src={images}
          currentIndex={0}
          disableScroll={true}
          closeOnClickOutside={true}
          onClose={closeImageViewer}
        />
      )}
    </div>
  );
}
