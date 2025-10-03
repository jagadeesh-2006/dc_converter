// "use client";
// import { useState } from "react";
// import {
//   tokenize, toRPN, truthTableFromExpr, buildKMap, qmSimplify,
//   rpnToAST, generateVerilogModule, generateVerilogTestbench
// } from "../lib/logic";

// export default function ExpressionInput({ expr, setExpr, setResult, setError }) {
//   const [varsPreview, setVarsPreview] = useState([]);

//   function previewVars(e) {
//     const t = tokenize(e || "");
//     const vs = [];
//     for (const tk of t) if (/^[A-Za-z_]\w*$/.test(tk)) vs.push(tk);
//     setVarsPreview(Array.from(new Set(vs)).sort());
//   }

//   async function handleGenerate() {
//     setError(null);
//     try {
//       const data = truthTableFromExpr(expr.trim());
//       const kmap = (data.vars.length >= 2 && data.vars.length <= 5) ? buildKMap(data.vars, data.rows) : null;
//       const qm = qmSimplify(data.vars, data.rows);
//       const ast = rpnToAST(data.rpn);
//       const verilog = generateVerilogModule("expr_module", data.vars, "Y", expr);
//       const tb = generateVerilogTestbench("expr_module", data.vars, "Y", data.rows);
//       setResult({ vars: data.vars, rows: data.rows, rpn: data.rpn, kmap, qm, ast, verilog, tb });
//     } catch (e) {
//       setError(e.message || String(e));
//       setResult(null);
//     }
//   }

//   return (
//     <div className="card p-4 bg-slate-800 rounded">
//       <label className="block text-sm font-medium mb-2">Boolean expression (A..E)</label>
//       <div className="flex gap-2">
//         <input
//           value={expr}
//           onChange={(e)=>{ setExpr(e.target.value); previewVars(e.target.value); }}
//           placeholder={`Example: (A & B) | (~C & D)`}
//           className="flex-1 p-2 rounded bg-slate-900 border border-slate-700"
//         />
//         <button onClick={handleGenerate} className="px-4 py-2 bg-sky-400 text-slate-900 rounded font-semibold">Generate</button>
//       </div>
//       <div className="mt-2 text-xs text-slate-400">
//         Preview variables: <span className="font-mono">{varsPreview.join(', ') || '—'}</span>
//       </div>
//       <div className="mt-2 text-xs text-slate-500">
//         Syntax: <span className="font-mono">~ or !</span> = NOT, <span className="font-mono">& or .</span> = AND, <span className="font-mono">| or +</span> = OR, <span className="font-mono">^</span> = XOR. Parentheses allowed.
//       </div>
//     </div>
//   );
// }
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

  const containerStyle = {
    padding: '24px',
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid #475569',
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    color: '#cbd5e1',
    textTransform: 'uppercase'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#0f172a',
    border: '2px solid #475569',
    borderRadius: '12px',
    color: '#f1f5f9',
    fontFamily: 'monospace',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const buttonStyle = {
    padding: '12px 24px',
    backgroundColor: '#0ea5e9',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginLeft: '12px'
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>Boolean Expression</label>
      
      <div style={{ display: 'flex', marginBottom: '16px' }}>
        <input
          value={expr}
          onChange={(e) => {
            setExpr(e.target.value);
            previewVars(e.target.value);
          }}
          placeholder="(A & B) | (~C & D)"
          style={inputStyle}
        />
        <button onClick={handleGenerate} style={buttonStyle}>
          Generate
        </button>
      </div>
      
      <div style={{ padding: '12px', backgroundColor: '#0f172a', borderRadius: '8px', border: '1px solid #475569' }}>
        <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '8px' }}>Variables:</span>
        <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#38bdf8', fontWeight: '600' }}>
          {varsPreview.length > 0 ? varsPreview.join(', ') : '—'}
        </span>
      </div>
    </div>
  );
}
