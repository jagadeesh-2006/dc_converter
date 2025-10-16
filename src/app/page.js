"use client";
import Link from "next/link";
import { useState } from "react";
import ExpressionInput from "../components/ExpressionInput";
import TruthTable from "../components/TruthTable";
import TruthTableEditor from "../components/TruthTableEditor";
import KMap from "../components/KMap";
import CircuitDiagram from "../components/CircuitDiagram";
import VerilogCode from "../components/VerilogCode";
import Testbench from "../components/Testbench";

export default function Home() {
  const [expr, setExpr] = useState("A & (B | ~C)");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('expr'); // 'expr' or 'tt'

  return (
    <main style={{
      minHeight: '120vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e0f2fe',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        <header style={{ marginBottom: '40px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', padding: '24px 36px', borderRadius: '20px', background: 'linear-gradient(135deg, rgba(30,41,59,0.8), rgba(15,23,42,0.9))', border: '2px solid rgba(56,189,248,0.18)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
              <span style={{ fontSize: '36px' }}>⚡</span>
              <h1 style={{ margin: 0, fontSize: '28px', background: 'linear-gradient(135deg,#38bdf8,#a78bfa)', WebkitBackgroundClip: 'text', color: 'transparent', fontWeight: '800' }}>Boolean Expression Converter</h1>
            </div>
            <div style={{ marginTop: '8px', color: '#94a3b8' }}>Transform logic expressions into truth tables, K-maps, and circuits</div>
          </div>
        </header>

        {/* Input Section */}
        <section style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <label style={{ color: '#94a3b8', fontWeight: '700' }}>Input Mode:</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', background: '#0f172a', color: '#e0f2fe', border: '1px solid #334155' }}>
              <option value="expr">Boolean Expression</option>
              <option value="tt">Editable Truth Table</option>
            </select>
          </div>

          {mode === 'expr' ? (
            <ExpressionInput expr={expr} setExpr={setExpr} setResult={setResult} setError={setError} />
          ) : (
            <TruthTableEditor initialVars={[...new Set((expr.match(/[A-Za-z_]\w*/g) || []).slice(0, 5))] || ['A', 'B']} initialRows={null} onChange={(data) => { if (data && data.error) { setError(data.error); setResult(null); } else { setError(null); setResult(data); } }} />
          )}
        </section>

        {/* Error */}
        {error && (
          <div style={{ marginTop: '12px', padding: '12px', background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(185,28,28,0.08))', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.2)', color: '#ffdada' }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div style={{ marginTop: '28px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <TruthTable vars={result.vars} rows={result.rows} />
              <div>
                <KMap kmap={result.kmap} />
                {/* Highlight simplified expression below the K-map */}
                {result.simplifiedExpr && (
                  <div style={{ marginTop: '12px', padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(20,20,40,0.6), rgba(10,10,20,0.6))', border: '1px solid rgba(167,139,250,0.12)' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Simplified Expression (from K-map)</div>
                    <div style={{ fontFamily: 'monospace', color: '#a78bfa', fontWeight: '800', fontSize: '16px' }}>{result.simplifiedExpr}</div>
                  </div>
                )}
              </div>
              <CircuitDiagram ast={result.ast} />
            </div>

            {/* Sidebar: inline Verilog & Testbench */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <VerilogCode moduleName="expr_module" verilog={result.verilog} />
              <Testbench moduleName="expr_module" vars={result.vars} rows={result.rows} tb={result.tb} />
            </aside>
          </div>
        )}

        <footer style={{ marginTop: '48px', padding: '18px', textAlign: 'center', borderRadius: '10px', color: '#64748b' }}>
          <div style={{ marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>📚 Supported Syntax</div>
          <div>Variables: <strong style={{ color: '#38bdf8' }}>A-E</strong> (max 5) • NOT: <strong style={{ color: '#38bdf8' }}>~</strong> • AND: <strong style={{ color: '#38bdf8' }}>&</strong> • OR: <strong style={{ color: '#38bdf8' }}>|</strong> • XOR: <strong style={{ color: '#38bdf8' }}>^</strong></div>
        </footer>
      </div>
    </main>
  );
}
