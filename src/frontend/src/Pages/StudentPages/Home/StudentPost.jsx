import React, { useState } from "react";
import { Card } from "flowbite-react";
import { FaThumbsUp, FaShare, FaComment } from "react-icons/fa";

export default function SocialMediaPost() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setLikes] = useState(0);

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
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="w-12 h-12 rounded-full mr-4 border-2 border-gray-300 dark:border-gray-600"
          />
          <div>
            <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              John Doe
            </h5>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Posted in{" "}
              <span className="font-semibold">Tech Enthusiasts Group</span>
            </p>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              October 27, 2024
            </span>
          </div>
        </div>

        {/* Post Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Exciting New Discoveries in Tech
        </h3>

        {/* Content Section */}
        <div>
          <p
            className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${
              isExpanded ? "" : "line-clamp-5"
            }`}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
            eget vehicula nibh. Nullam mattis diam a ante imperdiet fringilla et
            eu odio. Ut lobortis risus non augue pellentesque eleifend. Quisque
            leo augue, porta id hendrerit nec, tincidunt a nunc. Sed accumsan
            tincidunt dolor. Nunc pharetra pulvinar magna. Pellentesque rutrum
            magna sit amet odio gravida lacinia. Pellentesque rutrum vulputate
            placerat. Vivamus lorem orci, volutpat nec sem eget, lacinia posuere
            enim. Nulla facilisi. Vestibulum augue lectus, efficitur vel metus
            sodales, auctor congue tortor. Pellentesque pulvinar feugiat augue
            ut mattis.
          </p>
          <button
            onClick={toggleContent}
            className="text-blue-600 dark:text-blue-400 hover:underline mt-2 transition duration-150"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>

          {/* Additional Section with Link */}
          <div className="mt-0 pt-4  border-gray-200 ">
            <a
              href="/form-url" // replace with your form URL
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm transition duration-150"
            >
              Fill out our quick feedback form!
            </a>
          </div>
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
