import React from "react";

export default function PostDetailSkeleton() {
  return (
    <div className="m-auto ">
      <div className="mx-4 mb-10 animate-pulse m-auto">
        {/* postTop */}
        <>
          <div className="flex  text-neutral-800  h-8 00 items-center">
            <div className="h-8 w-8 mr-2 rounded-full bg-slate-200 "></div>
            <div className="h-8 w-8  rounded-full bg-slate-200 "></div>

            <div className="flex-col ml-2 ">
              <div className="flex h-4 items-center gap-1 ">
                <div className="h-3 w-20 bg-slate-200 rounded-md"></div>
                <div className="h-[0.25rem] w-[0.25rem]  rounded-full bg-slate-200"></div>
                <div className="bg-slate-200 rounded-md h-3 w-20"></div>
              </div>
              <div className="h-3 w-14 bg-slate-200 rounded-md"></div>
            </div>
          </div>
        </>
        {/* postTitle */}
        <>
          <div className="mt-3 h-6 mb-2 w-52 rounded-md bg-slate-200 "></div>
        </>
        {/* PostBody */}
        <>
          <div className="mt-4">
            <div className="w-full my-2 h-4 bg-slate-200 rounded-md "></div>
            <div className="w-full my-2 h-4 bg-slate-200 rounded-md "></div>
            <div className="w-full my-2 h-4 bg-slate-200 rounded-md "></div>
            <div className="w-1/2 my-1 h-4 bg-slate-200 rounded-md "></div>
          </div>
        </>
        {/* post Image */}
        <>
          <div className="flex items-center mt-3 rounded-2xl justify-center animate-pulse w-full h-60 bg-slate-200   ">
            <svg
              className="w-10 h-10 text-slate-300 animate-pulse"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 18"
            >
              <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
            </svg>
          </div>
        </>
        {/* post Action */}
        <>
          <div className="flex mt-4">
            {/* like button */}
            <div
              className={`min-w-16 h-7   rounded-full py-0.5 pl-1 pr-3 mb-1 mt-1 bg-slate-200`}
            ></div>
            <div
              className={`min-w-16 h-7 mx-3   rounded-full py-0.5 pl-1 pr-3 mb-1 mt-1 bg-slate-200`}
            ></div>
            <div
              className={`min-w-16 h-7   rounded-full py-0.5 pl-1 pr-3 mb-1 mt-1 bg-slate-200`}
            ></div>
          </div>
        </>

        {/* comments */}
        <>
          <div
            id="comment"
            className="border my-4 py-2.5 h-8 cursor-text px-4 rounded-3xl bg-slate-200    w-full"
          ></div>
        </>
      </div>
    </div>
  );
}
