import React from "react";

export default function DummyChart({ title = "Chart" }: { title?: string }) {
  return (
    <div className="w-full bg-white rounded-lg shadow p-4 mb-6">
      <div className="font-semibold mb-2">{title}</div>
      <div className="h-64 flex items-end justify-start bg-gray-50 p-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="w-full bg-blue-400"
            style={{ height: `${Math.random() * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
}
