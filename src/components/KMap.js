export default function KMap({ kmap }) {
  if (!kmap) return null;

  // Colors for different groups
  const groupColors = [
    { bg: 'rgba(59, 130, 246, 0.25)', border: '#3b82f6', shadow: 'rgba(59, 130, 246, 0.4)' },
    { bg: 'rgba(168, 85, 247, 0.25)', border: '#a855f7', shadow: 'rgba(168, 85, 247, 0.4)' },
    { bg: 'rgba(236, 72, 153, 0.25)', border: '#ec4899', shadow: 'rgba(236, 72, 153, 0.4)' },
    { bg: 'rgba(251, 146, 60, 0.25)', border: '#fb923c', shadow: 'rgba(251, 146, 60, 0.4)' },
    { bg: 'rgba(34, 197, 94, 0.25)', border: '#22c55e', shadow: 'rgba(34, 197, 94, 0.4)' },
    { bg: 'rgba(14, 165, 233, 0.25)', border: '#0ea5e9', shadow: 'rgba(14, 165, 233, 0.4)' },
    { bg: 'rgba(249, 115, 22, 0.25)', border: '#f97316', shadow: 'rgba(249, 115, 22, 0.4)' },
    { bg: 'rgba(139, 92, 246, 0.25)', border: '#8b5cf6', shadow: 'rgba(139, 92, 246, 0.4)' }
  ];

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
      padding: '16px',
      textAlign: 'center',
      border: '2px solid',
      minWidth: '90px',
      minHeight: '90px',
      position: 'relative',
      transition: 'all 0.2s ease'
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
        boxShadow: `0 0 20px ${color.shadow}, inset 0 0 15px ${color.shadow}`
      };
    } else {
      return {
        ...baseStyle,
        backgroundColor: 'rgba(30, 41, 59, 0.4)',
        borderColor: '#475569',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
      };
    }
  };

  const renderMap = (m) => {
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
      <div style={{ overflowX: 'auto', padding: '8px' }}>
        <table style={{
          borderCollapse: 'collapse',
          margin: '0 auto',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '2px solid #334155',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
        }}>
          <thead>
            <tr>
              <th style={{
                padding: '16px',
                background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                border: '2px solid #475569',
                fontSize: '13px',
                color: '#94a3b8',
                minWidth: '90px',
                borderTopLeftRadius: '14px'
              }}>
                <div style={{ marginBottom: '6px', color: '#38bdf8', fontWeight: 'bold', fontSize: '14px' }}>
                  {m.rowVars.join('')}
                </div>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#64748b' }}>╲</div>
                <div style={{ marginTop: '6px', color: '#a78bfa', fontWeight: 'bold', fontSize: '14px' }}>
                  {m.colVars.join('')}
                </div>
              </th>
              {colLabels.map((label, idx) => (
                <th key={idx} style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '2px solid #475569',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: '#a78bfa',
                  minWidth: '90px',
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                  borderTopRightRadius: idx === colLabels.length - 1 ? '14px' : '0'
                }}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {m.cells.map((row, ri) => (
              <tr key={ri}>
                <th style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                  border: '2px solid #475569',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: '#38bdf8',
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                  borderBottomLeftRadius: ri === m.cells.length - 1 ? '14px' : '0'
                }}>
                  {rowLabels[ri]}
                </th>
                {row.map((cell, ci) => (
                  <td 
                    key={ci} 
                    style={getCellStyle(cell.val, ri, ci, m.cells)}
                    onMouseEnter={(e) => {
                      if (cell.val) {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: cell.val ? '#fff' : '#94a3b8',
                      textShadow: cell.val ? '0 0 12px rgba(255,255,255,0.6)' : 'none'
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
        padding: '32px',
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        borderRadius: '24px',
        border: '2px solid rgba(56, 189, 248, 0.2)',
        maxWidth: '1400px',
        margin: '0 auto 24px auto',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <span style={{ fontSize: '28px' }}>🗺️</span>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '26px',
            color: '#38bdf8',
            letterSpacing: '0.5px'
          }}>
            K-Map (5 variables split by {kmap.splitVar})
          </h3>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '16px',
            border: '2px solid #334155'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#cbd5e1',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              {kmap.splitVar} = 0
            </div>
            {renderMap(kmap.map0)}
          </div>
          <div style={{
            padding: '20px',
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '16px',
            border: '2px solid #334155'
          }}>
            <div style={{
              fontSize: '16px',
              color: '#cbd5e1',
              marginBottom: '16px',
              textAlign: 'center',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px'
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
      padding: '32px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '24px',
      border: '2px solid rgba(56, 189, 248, 0.2)',
      maxWidth: '900px',
      margin: '0 auto 24px auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
        <span style={{ fontSize: '28px' }}>🗺️</span>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '26px',
          color: '#38bdf8',
          letterSpacing: '0.5px'
        }}>
          Karnaugh Map
        </h3>
      </div>
      {renderMap(kmap)}
    </div>
  );
}