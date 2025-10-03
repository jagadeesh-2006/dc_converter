"use client";
import { useState } from "react";
import ExpressionInput from "../components/ExpressionInput";
import TruthTable from "../components/TruthTable";
import KMap from "../components/KMap";
import CircuitDiagram from "../components/CircuitDiagram";
import VerilogCode from "../components/VerilogCode";
import Testbench from "../components/Testbench";

export default function Home() {
  const [expr, setExpr] = useState("A & (B | ~C)");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-sky-100">
      <div className="container mx-auto p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Boolean Expression Converter</h1>
          <p className="text-sm text-slate-400 mt-1">Expression → Truth Table → K-map → Circuit → Verilog + Testbench</p>
        </header>

        <ExpressionInput
          expr={expr}
          setExpr={setExpr}
          setResult={setResult}
          setError={setError}
        />

        {error && <div className="mt-4 p-3 bg-red-900 rounded text-red-200">{error}</div>}

        {result && (
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <TruthTable vars={result.vars} rows={result.rows} />
              <KMap kmap={result.kmap} />
              <CircuitDiagram ast={result.ast} />
            </div>

            <div className="space-y-6">
              <div className="card p-4 bg-slate-800 rounded">
                <h2 className="font-semibold mb-2">Simplified (QM SOP)</h2>
                <div className="font-mono text-sm text-sky-200">{result.qm.simplified}</div>
                <div className="text-xs text-slate-400 mt-2">Terms:</div>
                <ul className="list-disc list-inside text-sm">
                  {result.qm.terms.map((t,i)=> <li key={i} className="font-mono text-sm">{t}</li>)}
                </ul>
              </div>

              <VerilogCode moduleName="expr_module" outName="Y" vars={result.vars} expr={expr} verilog={result.verilog} />
              <Testbench moduleName="expr_module" outName="Y" vars={result.vars} rows={result.rows} tb={result.tb} />
            </div>
          </div>
        )}

        <footer className="mt-8 text-xs text-slate-500">
          Notes: Supports variables A..E (max 5). Syntax: `~` or `!` for NOT, `&` or `.` for AND, `|` or `+` for OR, `^` for XOR. Parentheses allowed.
        </footer>
      </div>
    </main>
  );
}
