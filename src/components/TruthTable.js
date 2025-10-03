// export default function TruthTable({ vars, rows }) {
//   if (!vars || !rows) return null;
//   return (
//     <div className="card p-4 bg-slate-800 rounded">
//       <h3 className="font-semibold mb-3">Truth Table</h3>
//       <div className="overflow-auto">
//         <table className="min-w-full text-sm">
//           <thead>
//             <tr>
//               {vars.map(v => <th key={v} className="px-2 py-1 text-left text-slate-300">{v}</th>)}
//               <th className="px-2 py-1 text-left text-sky-200">Y</th>
//             </tr>
//           </thead>
//           <tbody>
//             {rows.map((r, idx) => (
//               <tr key={idx} className="border-t border-slate-700">
//                 {vars.map(v => <td key={v} className="px-2 py-1 font-mono text-slate-100">{r.inputs[v]}</td>)}
//                 <td className="px-2 py-1 font-mono text-sky-300 font-bold">{r.out}</td>
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

  return (
    <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-4xl">
      <h3 className="font-semibold mb-4 text-lg text-sky-200 text-center">Truth Table</h3>
      <div className="overflow-auto">
        <table className="min-w-full border border-slate-700 rounded text-sm mx-auto table-auto">
          <thead className="bg-slate-800">
            <tr>
              {vars.map(v => <th key={v} className="px-3 py-2 text-left text-slate-300 border-b border-slate-700">{v}</th>)}
              <th className="px-3 py-2 text-left text-sky-400 border-b border-slate-700">Y</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx} className="hover:bg-slate-800">
                {vars.map(v => <td key={v} className="px-3 py-1 font-mono text-slate-100 border-b border-slate-700">{r.inputs[v]}</td>)}
                <td className={`px-3 py-1 font-mono font-bold ${r.out ? 'text-green-400' : 'text-red-400'} border-b border-slate-700`}>{r.out}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
