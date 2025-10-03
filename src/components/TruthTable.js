// export default function TruthTable({ vars, rows }) {
//   if (!vars || !rows) return null;

//   return (
//     <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-4xl">
//       <h3 className="font-semibold mb-4 text-lg text-sky-200 text-center">Truth Table</h3>
//       <div className="overflow-auto">
//         <table className="min-w-full border border-slate-700 rounded text-sm mx-auto table-auto">
//           <thead className="bg-slate-800">
//             <tr>
//               {vars.map(v => <th key={v} className="px-3 py-2 text-left text-slate-300 border-b border-slate-700">{v}</th>)}
//               <th className="px-3 py-2 text-left text-sky-400 border-b border-slate-700">Y</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r, idx) =>   (
//               <tr key={idx} className="hover:bg-slate-800">
//                 {vars.map(v => <td key={v} className="px-3 py-1 font-mono text-slate-100 border-b border-slate-700">{r.inputs[v]}</td>)}
//                 <td className={`px-3 py-1 font-mono font-bold ${r.out ? 'text-green-400' : 'text-red-400'} border-b border-slate-700`}>{r.out}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
export default function TruthTable({ vars, rows }) {
  if (!vars || !rows) return null;

  const getBoxStyle = (value, isOutput = false) => {
    const baseStyle = {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      lineHeight: '40px',
      textAlign: 'center',
      borderRadius: '8px',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      fontSize: '16px',
      border: '2px solid'
    };

    if (isOutput) {
      // Output column Y
      if (value === 1) {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: '#34d399',
          borderColor: '#10b981',
          boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
        };
      } else {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          color: '#f87171',
          borderColor: '#ef4444',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
        };
      }
    } else {
      // Input columns
      if (value === 1) {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: '#60a5fa',
          borderColor: '#3b82f6',
          boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
        };
      } else {
        return {
          ...baseStyle,
          backgroundColor: '#1e293b',
          color: '#94a3b8',
          borderColor: '#475569'
        };
      }
    }
  };

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      border: '1px solid #475569',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h3 style={{
        fontWeight: 'bold',
        marginBottom: '24px',
        fontSize: '24px',
        color: '#38bdf8',
        textAlign: 'center'
      }}>
        Truth Table
      </h3>
      
      <div style={{
        overflowX: 'auto',
        borderRadius: '12px',
        border: '1px solid #475569'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#0f172a'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#1e293b' }}>
              {vars.map(v => (
                <th key={v} style={{
                  padding: '16px',
                  textAlign: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#cbd5e1',
                  textTransform: 'uppercase',
                  border: '1px solid #475569'
                }}>
                  {v}
                </th>
              ))}
              <th style={{
                padding: '16px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#38bdf8',
                textTransform: 'uppercase',
                border: '1px solid #475569',
                backgroundColor: '#1e293b'
              }}>
                Y
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} style={{ backgroundColor: '#0f172a' }}>
                {vars.map(v => (
                  <td key={v} style={{
                    padding: '12px',
                    textAlign: 'center',
                    border: '1px solid #475569'
                  }}>
                    <span style={getBoxStyle(r.inputs[v], false)}>
                      {r.inputs[v]}
                    </span>
                  </td>
                ))}
                <td style={{
                  padding: '12px',
                  textAlign: 'center',
                  border: '1px solid #475569',
                  backgroundColor: '#020617'
                }}>
                  <span style={getBoxStyle(r.out, true)}>
                    {r.out}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{
        marginTop: '16px',
        textAlign: 'center',
        fontSize: '12px',
        color: '#64748b'
      }}>
        {rows.length} combinations • {rows.filter(r => r.out === 1).length} true outputs
      </div>
    </div>
  );
}