import { tokenize, toRPN, evalRPN, qmSimplify } from "../lib/logic";
import { useState } from "react";

export default function Testbench({ moduleName = "expr_module", outName = "Y", vars = [], rows = [], tb }) {
  const [simText, setSimText] = useState('');
  const [running, setRunning] = useState(false);

  function runSimulation() {
    setRunning(true);
    try {
      if (!rows || rows.length === 0) {
        setSimText('No rows to simulate');
        setRunning(false);
        return;
      }

      const sampleVars = vars.length ? vars : Object.keys(rows[0].inputs || {});
      // compute simplified expression from rows
      const qm = qmSimplify(sampleVars, rows);
      const expr = qm.simplified || '0';

      let rpn = [];
      try {
        rpn = toRPN(tokenize(expr));
      } catch (e) {
        rpn = [];
      }

      const lines = [];
      lines.push(`Using simplified expression: ${expr}`);
      lines.push('pattern expected actual');
      for (const r of rows) {
        const pattern = sampleVars.map(v => (r.inputs[v] ? '1' : '0')).join('');
        const expected = r.out ? '1' : '0';
        let actual = expected;
        try {
          if (rpn.length) {
            const val = evalRPN(rpn, r.inputs);
            actual = val ? '1' : '0';
          }
        } catch (e) {
          actual = '?';
        }
        lines.push(`${pattern}  ${expected}  ${actual}`);
      }
      setSimText(lines.join('\n'));
    } catch (e) {
      setSimText('Simulation error: ' + String(e));
    }
    setRunning(false);
  }

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '16px',
      border: '2px solid rgba(168, 85, 247, 0.08)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '18px', fontWeight: '700' }}>Verilog Testbench</h3>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>tb_{moduleName}.v</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Generated Testbench (Verilog)</div>
          <pre style={{ background: '#020617', padding: '12px', borderRadius: '10px', color: '#fcd34d', fontFamily: 'monospace', fontSize: '13px', maxHeight: '260px', overflow: 'auto', border: '1px solid #334155' }}>{tb}</pre>
          <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
            <button onClick={() => navigator.clipboard.writeText(tb)} style={{ padding: '8px 12px', borderRadius: '8px', background: 'linear-gradient(135deg,#f59e0b 0%,#d97706 100%)', color: '#2b1500', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Copy Testbench</button>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>Simulated Testbench Output</div>
            <div>
              <button onClick={runSimulation} disabled={running} style={{ marginRight: '8px', padding: '6px 10px', borderRadius: '8px', background: 'linear-gradient(135deg,#3b82f6 0%,#2563eb 100%)', color: 'white', fontWeight: '700', border: 'none', cursor: 'pointer' }}>{running ? 'Running...' : 'Run'}</button>
              <button onClick={() => navigator.clipboard.writeText(simText)} style={{ padding: '6px 10px', borderRadius: '8px', background: 'linear-gradient(135deg,#34d399 0%,#10b981 100%)', color: '#04281b', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Copy Simulation</button>
            </div>
          </div>
          <pre style={{ background: '#020617', padding: '12px', borderRadius: '10px', color: '#93c5fd', fontFamily: 'monospace', fontSize: '13px', maxHeight: '260px', overflow: 'auto', border: '1px solid #334155' }}>{simText || 'Click "Run" to simulate the testbench (this uses the simplified expression computed from the truth table).'}</pre>
        </div>
      </div>
    </div>
  );
}
