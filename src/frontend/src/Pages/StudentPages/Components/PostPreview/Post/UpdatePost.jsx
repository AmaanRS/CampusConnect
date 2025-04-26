import { Popover } from "flowbite-react";
import React, { useContext } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import DeletePost from "./DeletePost";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../store/UserContextProvider";

export default function UpdatePost({ postId, committeeId }) {
  return (
    <div className="ml-4">
      <Popover content={<PopMenu postId={postId} committeeId={committeeId} />}>
        <button className="rounded-full hover:bg-slate-200 p-2">
          <BsThreeDotsVertical />{" "}
        </button>
      </Popover>
    </div>
  );
}

function PopMenu({ postId, committeeId }) {
  const {
    userState: { accountType },
  } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <>
      <div className="shadow-2xl ">
        <div>
          <button
            onClick={() =>
              navigate(`/${accountType.toLowerCase()}/edit/post/${postId}`)
            }
            className="w-full  flex items-center justify-start text-left py-2 px-5 hover:bg-slate-100"
          >
            <MdEdit className="mr-2 text-lg" />
            <span className="font-medium">Edit</span>
          </button>
        </div>
        <div>
          <DeletePost committeeId={committeeId} postId={postId} />
        </div>
      </div>
    </>
  );
}
