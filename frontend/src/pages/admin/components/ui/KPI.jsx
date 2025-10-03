import React from "react";

export default function KPI({ label, value, delta }) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {delta && <div className="text-sm text-green-600">{delta}</div>}
    </div>
  );
}
