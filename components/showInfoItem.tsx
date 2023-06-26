import React from "react";

interface ShowInfoItemProps {
  title: string;
  content: string | JSX.Element;
}

const ShowInfoItem: React.FC<ShowInfoItemProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:h-20">
      <h3 className="text-black dark:text-white md:w-1/3">{title}</h3>
      <div className="flex flex-col md:w-2/3">
        <span className="text-gray-500 dark:text-gray-400">{content}</span>
      </div>
    </div>
  );
};

export default ShowInfoItem;
