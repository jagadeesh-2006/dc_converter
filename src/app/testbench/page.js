"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function TestbenchPage() {
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("moduleName") || "expr_module";
  const initialRows = JSON.parse(searchParams.get("rows") || "[]");
  const initialTb = searchParams.get("tb") || "";

  const [tb, setTb] = useState(initialTb);

  return (
    <main className="min-h-screen bg-slate-900 text-sky-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Try Testbench Yourself</h1>
      <textarea
        className="w-full h-64 p-3 bg-black text-yellow-400 font-mono rounded resize-none"
        value={tb}
        onChange={(e) => setTb(e.target.value)}
      />
      <div className="mt-3 flex justify-center gap-3">
        <button
          onClick={() => navigator.clipboard.writeText(tb)}
          className="px-4 py-2 bg-yellow-500 rounded text-black font-semibold hover:bg-yellow-600"
        >
          Copy
        </button>
        <a
          className="px-4 py-2 bg-slate-700 rounded text-slate-200 hover:bg-slate-600"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(tb)}`}
          download={`tb_${moduleName}.v`}
        >
          Download
        </a>
      </div>
    </main>
  );
}
