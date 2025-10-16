export default function VerilogCode({ moduleName = "expr_module", outName = "Y", vars = [], expr, verilog = '' }) {
  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      borderRadius: '16px',
      border: '2px solid rgba(56, 189, 248, 0.12)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, color: '#7dd3fc', fontSize: '18px', fontWeight: '700' }}>Verilog Module</h3>
        <div style={{ fontSize: '13px', color: '#94a3b8' }}>{moduleName}.v</div>
      </div>

      <pre style={{ background: '#020617', padding: '12px', borderRadius: '10px', color: '#6ee7b7', fontFamily: 'monospace', fontSize: '13px', maxHeight: '260px', overflow: 'auto', border: '1px solid #334155' }}>{verilog}</pre>

      <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
        <button onClick={() => navigator.clipboard.writeText(verilog)} style={{ padding: '10px 16px', borderRadius: '10px', background: 'linear-gradient(135deg,#34d399 0%,#10b981 100%)', color: '#04281b', fontWeight: '700', border: 'none', cursor: 'pointer' }}>Copy Verilog</button>
      </div>
    </div>
  );
}

