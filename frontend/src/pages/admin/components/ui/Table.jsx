import React from "react";

export default function Table({ columns, data, renderRowActions }) {
  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-2 text-sm">
                {c.title}
              </th>
            ))}
            {renderRowActions && <th className="px-4 py-2">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderRowActions ? 1 : 0)} className="p-6 text-center text-sm text-gray-500">
                No records.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-t">
                {columns.map((c) => (
                  <td key={c.key} className="px-4 py-3 text-sm">
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
                {renderRowActions && (
                  <td className="px-4 py-3 text-sm">
                    {renderRowActions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
