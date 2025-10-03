"use client";
import { useState } from "react";
import {
  tokenize, toRPN, truthTableFromExpr, buildKMap, qmSimplify,
  rpnToAST, generateVerilogModule, generateVerilogTestbench
} from "../lib/logic";

export default function ExpressionInput({ expr, setExpr, setResult, setError }) {
  const [varsPreview, setVarsPreview] = useState([]);

  function previewVars(e) {
    const t = tokenize(e || "");
    const vs = [];
    for (const tk of t) if (/^[A-Za-z_]\w*$/.test(tk)) vs.push(tk);
    setVarsPreview(Array.from(new Set(vs)).sort());
  }

  async function handleGenerate() {
    setError(null);
    try {
      const data = truthTableFromExpr(expr.trim());
      const kmap = (data.vars.length >= 2 && data.vars.length <= 5) ? buildKMap(data.vars, data.rows) : null;
      const qm = qmSimplify(data.vars, data.rows);
      const ast = rpnToAST(data.rpn);
      const verilog = generateVerilogModule("expr_module", data.vars, "Y", expr);
      const tb = generateVerilogTestbench("expr_module", data.vars, "Y", data.rows);
      setResult({ vars: data.vars, rows: data.rows, rpn: data.rpn, kmap, qm, ast, verilog, tb });
    } catch (e) {
      setError(e.message || String(e));
      setResult(null);
    }
  }

  return (
    <div className="card p-4 bg-slate-800 rounded">
      <label className="block text-sm font-medium mb-2">Boolean expression (A..E)</label>
      <div className="flex gap-2">
        <input
          value={expr}
          onChange={(e)=>{ setExpr(e.target.value); previewVars(e.target.value); }}
          placeholder={`Example: (A & B) | (~C & D)`}
          className="flex-1 p-2 rounded bg-slate-900 border border-slate-700"
        />
        <button onClick={handleGenerate} className="px-4 py-2 bg-sky-400 text-slate-900 rounded font-semibold">Generate</button>
      </div>
      <div className="mt-2 text-xs text-slate-400">
        Preview variables: <span className="font-mono">{varsPreview.join(', ') || '—'}</span>
      </div>
      <div className="mt-2 text-xs text-slate-500">
        Syntax: <span className="font-mono">~ or !</span> = NOT, <span className="font-mono">& or .</span> = AND, <span className="font-mono">| or +</span> = OR, <span className="font-mono">^</span> = XOR. Parentheses allowed.
      </div>
    </div>
  );
}
