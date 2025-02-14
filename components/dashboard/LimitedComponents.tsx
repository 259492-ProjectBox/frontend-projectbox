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
      <h4 className="font-bold text-primary_text">{title}</h4>
      {visibleItems.map((item, index) => (
        <p key={index} className="text-sm">
          {item.name || "No Data"} {item.id ? `(${item.id})` : ""} {item.role ? `(${item.role})` : ""}
        </p>
      ))}
      {items.length > 3 && (
        <p
          className="text-sm text-primary_text underline cursor-pointer mt-2"
          onClick={() => setSeeMore(!seeMore)}
        >
          {seeMore ? "See Less" : "See More"}
        </p>
      )}
    </div>
  );
};

export const LimitedText = ({ text }: { text: string }) => {
  const [seeMore, setSeeMore] = useState(false);
  const isLongText = text.length > 150;

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
      <h4 className="text-primary_text font-bold mb-2">Project Description</h4>
      <p className="text-gray-700 leading-relaxed">
        {isLongText && !seeMore ? `${text.slice(0, 150)}...` : text}
      </p>
      {isLongText && (
        <button
          className="text-sm text-primary_text underline cursor-pointer mt-2"
          onClick={() => setSeeMore(!seeMore)}
        >
          {seeMore ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};
