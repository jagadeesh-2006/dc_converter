// export default function Testbench({ moduleName="expr_module", outName="Y", vars=[], rows=[], tb }) {
//   return (
//     <div className="card p-4 bg-slate-800 rounded">
//       <h3 className="font-semibold mb-2">Verilog Testbench</h3>
//       <pre className="bg-black p-3 rounded text-xs text-yellow-300 overflow-auto">{tb}</pre>
//       <div className="mt-2 flex gap-2">
//         <button onClick={() => navigator.clipboard.writeText(tb)} className="px-3 py-1 bg-sky-500 rounded text-slate-900">Copy</button>
//         <a
//           className="px-3 py-1 bg-slate-700 rounded text-slate-200"
//           href={`data:text/plain;charset=utf-8,${encodeURIComponent(tb)}`}
//           download={`tb_${moduleName}.v`}
//         >Download</a>
//       </div>
//     </div>
//   );
// }
export default function Testbench({ moduleName="expr_module", outName="Y", vars=[], rows=[], tb }) {
  return (
    <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-3xl">
      <h3 className="font-semibold mb-2 text-sky-200 text-lg text-center">Verilog Testbench</h3>
      <pre className="bg-black p-4 rounded text-sm text-yellow-400 font-mono overflow-auto">{tb}</pre>
      <div className="mt-3 flex justify-center gap-3">
        <button onClick={() => navigator.clipboard.writeText(tb)} className="px-4 py-1 bg-yellow-500 rounded text-black font-semibold hover:bg-yellow-600">Copy</button>
        <a
          className="px-4 py-1 bg-slate-700 rounded text-slate-200 hover:bg-slate-600"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(tb)}`}
          download={`tb_${moduleName}.v`}
        >Download</a>
      </div>
    </div>
  );
}
