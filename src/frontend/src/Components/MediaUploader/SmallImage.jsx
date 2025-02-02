import { Button } from "flowbite-react";
import React from "react";

export default function SmallImage({
  handleRemove,
  images,
  openImageViewer,
  removing,
}) {
  return (
    <div className="w-60 m-auto overflow-hidden">
      <div
        style={{
          backgroundImage: `url("${images[0]}")`,
        }}
        className="cursor-pointer border rounded-t-md  overflow-hidden  w-60  m-auto bg-cover bg-center "
      >
        <img
          className="h-full w-full rounded-t-md backdrop-blur-3xl max-h-60 object-contain"
          src={images[0]}
          onClick={() => openImageViewer()}
          width="300"
          alt=""
        />
      </div>
      <Button
        disabled={removing}
        onClick={handleRemove}
        fullSized
        color="failure"
        className="rounded-b-md rounded-t-none border-none"
      >
        {removing ? <p>Removing...</p> : <p>Remove</p>}
      </Button>
    </div>
  );
}
