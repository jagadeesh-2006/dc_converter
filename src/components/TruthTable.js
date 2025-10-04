// export default function TruthTable({ vars, rows }) {
//   if (!vars || !rows) return null;

//   const getBoxStyle = (value, isOutput = false) => {
//     const baseStyle = {
//       display: 'inline-block',
//       width: '40px',
//       height: '40px',
//       lineHeight: '40px',
//       textAlign: 'center',
//       borderRadius: '8px',
//       fontFamily: 'monospace',
//       fontWeight: 'bold',
//       fontSize: '16px',
//       border: '2px solid'
//     };

//     if (isOutput) {
//       // Output column Y
//       if (value === 1) {
//         return {
//           ...baseStyle,
//           backgroundColor: 'rgba(16, 185, 129, 0.2)',
//           color: '#34d399',
//           borderColor: '#10b981',
//           boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
//         };
//       } else {
//         return {
//           ...baseStyle,
//           backgroundColor: 'rgba(239, 68, 68, 0.2)',
//           color: '#f87171',
//           borderColor: '#ef4444',
//           boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)'
//         };
//       }
//     } else {
//       // Input columns
//       if (value === 1) {
//         return {
//           ...baseStyle,
//           backgroundColor: 'rgba(59, 130, 246, 0.2)',
//           color: '#60a5fa',
//           borderColor: '#3b82f6',
//           boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)'
//         };
//       } else {
//         return {
//           ...baseStyle,
//           backgroundColor: '#1e293b',
//           color: '#94a3b8',
//           borderColor: '#475569'
//         };
//       }
//     }
//   };

//   return (
//     <div style={{
//       padding: '24px',
//       backgroundColor: '#0f172a',
//       borderRadius: '16px',
//       border: '1px solid #475569',
//       maxWidth: '1200px',
//       margin: '0 auto'
//     }}>
//       <h3 style={{
//         fontWeight: 'bold',
//         marginBottom: '24px',
//         fontSize: '24px',
//         color: '#38bdf8',
//         textAlign: 'center'
//       }}>
//         Truth Table
//       </h3>
      
//       <div style={{
//         overflowX: 'auto',
//         borderRadius: '12px',
//         border: '1px solid #475569'
//       }}>
//         <table style={{
//           width: '100%',
//           borderCollapse: 'collapse',
//           backgroundColor: '#0f172a'
//         }}>
//           <thead>
//             <tr style={{ backgroundColor: '#1e293b' }}>
//               {vars.map(v => (
//                 <th key={v} style={{
//                   padding: '16px',
//                   textAlign: 'center',
//                   fontSize: '14px',
//                   fontWeight: 'bold',
//                   color: '#cbd5e1',
//                   textTransform: 'uppercase',
//                   border: '1px solid #475569'
//                 }}>
//                   {v}
//                 </th>
//               ))}
//               <th style={{
//                 padding: '16px',
//                 textAlign: 'center',
//                 fontSize: '14px',
//                 fontWeight: 'bold',
//                 color: '#38bdf8',
//                 textTransform: 'uppercase',
//                 border: '1px solid #475569',
//                 backgroundColor: '#1e293b'
//               }}>
//                 Y
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r, idx) => (
//               <tr key={idx} style={{ backgroundColor: '#0f172a' }}>
//                 {vars.map(v => (
//                   <td key={v} style={{
//                     padding: '12px',
//                     textAlign: 'center',
//                     border: '1px solid #475569'
//                   }}>
//                     <span style={getBoxStyle(r.inputs[v], false)}>
//                       {r.inputs[v]}
//                     </span>
//                   </td>
//                 ))}
//                 <td style={{
//                   padding: '12px',
//                   textAlign: 'center',
//                   border: '1px solid #475569',
//                   backgroundColor: '#020617'
//                 }}>
//                   <span style={getBoxStyle(r.out, true)}>
//                     {r.out}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
      
//       <div style={{
//         marginTop: '16px',
//         textAlign: 'center',
//         fontSize: '12px',
//         color: '#64748b'
//       }}>
//         {rows.length} combinations • {rows.filter(r => r.out === 1).length} true outputs
//       </div>
//     </div>
//   );
// }

export default function TruthTable({ vars, rows }) {
  if (!vars || !rows) return null;

  const getBoxStyle = (value, isOutput = false) => {
    const baseStyle = {
      display: 'inline-block',
      width: '48px',
      height: '48px',
      lineHeight: '48px',
      textAlign: 'center',
      borderRadius: '12px',
      fontFamily: 'monospace',
      fontWeight: 'bold',
      fontSize: '18px',
      border: '2px solid',
      transition: 'all 0.2s ease'
    };

    if (isOutput) {
      // Output column Y
      if (value === 1) {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          color: '#34d399',
          borderColor: '#10b981',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        };
      } else {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          borderColor: '#ef4444',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        };
      }
    } else {
      // Input columns
      if (value === 1) {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(59, 130, 246, 0.15)',
          color: '#60a5fa',
          borderColor: '#3b82f6',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
        };
      } else {
        return {
          ...baseStyle,
          backgroundColor: 'rgba(30, 41, 59, 0.5)',
          color: '#94a3b8',
          borderColor: '#475569',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
        };
      }
    }
  };

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '24px',
      border: '2px solid rgba(56, 189, 248, 0.2)',
      maxWidth: '1200px',
      margin: '0 auto',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '32px'
      }}>
        <span style={{ fontSize: '28px' }}>📊</span>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '26px',
          color: '#38bdf8',
          letterSpacing: '0.5px'
        }}>
          Truth Table
        </h3>
      </div>
      
      <div style={{
        overflowX: 'auto',
        borderRadius: '16px',
        border: '2px solid #334155',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          backgroundColor: '#0f172a'
        }}>
          <thead>
            <tr style={{ 
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            }}>
              {vars.map(v => (
                <th key={v} style={{
                  padding: '20px',
                  textAlign: 'center',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  color: '#cbd5e1',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  borderRight: '1px solid #475569'
                }}>
                  {v}
                </th>
              ))}
              <th style={{
                padding: '20px',
                textAlign: 'center',
                fontSize: '15px',
                fontWeight: 'bold',
                color: '#38bdf8',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)'
              }}>
                Y
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr 
                key={idx} 
                style={{ 
                  backgroundColor: idx % 2 === 0 ? '#0f172a' : 'rgba(30, 41, 59, 0.3)',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#0f172a' : 'rgba(30, 41, 59, 0.3)';
                }}
              >
                {vars.map(v => (
                  <td key={v} style={{
                    padding: '16px',
                    textAlign: 'center',
                    borderRight: '1px solid #334155',
                    borderTop: '1px solid #334155'
                  }}>
                    <span style={getBoxStyle(r.inputs[v], false)}>
                      {r.inputs[v]}
                    </span>
                  </td>
                ))}
                <td style={{
                  padding: '16px',
                  textAlign: 'center',
                  borderTop: '1px solid #334155',
                  backgroundColor: 'rgba(2, 6, 23, 0.6)'
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
        marginTop: '24px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#64748b',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '12px',
        border: '1px solid #334155',
        display: 'flex',
        justifyContent: 'center',
        gap: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🔢</span>
          <span style={{ fontWeight: '600', color: '#94a3b8' }}>
            {rows.length} combinations
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>✅</span>
          <span style={{ fontWeight: '600', color: '#34d399' }}>
            {rows.filter(r => r.out === 1).length} true outputs
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>❌</span>
          <span style={{ fontWeight: '600', color: '#f87171' }}>
            {rows.filter(r => r.out === 0).length} false outputs
          </span>
        </div>
      </div>
    </div>
  );
}