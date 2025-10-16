"use client";
import { useEffect, useState } from "react";
import {
    buildKMap,
    qmSimplify,
    rpnToAST,
    tokenize,
    toRPN,
    generateVerilogModule,
    generateVerilogTestbench
} from "../lib/logic";

function buildRowsFromVars(vars) {
    const n = vars.length;
    const combos = 1 << n;
    const rows = [];
    for (let i = 0; i < combos; i++) {
        const assign = {};
        for (let b = 0; b < n; b++) assign[vars[n - 1 - b]] = ((i >> b) & 1);
        rows.push({ inputs: { ...assign }, out: 0, index: i });
    }
    return rows;
}

export default function TruthTableEditor({ initialVars = ['A', 'B'], initialRows = null, onChange }) {
    const [vars, setVars] = useState(initialVars);
    const [rows, setRows] = useState(initialRows || buildRowsFromVars(initialVars));

    useEffect(() => {
        // if initialRows changes externally, sync
        if (initialRows) setRows(initialRows);
    }, [initialRows]);

    useEffect(() => {
        // whenever rows change, compute derived artifacts and notify parent
        computeAndNotify();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rows, vars]);

    function toggleOutput(idx) {
        const next = rows.map((r, i) => i === idx ? { ...r, out: r.out ? 0 : 1 } : r);
        setRows(next);
    }

    function handleVarCountChange(e) {
        const c = parseInt(e.target.value, 10);
        if (!c || c < 1 || c > 5) return;
        const defaultNames = ['A', 'B', 'C', 'D', 'E'].slice(0, c);
        setVars(defaultNames);
        setRows(buildRowsFromVars(defaultNames));
    }

    function computeAndNotify() {
        try {
            const kmap = (vars.length >= 2 && vars.length <= 5) ? buildKMap(vars, rows) : null;
            const qm = qmSimplify(vars, rows);
            const expr = qm.simplified || '0';
            // produce rpn from simplified expression
            let rpn = [];
            try {
                rpn = toRPN(tokenize(expr));
            } catch (e) {
                // fallback: use simple literal
                rpn = toRPN(tokenize(expr));
            }
            const ast = rpnToAST(rpn);
            const verilog = generateVerilogModule('expr_module', vars, 'Y', expr);
            const tb = generateVerilogTestbench('expr_module', vars, 'Y', rows);
            if (onChange) onChange({ vars, rows, rpn, kmap, qm, ast, verilog, tb, simplifiedExpr: expr });
        } catch (e) {
            if (onChange) onChange({ error: e.message || String(e) });
        }
    }

    if (!vars || !rows) return null;

    return (
        <div style={{
            padding: '32px',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            borderRadius: '24px',
            border: '2px solid rgba(56, 189, 248, 0.2)',
            marginBottom: '32px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '28px' }}>🛠️</span>
                    <h3 style={{ fontWeight: 'bold', fontSize: '20px', color: '#38bdf8' }}>Editable Truth Table</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ color: '#94a3b8', fontSize: '14px' }}>Variables</label>
                    <select value={vars.length} onChange={handleVarCountChange} style={{ padding: '8px', borderRadius: '8px', background: '#0f172a', color: '#e2e8f0', border: '1px solid #334155' }}>
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                        <option value={5}>5</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto', borderRadius: '12px', border: '2px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f172a' }}>
                    <thead>
                        <tr style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
                            {vars.map(v => (
                                <th key={v} style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: '#cbd5e1' }}>{v}</th>
                            ))}
                            <th style={{ padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '700', color: '#38bdf8' }}>Y</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, idx) => (
                            <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#0f172a' : 'rgba(30,41,59,0.3)' }}>
                                {vars.map(v => (
                                    <td key={v} style={{ padding: '12px', textAlign: 'center' }}>
                                        <div style={{ fontFamily: 'monospace', fontWeight: '700', color: '#94a3b8' }}>{r.inputs[v]}</div>
                                    </td>
                                ))}
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                    <button onClick={() => toggleOutput(idx)} style={{ padding: '10px 14px', borderRadius: '10px', border: '2px solid', background: r.out ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.12)', color: r.out ? '#34d399' : '#f87171', fontWeight: '700' }}>
                                        {r.out}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '16px', color: '#94a3b8', fontSize: '13px' }}>Click an output cell to toggle Y. Changes update the K-Map, simplified expression, circuit and Verilog/testbench live.</div>
        </div>
    );
}
