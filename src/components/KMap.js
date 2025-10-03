// components/KMap.js
import React from 'react';

function renderSingleMap(kmap){
  return (
    <table className="kmap-table">
      <tbody>
        {kmap.cells.map((rowR,ri)=>(
          <tr key={ri}>
            {rowR.map((cell,cj)=>(
              <td key={cj} className={cell.val ? 'kmap-1' : 'kmap-0'}>
                <div style={{fontSize:14, fontWeight:800}}>{cell.val}</div>
                <div style={{fontSize:10,opacity:0.75}}>
                  {Object.keys(cell.assign).map(k=>k+':'+cell.assign[k]).join(' ')}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function KMap({ kmap }) {
  if (!kmap) return null;
  if (kmap.kind === 'kmap5') {
    return (
      <div className="card panel">
        <div style={{display:'flex', gap:12, alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:13, marginBottom:6}}>{kmap.splitVar} = 0</div>
            {renderSingleMap(kmap.map0)}
          </div>
          <div>
            <div style={{fontSize:13, marginBottom:6}}>{kmap.splitVar} = 1</div>
            {renderSingleMap(kmap.map1)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="card panel">
      {renderSingleMap(kmap)}
    </div>
  );
}
