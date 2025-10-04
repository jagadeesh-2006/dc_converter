"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function VerilogPage() {
  const searchParams = useSearchParams();
  const moduleName = searchParams.get("moduleName") || "expr_module";
  const expr = searchParams.get("expr") || "";
  const initialVerilog = searchParams.get("verilog") || "";

  const [verilog, setVerilog] = useState(initialVerilog);

  return (
    <main className="min-h-screen bg-slate-900 text-sky-100 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Try Verilog Yourself</h1>
      <textarea
        className="w-full h-64 p-3 bg-black text-green-400 font-mono rounded resize-none"
        value={verilog}
        onChange={(e) => setVerilog(e.target.value)}
      />
      <div className="mt-3 flex justify-center gap-3">
        <button
          onClick={() => navigator.clipboard.writeText(verilog)}
          className="px-4 py-2 bg-green-500 rounded text-black font-semibold hover:bg-green-600"
        >
          Copy
        </button>
        <a
          className="px-4 py-2 bg-slate-700 rounded text-slate-200 hover:bg-slate-600"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(verilog)}`}
          download={`${moduleName}.v`}
        >
          Download
        </a>
      </div>
    </main>
  );
}
