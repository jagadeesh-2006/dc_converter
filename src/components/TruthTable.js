// components/TruthTable.js
import React from 'react';

export default function TruthTable({ vars, rows }) {
  if (!vars || !rows) return null;
  return (
    <div className="card panel">
      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr>
            {vars.map(v => <th key={v} style={{padding:'6px 8px', textAlign:'center'}}>{v}</th>)}
            <th style={{padding:'6px 8px', textAlign:'center'}}>Out</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i)=>(
            <tr key={i}>
              {vars.map(v => <td key={v} style={{padding:'6px 8px', textAlign:'center'}}>{r.inputs[v]}</td>)}
              <td style={{padding:'6px 8px', textAlign:'center'}}>{r.out}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
