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
    padding: '40px',
    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
    borderRadius: '24px',
    border: '2px solid rgba(56, 189, 248, 0.2)',
    marginBottom: '32px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#38bdf8',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  };

  const inputStyle = {
    width: '100%',
    padding: '18px 24px',
    backgroundColor: '#0f172a',
    border: '2px solid #334155',
    borderRadius: '16px',
    color: '#f1f5f9',
    fontFamily: 'monospace',
    fontSize: '16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
  };

  const buttonStyle = {
    padding: '18px 36px',
    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    marginLeft: '16px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
    minWidth: '140px'
  };

  const previewBoxStyle = {
    padding: '20px',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: '16px',
    border: '2px solid #334155',
    marginTop: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  };

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>⚡ Boolean Expression</label>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
        <input
          value={expr}
          onChange={(e) => {
            setExpr(e.target.value);
            previewVars(e.target.value);
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleGenerate();
          }}
          placeholder="(A & B) | (~C & D)"
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#0ea5e9';
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(14, 165, 233, 0.15)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#334155';
            e.target.style.boxShadow = 'inset 0 2px 4px rgba(0, 0, 0, 0.2)';
          }}
        />
        <button 
          onClick={handleGenerate} 
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.3)';
          }}
        >
          Generate
        </button>
      </div>
      
      <div style={previewBoxStyle}>
        <span style={{ 
          fontSize: '14px', 
          color: '#64748b', 
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Variables:
        </span>
        {varsPreview.length > 0 ? (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {varsPreview.map((v, i) => (
              <span 
                key={i}
                style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '16px', 
                  color: '#38bdf8', 
                  fontWeight: '700',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: '2px solid rgba(56, 189, 248, 0.3)'
                }}
              >
                {v}
              </span>
            ))}
          </div>
        ) : (
          <span style={{ 
            fontFamily: 'monospace', 
            fontSize: '16px', 
            color: '#475569',
            fontStyle: 'italic'
          }}>
            No variables detected
          </span>
        )}
      </div>
    </div>
  );
}