import React, { useMemo } from "react";

const H_SPACING = 200;
const V_SPACING = 80;
const GATE_W = 90;
const GATE_H = 60;
const VAR_R = 24;

function computeDepth(node, depth = 0, meta = { max: 0 }) {
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
    node._y = counter.count * V_SPACING + 60;
    counter.count += 1;
  } else {
    node._y = counter.count * V_SPACING + 60;
    counter.count += 1;
  }
}

function gather(node, arr = []) {
  if (!node) return arr;
  arr.push(node);
  if (node.op) {
    if (node.a) gather(node.a, arr);
    if (node.b) gather(node.b, arr);
  }
  return arr;
}

function gateShape(op, cx, cy) {
  const w = GATE_W, h = GATE_H;
  const x = cx - w / 2, y = cy - h / 2;

  const gateStyle = {
    fill: "url(#gateGradient)",
    stroke: "#38bdf8",
    strokeWidth: 2.5,
    filter: "drop-shadow(0 4px 12px rgba(56, 189, 248, 0.4))"
  };

  // AND Gate - D-shaped
  if (op === "&") {
    return (
      <g>
        <path 
          d={`M ${x} ${y} L ${x + w/2} ${y} A ${w/2} ${h/2} 0 0 1 ${x + w/2} ${y + h} L ${x} ${y + h} Z`} 
          {...gateStyle} 
        />
        <text x={cx} y={cy - h/2 - 8} textAnchor="middle" fontSize="14" fill="#38bdf8" fontWeight="bold" fontFamily="monospace">
          AND
        </text>
      </g>
    );
  }
  
  // OR Gate - curved
  if (op === "|") {
    return (
      <g>
        <path 
          d={`M ${x} ${y} Q ${x + w/3} ${y} ${x + w/2} ${y + h/2} Q ${x + w/3} ${y + h} ${x} ${y + h} Q ${x + w/2} ${y + h/2} ${x} ${y}`} 
          {...gateStyle} 
        />
        <text x={cx + 5} y={cy - h/2 - 8} textAnchor="middle" fontSize="14" fill="#38bdf8" fontWeight="bold" fontFamily="monospace">
          OR
        </text>
      </g>
    );
  }
  
  // XOR Gate - OR with extra curve
  if (op === "^") {
    return (
      <g>
        <path 
          d={`M ${x - 10} ${y} Q ${x + w/3 - 10} ${y + h/2} ${x - 10} ${y + h}`} 
          fill="none" 
          stroke="#38bdf8" 
          strokeWidth="2.5" 
        />
        <path 
          d={`M ${x} ${y} Q ${x + w/3} ${y} ${x + w/2} ${y + h/2} Q ${x + w/3} ${y + h} ${x} ${y + h} Q ${x + w/2} ${y + h/2} ${x} ${y}`} 
          {...gateStyle} 
        />
        <text x={cx + 5} y={cy - h/2 - 8} textAnchor="middle" fontSize="14" fill="#38bdf8" fontWeight="bold" fontFamily="monospace">
          XOR
        </text>
      </g>
    );
  }
  
  // NOT Gate - triangle with bubble
  if (op === "~" || op === "!") {
    return (
      <g>
        <path 
          d={`M ${x} ${y} L ${x} ${y + h} L ${x + w - 10} ${y + h/2} Z`} 
          {...gateStyle} 
        />
        <circle 
          cx={x + w - 4} 
          cy={y + h/2} 
          r={7} 
          fill="#0f172a" 
          stroke="#38bdf8" 
          strokeWidth="2.5" 
          filter="drop-shadow(0 0 8px rgba(56, 189, 248, 0.5))" 
        />
        <text x={cx - 8} y={cy - h/2 - 8} textAnchor="middle" fontSize="14" fill="#38bdf8" fontWeight="bold" fontFamily="monospace">
          NOT
        </text>
      </g>
    );
  }

  return <rect x={x} y={y} width={w} height={h} {...gateStyle} />;
}

function wirePath(child, parent) {
  const childIsVar = !!child.var;
  const parentIsVar = !!parent.var;
  
  const childX = child._cx + (childIsVar ? VAR_R : GATE_W / 2);
  const childY = child._y;
  const parentX = parent._cx - (parentIsVar ? VAR_R : GATE_W / 2);
  const parentY = parent._y;
  
  // Straight line connection
  return `M ${childX} ${childY} L ${parentX} ${parentY}`;
}

