export default function VerilogCode({ moduleName="expr_module", outName="Y", vars=[], expr, verilog }) {
  return (
    <div className="card p-4 bg-slate-900 rounded shadow-lg mx-auto max-w-3xl">
      <h3 className="font-semibold mb-2 text-sky-200 text-lg text-center">Verilog Module</h3>
      <pre className="bg-black p-4 rounded text-sm text-green-400 font-mono overflow-auto">{verilog}</pre>
      <div className="mt-3 flex justify-center gap-3">
        <button onClick={() => navigator.clipboard.writeText(verilog)} className="px-4 py-1 bg-green-500 rounded text-black font-semibold hover:bg-green-600">Copy</button>
        <a
          className="px-4 py-1 bg-slate-700 rounded text-slate-200 hover:bg-slate-600"
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(verilog)}`}
          download={`${moduleName}.v`}
        >Download</a>
      </div>
    </div>
  );
}

