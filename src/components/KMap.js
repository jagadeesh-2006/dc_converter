// export default function KMap({ kmap }) {
//   if (!kmap) return null;

//   function cellClass(v) { return v ? "bg-sky-600/20 font-bold" : "opacity-40"; }

//   function renderMap(m) {
//     return (
//       <table className="border-collapse">
//         <tbody>
//           {m.cells.map((row, ri)=>(
//             <tr key={ri}>
//               {row.map((cell, ci)=>(
//                 <td key={ci} className={`w-14 h-14 border border-slate-700 text-center ${cell.val ? "bg-sky-700/20" : "bg-transparent"}`}>
//                   <div className="text-sky-100 font-semibold">{cell.val}</div>
//                   <div className="text-xs text-slate-400">{Object.keys(cell.assign).map(k=>k+':'+cell.assign[k]).join(' ')}</div>
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }

//   if (kmap.kind === 'kmap5') {
//     return (
//       <div className="card p-4 bg-slate-800 rounded">
//         <h3 className="font-semibold mb-3">K-Map (5 variables split by {kmap.splitVar})</h3>
//         <div className="flex gap-6">
//           <div>
//             <div className="text-sm text-slate-300 mb-2">{kmap.splitVar} = 0</div>
//             {renderMap(kmap.map0)}
//           </div>
//           <div>
//             <div className="text-sm text-slate-300 mb-2">{kmap.splitVar} = 1</div>
//             {renderMap(kmap.map1)}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="card p-4 bg-slate-800 rounded">
//       <h3 className="font-semibold mb-3">K-Map</h3>
//       {renderMap(kmap)}
//     </div>
//   );
// }

export default function KMap({ kmap }) {
  if (!kmap) return null;

  const cellClass = v => v ? "bg-sky-600/30 font-bold text-green-400" : "bg-slate-800/40 text-slate-400";

  const renderMap = m => (
    <table className="border-collapse border border-slate-700 mx-auto">
      <tbody>
        {m.cells.map((row, ri) => (
          <tr key={ri}>
            {row.map((cell, ci) => (
              <td key={ci} className={`w-16 h-16 border border-slate-700 text-center ${cell.val ? 'bg-green-600/40 font-bold' : 'bg-slate-800/30'}`}>
                <div className="text-sky-100 font-semibold">{cell.val}</div>
                <div className="text-xs text-slate-400 mt-1">
                  {Object.keys(cell.assign).map(k => k + ':' + cell.assign[k]).join(' ')}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (kmap.kind === 'kmap5') {
    return (
      <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-5xl">
        <h3 className="font-semibold mb-4 text-lg text-sky-200 text-center">K-Map (5 variables split by {kmap.splitVar})</h3>
        <div className="flex justify-center gap-6">
          <div>
            <div className="text-sm text-slate-300 mb-2 text-center">{kmap.splitVar} = 0</div>
            {renderMap(kmap.map0)}
          </div>
          <div>
            <div className="text-sm text-slate-300 mb-2 text-center">{kmap.splitVar} = 1</div>
            {renderMap(kmap.map1)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-3xl">
      <h3 className="font-semibold mb-4 text-lg text-sky-200 text-center">K-Map</h3>
      {renderMap(kmap)}
    </div>
  );
}