export default function CircuitDiagram({ ast }) {
  const nodes = useMemo(() => {
    if (!ast) return null;
    function clone(n) {
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
    all.forEach((n) => (n._cx = (meta.max - n._depth) * H_SPACING + 80));
    return { root, all, maxDepth: meta.max };
  }, [ast]);

  if (!nodes) return null;

  const width = (nodes.maxDepth + 2) * H_SPACING + 240;
  const height = Math.max(350, nodes.all.reduce((m, n) => Math.max(m, n._y), 0) + V_SPACING);

  const wires = [];
  nodes.all.forEach((n) => {
    if (n.op) {
      if (n.a) wires.push({ child: n.a, parent: n });
      if (n.b) wires.push({ child: n.b, parent: n });
    }
  });

  return (
    <div style={{
      padding: '32px',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      borderRadius: '24px',
      border: '2px solid rgba(56, 189, 248, 0.2)',
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
        <span style={{ fontSize: '28px' }}>⚡</span>
        <h3 style={{
          fontWeight: 'bold',
          fontSize: '26px',
          color: '#38bdf8',
          letterSpacing: '0.5px'
        }}>
          Logic Circuit Diagram
        </h3>
      </div>

      <div style={{
        backgroundColor: '#0f172a',
        borderRadius: '16px',
        padding: '24px',
        border: '2px solid #334155',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <svg 
          width="100%" 
          height={Math.min(720, height)} 
          viewBox={`0 0 ${width} ${height}`} 
          style={{ display: "block", maxWidth: '100%' }}
        >
          <defs>
            <linearGradient id="gateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1e293b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
            </linearGradient>
            
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,10 L10,5 z" fill="#38bdf8" filter="drop-shadow(0 0 4px rgba(56, 189, 248, 0.8))" />
            </marker>
          </defs>

          {/* Wires */}
          <g fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
            {wires.map((w, i) => (
              <path 
                key={i} 
                d={wirePath(w.child, w.parent)} 
                strokeOpacity="0.9" 
                filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))" 
              />
            ))}
          </g>

          {/* Nodes */}
          <g>
            {nodes.all.map((n, i) => {
              if (n.var) {
                return (
                  <g key={"v" + n.var + i}>
                    <circle
                      cx={n._cx}
                      cy={n._y}
                      r={VAR_R}
                      fill="url(#gateGradient)"
                      stroke="#34d399"
                      strokeWidth="2.5"
                      filter="drop-shadow(0 4px 12px rgba(52, 211, 153, 0.4))"
                    />
                    <text 
                      x={n._cx} 
                      y={n._y + 6} 
                      textAnchor="middle" 
                      fontSize="18" 
                      fill="#34d399" 
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {n.var}
                    </text>
                  </g>
                );
              }
              return <g key={"g" + i}>{gateShape(n.op, n._cx, n._y)}</g>;
            })}
          </g>

          {/* Output Arrow */}
          <g>
            {(() => {
              const root = nodes.root;
              const rx = root.var ? VAR_R : GATE_W / 2;
              const sx = root._cx + rx + 10;
              const sy = root._y;
              return (
                <>
                  <path 
                    d={`M ${sx} ${sy} L ${sx + 60} ${sy}`} 
                    stroke="#38bdf8" 
                    strokeWidth="2.5" 
                    markerEnd="url(#arrow)" 
                    fill="none"
                    filter="drop-shadow(0 0 6px rgba(56, 189, 248, 0.4))"
                  />
                  <text 
                    x={sx + 70} 
                    y={sy + 6} 
                    textAnchor="start" 
                    fontSize="16" 
                    fill="#38bdf8" 
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    Y
                  </text>
                </>
              );
            })()}
          </g>
        </svg>
      </div>

      <div style={{
        marginTop: '24px',
        padding: '16px',
        textAlign: 'center',
        fontSize: '13px',
        color: '#64748b',
        backgroundColor: 'rgba(15, 23, 42, 0.5)',
        borderRadius: '12px',
        border: '1px solid #334155'
      }}>
        Signal flows from left (inputs) to right (output Y)
      </div>
    </div>
  );
}