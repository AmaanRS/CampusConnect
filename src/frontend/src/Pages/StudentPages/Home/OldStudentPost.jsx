import React, { useState } from "react";
import { Card } from "flowbite-react";
import { FaThumbsUp, FaShare, FaComment } from "react-icons/fa";
import userImg from "../../../assets/Dummy/user.png";

export default function StudentPost({ data, email }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(0);
  const name = email.split(".")[0];
  const date = new Date(data.createdAt);
  const postDate = date.getDate();
  const postMonth = date.toLocaleString("default", { month: "long" });
  const postYear = date.getFullYear();
  const [content, rest] = data.content.split(":urlText:");
  const [urlText, url] = rest.split(":url:");

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLike = () => {
    setLikes(likes + 1);
  };

  return (
    <div className=" sm:max-w-xl mx-auto my-6 md:px-4">
      <Card className="shadow-lg rounded-xl p-5 bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out hover:shadow-2xl">
        {/* Header: Profile Picture, Name, Group, and Date */}
        <div className="flex items-center mb-4">
          <img
            src={userImg}
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300 dark:border-gray-600"
          />
          <div>
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {name}
            </h5>

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {postMonth + " " + postDate + " , " + postYear}
            </span>
          </div>
        </div>

        {/* Post Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          {data.title}
        </h3>

        {/* Content Section */}
        <div>
          <p
            className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${
              isExpanded ? "" : "line-clamp-5"
            }`}
          >
            {content}
          </p>
          <button
            onClick={toggleContent}
            className="text-blue-600 dark:text-blue-400 hover:underline mt-2 transition duration-150"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>

          {/* Additional Section with Link */}
          {url && (
            <div className="mt-0 pt-4  border-gray-200 ">
              <a
                target="_blank"
                href={url} // replace with your form URL
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm transition duration-150"
              >
                {urlText}
              </a>
            </div>
          )}
        </div>

        {/* Actions: Like, Comment, Share */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-8">
            <button
              onClick={handleLike}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-150"
            >
              <FaThumbsUp className="text-lg" />
              <span className="text-sm">{likes} Likes</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-150">
              <FaComment className="text-lg" />
              <span className="text-sm">Comment</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-150">
              <FaShare className="text-lg" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
