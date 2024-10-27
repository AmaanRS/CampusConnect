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
    <div className="md:max-w-xl mx-auto my-2 md:my-6">
      <Card href="#" className="shadow-lg rounded-lg p-4">
        {/* Header: Profile Picture, Name, and Date */}
        <div className="flex items-center mb-4">
          <img
            src="https://via.placeholder.com/50"
            alt="Profile"
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <h5 className="text-lg font-semibold text-gray-900 dark:text-white">
              John Doe
            </h5>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Posted on October 27, 2024
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div>
          <p
            className={`font-normal text-gray-700 dark:text-gray-400 ${
              isExpanded ? "" : "line-clamp-6"
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
            className="text-blue-600 hover:underline mt-2"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        </div>

        {/* Actions: Like, Comment, Share */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-6">
            <button
              onClick={handleLike}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
            >
              <FaThumbsUp />
              <span>{likes} Likes</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
              <FaComment />
              <span>Comment</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500">
              <FaShare />
              <span>Share</span>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
