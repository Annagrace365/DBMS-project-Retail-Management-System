import React from "react";

export default function Card({ title, children }) {
  return (
    <div className="bg-white rounded shadow p-4">
      {title && <div className="text-sm font-medium mb-2">{title}</div>}
      <div>{children}</div>
    </div>
  );
}
