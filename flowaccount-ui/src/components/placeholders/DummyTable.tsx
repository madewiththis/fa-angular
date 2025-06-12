import React from "react";

export default function DummyTable({ title = "Table" }: { title?: string }) {
  return (
    <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
      <div className="font-semibold mb-2">{title}</div>
      <table className="w-full text-left text-sm text-gray-600">
        <thead>
          <tr className="bg-gray-50">
            <th className="py-2 px-3">ID</th>
            <th className="py-2 px-3">Name</th>
            <th className="py-2 px-3">Date</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(10)].map((_, i) => (
            <tr className="border-t" key={i}>
              <td className="py-2 px-3">#00{i + 1}</td>
              <td className="py-2 px-3">Lorem Ipsum</td>
              <td className="py-2 px-3">2023-10-2{i + 1}</td>
              <td className="py-2 px-3">
                ${(Math.random() * 1000).toFixed(2)}
              </td>
              <td className="py-2 px-3">
                <span className="bg-green-200 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">
                  Completed
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
