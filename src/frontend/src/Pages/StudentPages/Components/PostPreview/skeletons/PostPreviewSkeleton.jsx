import React from "react";

export default function PostPreviewSkeleton() {
  return (
    <div className="m-auto  ">
      <div className="mx-4 border my-3 bg-white hover:bg-slate-50 rounded-xl p-4 pb-2 transition-all duration-200 shadow-md mb-6">
        {/* post top */}
        <div className="flex text-slate-200 items-center">
          <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse"></div>

          <div className="text-xs w-20 h-4 bg-slate-200 rounded-md animate-pulse font-semibold ml-2  transition-colors duration-150"></div>

          <div className="h-[4px] w-[4px] mx-2 rounded-full bg-slate-200 animate-pulse"></div>
          <div className="h-4 w-16 bg-slate-200 rounded-md animate-pulse"></div>
        </div>

        {/* post title */}

        <h1 className="my-2 w-40 h-5 rounded-md bg-slate-200 animate-pulse  text-lg text-slate-800 font-semibold leading-6"></h1>
        {/* postbody */}
        <div>
          <div className="h-4 mt-4 w-full bg-slate-200 rounded-md animate-pulse "></div>
          <div className="h-4 mt-2 w-96 bg-slate-200 rounded-md animate-pulse mb-1"></div>
        </div>

        {/* {isImage && <PostImage images={[postData?.image[0]?.imageUrl]} />} */}
        {/* <div className="w-full mt-3 my-1   bg-slate-200 animate-pulse h-20 rounded-2xl"></div> */}
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

        {/* <PostActionBar postId={postData?.postId} /> */}
        <div className="flex my-2 animate-pulse">
          {/* like button */}
          <div className="min-w-16 h-7  rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1  bg-slate-200"></div>
          <div className=" mx-3 min-w-16 h-7  rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1  bg-slate-200"></div>
          <div className="min-w-16 h-7  rounded-full flex  items-center justify-center py-0.5 pl-1 pr-3 mb-1 mt-1  bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
}
