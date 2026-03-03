// src/UI/ChatIconWithBadge.jsx
import React from "react";

const Badge = ({ count }) => {
  if (!count || count <= 0) return null;

  return (
    <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px] min-h-[20px]">
      {count > 99 ? "99+" : count}
    </span>
  );
};

const ChatIconWithBadge = ({ count, onClick }) => {
  return (
    <div className="relative inline-block cursor-pointer" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 8h10M7 12h8m-5 8h6a2 2 0 002-2V8a2 2 0 00-2-2H7a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>

      {count > 0 && (
        <div className="absolute top-0 right-0 -translate-x-1/2 -translate-y-1/2">
          <Badge count={count} />
        </div>
      )}
    </div>
  );
};

export default ChatIconWithBadge;
