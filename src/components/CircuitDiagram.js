import React, { useMemo } from "react";

/*
  Input: ast produced by rpnToAST()
  Renders left-to-right layout: leaves (inputs) on left, root on right.
  Uses simple in-order traversal to set vertical positions and depth for horizontal spacing.
*/

const H_SPACING = 160;
const V_SPACING = 60;
const GATE_W = 96;
const GATE_H = 44;
const VAR_R = 18;

function opLabel(op){
  if (op === '&') return 'AND';
  if (op === '|') return 'OR';
  if (op === '^') return 'XOR';
  if (op === '~' || op === '!') return 'NOT';
  return op;
}

function computeDepth(node, depth=0, meta={max:0}) {
  node._depth = depth;
  meta.max = Math.max(meta.max, depth);
  if (node.op) {
    if (node.a) computeDepth(node.a, depth + 1, meta);
    if (node.b) computeDepth(node.b, depth + 1, meta);
  }
  return meta;
}

function assignY(node, counter) {
  if (node.op && node.a && node.b) {
    assignY(node.a, counter);
    assignY(node.b, counter);
    node._y = (node.a._y + node.b._y) / 2;
  } else if (node.op && node.a) {
    assignY(node.a, counter);
    node._y = node.a._y;
  } else if (node.var) {
    node._y = counter.count * V_SPACING + 40;
    counter.count += 1;
  } else {
    node._y = counter.count * V_SPACING + 40;
    counter.count += 1;
  }
}

function gather(node, arr=[]) {
  if (!node) return arr;
  arr.push(node);
  if (node.op) {
    if (node.a) gather(node.a, arr);
    if (node.b) gather(node.b, arr);
  }
  return arr;
}

export default function CircuitDiagram({ ast }) {
  const nodes = useMemo(()=>{
    if (!ast) return null;
    function clone(n){
      if (!n) return null;
      if (n.var) return { var: n.var };
      const o = { op: n.op };
      if (n.a) o.a = clone(n.a);
      if (n.b) o.b = clone(n.b);
      return o;
    }
    const root = clone(ast);
    const meta = computeDepth(root);
    assignY(root, { count: 0 });
    const all = gather(root, []);
    all.forEach(n => n._cx = (meta.max - n._depth) * H_SPACING + 40);
    return { root, all, maxDepth: meta.max };
  }, [ast]);

  if (!nodes) return null;

  const width = (nodes.maxDepth + 2) * H_SPACING + 220;
  const height = Math.max(260, (nodes.all.reduce((m,n)=>Math.max(m,n._y),0) + V_SPACING));

  function path(child, parent) {
    const childX = child._cx + (child.var ? VAR_R : GATE_W/2);
    const childY = child._y;
    const parentX = parent._cx - (parent.var ? VAR_R : GATE_W/2);
    const parentY = parent._y;
    const mx = (childX + parentX) / 2;
    return `M ${childX} ${childY} C ${mx} ${childY} ${mx} ${parentY} ${parentX} ${parentY}`;
  }

  function drawNode(n, i) {
    if (n.var) {
      return (
        <g key={'v'+n.var+i}>
          <circle cx={n._cx} cy={n._y} r={VAR_R} fill="#021826" stroke="#6EE7B7" strokeWidth="1.6" />
          <text x={n._cx} y={n._y+5} textAnchor="middle" fontSize="12" fill="#CFFFE6" fontFamily="monospace">{n.var}</text>
        </g>
      );
    }
    const label = opLabel(n.op);
    const rx = GATE_W/2, ry = GATE_H/2;
    const x = n._cx - rx, y = n._y - ry;
    return (
      <g key={'g'+i}>
        <rect x={x} y={y} width={GATE_W} height={GATE_H} rx={10} ry={10} fill="#012034" stroke="#60A5FA" strokeWidth="1.6" />
        <text x={n._cx} y={n._y+6} textAnchor="middle" fontSize="13" fill="#CFFFE6">{label}</text>
        {(n.op === '~' || n.op === '!') && <circle cx={n._cx + rx + 8} cy={n._y} r={6} fill="#021826" stroke="#CFFFE6" strokeWidth="1" />}
      </g>
    );
  }

  const wires = [];
  nodes.all.forEach(n=>{
    if (n.op) {
      if (n.a) wires.push({ child: n.a, parent: n });
      if (n.b) wires.push({ child: n.b, parent: n });
    }
  });

  return (
    <div className="card p-4 bg-slate-800 rounded">
      <h3 className="font-semibold mb-3">Circuit</h3>
      <svg width="100%" height={Math.min(720, height)} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,8 L8,4 z" fill="#60A5FA"/>
          </marker>
        </defs>

        <g fill="none" stroke="#9be7ff" strokeWidth="1.4" strokeLinecap="round">
          {wires.map((w, i)=> <path key={i} d={path(w.child, w.parent)} stroke="#9be7ff" strokeOpacity="0.95" />)}
        </g>

        <g>
          {nodes.all.map((n,i)=> drawNode(n,i))}
        </g>

        {/* final output arrow */}
        <g>
          {(() => {
            const root = nodes.root;
            const rx = root.var ? VAR_R : GATE_W/2;
            const sx = root._cx + rx + 6;
            const sy = root._y;
            return <path d={`M ${sx} ${sy} L ${sx+44} ${sy}`} stroke="#9be7ff" strokeWidth="1.6" markerEnd="url(#arrow)" fill="none" />;
          })()}
        </g>
      </svg>
    </div>
  );
}
