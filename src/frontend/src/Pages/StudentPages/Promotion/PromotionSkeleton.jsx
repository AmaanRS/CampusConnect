import React from "react";

export default function PromotionSkeleton() {
  return (
    <div className="mx-4">
      <hr />
      <p className="text-xs font-medium text-gray-500 mt-0.5">Promotions</p>
      <div className=" h-96 ">
        <div className="w-full my-1  bg-cover bg-center overflow-hidden  rounded-2xl">
          <div
            className="rounded-2xl animate-pulse bg-slate-200  w-full h-96 "
            alt="image"
          ></div>
        </div>
      </div>
      <hr className="mt-1" />
    </div>
  );
}
