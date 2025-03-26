import React, { useContext } from "react";
import "./post.scss";
import PostTop from "./PostTop";
import PostTitle from "./PostTitle";
import PostActionBar from "./PostActionBar";
import PostBody from "./PostBody";
import PostImage from "./PostImage";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../store/UserContextProvider";

export default function StudentPost({
  mode = "home",
  postData,
  isIncharge = false,
  committeeId = "",
}) {
  const {
    userState: { accountType },
  } = useContext(UserContext);
  let isImage = postData?.image?.length > 0;
  const navigate = useNavigate();
  return (
    <>
      <div className="mx-4 border my-3 bg-white hover:bg-gray-50 rounded-xl p-4 pb-2 transition-all duration-200 shadow-md mb-6">
        <PostTop
          postId={postData?.postId}
          isIncharge={isIncharge}
          mode={mode}
          committeeId={postData?.committeeObjId?.committeeId || committeeId}
          createdAt={postData?.createdAt}
          subname={postData?.committeeObjId?.name}
          username={postData?.postedBy?.email?.split(".")[0]}
        />
        <div
          className="cursor-pointer"
          onClick={() =>
            navigate(`/${accountType.toLowerCase()}/post/${postData?.postId}`)
          }
        >
          <PostTitle title={postData?.title} />
          <PostBody isImage={isImage} content={postData?.content} />
        </div>
        {isImage && <PostImage images={[postData?.image[0]?.imageUrl]} />}

        <PostActionBar
          comments={postData?.commentObjId.comments?.length}
          likes={postData?.likes}
          postId={postData?.postId}
        />
      </div>
      {/* <div className="border-b-[1.3px] mx-1 border-slate-200 mt-1 mb-1"></div> */}
    </>
  );
}
