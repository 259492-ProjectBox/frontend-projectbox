import React, { useState } from "react";

export const LimitedList = ({
  items,
  title,
}: {
  items: { name?: string; role?: string; id?: string }[];
  title: string;
}) => {
  const [seeMore, setSeeMore] = useState(false);
  const visibleItems = seeMore ? items : items.slice(0, 3);

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-2">{title}</h4>
      <div className="space-y-1">
        {visibleItems.map((item, index) => (
          <p key={index} className="text-xs text-gray-600">
            {item.name || "No Data"}
            {item.id && <span className="text-gray-400"> ({item.id})</span>}
            {item.role && <span className="text-gray-400"> ({item.role})</span>}
          </p>
        ))}
      </div>
      {items.length > 3 && (
        <button
          className="text-xs text-gray-500 hover:text-gray-700 mt-2"
          onClick={() => setSeeMore(!seeMore)}
        >
          {seeMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export const LimitedText = ({ text }: { text: string }) => {
  const [seeMore, setSeeMore] = useState(false);
  const isLongText = text.length > 150;

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-900 mb-2">Project Description</h4>
      <p className="text-xs text-gray-600 leading-relaxed">
        {isLongText && !seeMore ? `${text.slice(0, 150)}...` : text}
      </p>
      {isLongText && (
        <button
          className="text-xs text-gray-500 hover:text-gray-700 mt-2"
          onClick={() => setSeeMore(!seeMore)}
        >
          {seeMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
