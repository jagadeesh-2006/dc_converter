

// export default function KMap({ kmap }) {
//   if (!kmap) return null;

//   const cellClass = v => v ? "bg-sky-600/30 font-bold text-green-400" : "bg-slate-800/40 text-slate-400";

//   const renderMap = m => (
//     <table className="border-collapse border border-slate-700 mx-auto">
//       <tbody>
//         {m.cells.map((row, ri) => (
//           <tr key={ri}>
//             {row.map((cell, ci) => (
//               <td key={ci} className={`w-16 h-16 border border-slate-700 text-center ${cell.val ? 'bg-green-600/40 font-bold' : 'bg-slate-800/30'}`}>
//                 <div className="text-sky-100 font-semibold">{cell.val}</div>
//                 <div className="text-xs text-slate-400 mt-1">
//                   {Object.keys(cell.assign).map(k => k + ':' + cell.assign[k]).join(' ')}
//                 </div>
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );

//   if (kmap.kind === 'kmap5') {
//     return (
//       <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-5xl">
//         <h3 className="font-semibold mb-4 text-lg text-sky-200 text-center">K-Map (5 variables split by {kmap.splitVar})</h3>
//         <div className="flex justify-center gap-6">
//           <div>
//             <div className="text-sm text-slate-300 mb-2 text-center">{kmap.splitVar} = 0</div>
//             {renderMap(kmap.map0)}
//           </div>
//           <div>
//             <div className="text-sm text-slate-300 mb-2 text-center">{kmap.splitVar} = 1</div>
//             {renderMap(kmap.map1)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-3xl">
//       <h3 className="font-semibold mb-4 text-lg text-sky-200 text-center">K-Map</h3>
//       {renderMap(kmap)}
//     </div>
//   );
// }

export default function KMap({ kmap }) {
  if (!kmap) return null;

  // Colors for different groups
  const groupColors = [
    { bg: 'rgba(59, 130, 246, 0.3)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.5)' },     // Blue
    { bg: 'rgba(168, 85, 247, 0.3)', border: '#a855f7', shadow: 'rgba(168, 85, 247, 0.5)' },     // Purple
    { bg: 'rgba(236, 72, 153, 0.3)', border: '#ec4899', shadow: 'rgba(236, 72, 153, 0.5)' },     // Pink
    { bg: 'rgba(251, 146, 60, 0.3)', border: '#fb923c', shadow: 'rgba(251, 146, 60, 0.5)' },     // Orange
    { bg: 'rgba(34, 197, 94, 0.3)', border: '#22c55e', shadow: 'rgba(34, 197, 94, 0.5)' },       // Green
    { bg: 'rgba(14, 165, 233, 0.3)', border: '#0ea5e9', shadow: 'rgba(14, 165, 233, 0.5)' },     // Cyan
    { bg: 'rgba(249, 115, 22, 0.3)', border: '#f97316', shadow: 'rgba(249, 115, 22, 0.5)' },     // Deep Orange
    { bg: 'rgba(139, 92, 246, 0.3)', border: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.5)' }      // Violet
  ];

  // Find groups of 1s (simplified grouping - just adjacent 1s)
  const findGroups = (cells) => {
    const groups = [];
    const visited = new Set();
    
    for (let i = 0; i < cells.length; i++) {
      for (let j = 0; j < cells[i].length; j++) {
        if (cells[i][j].val === 1 && !visited.has(`${i},${j}`)) {
          const group = [];
          const queue = [[i, j]];
          visited.add(`${i},${j}`);
          
          while (queue.length > 0) {
            const [r, c] = queue.shift();
            group.push([r, c]);
            
            // Check adjacent cells (including wrap-around for K-map)
            const neighbors = [
              [r, (c + 1) % cells[r].length],
              [r, (c - 1 + cells[r].length) % cells[r].length],
              [(r + 1) % cells.length, c],
              [(r - 1 + cells.length) % cells.length, c]
            ];
            
            for (const [nr, nc] of neighbors) {
              const key = `${nr},${nc}`;
              if (cells[nr][nc].val === 1 && !visited.has(key)) {
                visited.add(key);
                queue.push([nr, nc]);
              }
            }
          }
          
          if (group.length > 0) {
            groups.push(group);
          }
        }
      }
    }
    
    return groups;
  };

  const getCellStyle = (value, row, col, cells) => {
    const baseStyle = {
      padding: '12px',
      textAlign: 'center',
      border: '2px solid',
      minWidth: '80px',
      minHeight: '80px',
      position: 'relative'
    };

    if (value) {
      const groups = findGroups(cells);
      let groupIndex = -1;
      
      for (let g = 0; g < groups.length; g++) {
        if (groups[g].some(([r, c]) => r === row && c === col)) {
          groupIndex = g;
          break;
        }
      }
      
      const color = groupColors[groupIndex % groupColors.length];
      
      return {
        ...baseStyle,
        backgroundColor: color.bg,
        borderColor: color.border,
        boxShadow: `0 0 15px ${color.shadow}, inset 0 0 10px ${color.shadow}`
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        borderColor: '#475569'
      };
    }
  };

  const renderMap = (m) => {
    // Generate Gray code labels for rows and columns
    const getGrayLabels = (vars) => {
      const n = vars.length;
      const count = Math.pow(2, n);
      const labels = [];
      for (let i = 0; i < count; i++) {
        const gray = i ^ (i >> 1);
        let label = '';
        for (let b = n - 1; b >= 0; b--) {
          label += (gray >> b) & 1;
        }
        labels.push(label);
      }
      return labels;
    };

    const rowLabels = getGrayLabels(m.rowVars);
    const colLabels = getGrayLabels(m.colVars);

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          borderCollapse: 'collapse',
          margin: '0 auto',
          backgroundColor: '#0f172a',
          border: '2px solid #475569',
          borderRadius: '8px'
        }}>
          <thead>
            <tr>
              {/* Top-left corner cell with row/col variable labels */}
              <th style={{
                padding: '12px',
                backgroundColor: '#1e293b',
                border: '2px solid #475569',
                fontSize: '13px',
                color: '#94a3b8',
                minWidth: '80px'
              }}>
                <div style={{ marginBottom: '4px', color: '#38bdf8', fontWeight: 'bold' }}>
                  {m.rowVars.join('')}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#64748b' }}>╲</div>
                <div style={{ marginTop: '4px', color: '#a78bfa', fontWeight: 'bold' }}>
                  {m.colVars.join('')}
                </div>
              </th>
              {/* Column headers */}
              {colLabels.map((label, idx) => (
                <th key={idx} style={{
                  padding: '12px',
                  backgroundColor: '#1e293b',
                  border: '2px solid #475569',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#a78bfa',
                  minWidth: '80px',
                  fontFamily: 'monospace'
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.cells.map((row, ri) => (
              <tr key={ri}>
                {/* Row header */}
                <th style={{
                  padding: '12px',
                  backgroundColor: '#1e293b',
                  border: '2px solid #475569',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#38bdf8',
                  fontFamily: 'monospace'
                }}>
                  {rowLabels[ri]}
                </th>
                {/* Data cells */}
                {row.map((cell, ci) => (
                  <td key={ci} style={getCellStyle(cell.val, ri, ci, m.cells)}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: cell.val ? '#fff' : '#94a3b8',
                      textShadow: cell.val ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
                    }}>
                      {cell.val}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (kmap.kind === 'kmap5') {
    return (
      <div style={{
        padding: '24px',
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        border: '1px solid #475569',
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontWeight: 'bold',
          marginBottom: '24px',
          fontSize: '24px',
          color: '#38bdf8',
          textAlign: 'center'
        }}>
          K-Map (5 variables split by {kmap.splitVar})
        </h3>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#cbd5e1',
              marginBottom: '12px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {kmap.splitVar} = 0
            </div>
            {renderMap(kmap.map0)}
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#cbd5e1',
              marginBottom: '12px',
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {kmap.splitVar} = 1
            </div>
            {renderMap(kmap.map1)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '24px',
      backgroundColor: '#0f172a',
      borderRadius: '16px',
      border: '1px solid #475569',
      maxWidth: '800px',
      margin: '0 auto',
      marginBottom: '20px'
    }}>
      <h3 style={{
        fontWeight: 'bold',
        marginBottom: '24px',
        fontSize: '24px',
        color: '#38bdf8',
        textAlign: 'center'
      }}>
        K-Map
      </h3>
      {renderMap(kmap)}
    </div>
  );
}