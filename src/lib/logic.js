// Operator table for parser
const OPS = {
  '~': { prec: 5, assoc: 'right', arity: 1 },
  '!': { prec: 5, assoc: 'right', arity: 1 },
  '&': { prec: 4, assoc: 'left', arity: 2 },
  '^': { prec: 3, assoc: 'left', arity: 2 },
  '|': { prec: 2, assoc: 'left', arity: 2 },
  '+': { prec: 2, assoc: 'left', arity: 2 }
};

export function tokenize(expr) {
  const re = /\s*([A-Za-z_]\w*|[01]|[()~!&\|\+\^*]|AND|OR|NOT|XOR)\s*/g;
  const tokens = [];
  let m;
  while ((m = re.exec(expr)) !== null) {
    let t = m[1];
    if (/^AND$/i.test(t)) t = '&';
    if (/^OR$/i.test(t)) t = '|';
    if (/^NOT$/i.test(t)) t = '~';
    if (/^XOR$/i.test(t)) t = '^';
    if (t === '*') t = '&';
    tokens.push(t);
  }
  return tokens;
}

export function toRPN(tokens) {
  const out = [];
  const stack = [];
  for (let t of tokens) {
    if (/^[A-Za-z_]\w*$/.test(t) || t === '0' || t === '1') {
      out.push(t); continue;
    }
    if (t === '(') { stack.push(t); continue; }
    if (t === ')') {
      while (stack.length && stack[stack.length-1] !== '(') out.push(stack.pop());
      if (!stack.length) throw new Error("Mismatched parentheses");
      stack.pop(); continue;
    }
    if (OPS[t]) {
      const o1 = t;
      while (stack.length) {
        const o2 = stack[stack.length-1];
        if (!OPS[o2]) break;
        if ((OPS[o1].assoc === 'left' && OPS[o1].prec <= OPS[o2].prec) ||
            (OPS[o1].assoc === 'right' && OPS[o1].prec < OPS[o2].prec)) {
          out.push(stack.pop());
        } else break;
      }
      stack.push(o1);
      continue;
    }
    throw new Error("Unknown token: "+t);
  }
  while (stack.length) {
    const s = stack.pop();
    if (s === '(' || s === ')') throw new Error("Mismatched parentheses");
    out.push(s);
  }
  return out;
}

export function evalRPN(rpn, vars) {
  const st = [];
  for (const t of rpn) {
    if (t === '0' || t === '1' || /^[A-Za-z_]\w*$/.test(t)) {
      const v = (t === '1') ? 1 : (t === '0' ? 0 : (vars[t] ? 1 : 0));
      st.push(v); continue;
    }
    if (t === '~' || t === '!') {
      const a = st.pop(); if (a === undefined) throw new Error("Invalid expr"); st.push(a ^ 1); continue;
    }
    if (t === '&') { const b=st.pop(), a=st.pop(); st.push(a & b); continue; }
    if (t === '|') { const b=st.pop(), a=st.pop(); st.push((a|b)?1:0); continue; }
    if (t === '^') { const b=st.pop(), a=st.pop(); st.push((a^b)?1:0); continue; }
    throw new Error("Unsupported op "+t);
  }
  if (st.length !== 1) throw new Error("Invalid expression");
  return st[0];
}

export function extractVars(tokens) {
  const s = new Set();
  for (const t of tokens) {
    if (/^[A-Za-z_]\w*$/.test(t)) s.add(t);
  }
  return Array.from(s).sort();
}

export function truthTableFromExpr(expr) {
  const tokens = tokenize(expr);
  const vars = extractVars(tokens);
  if (vars.length > 5) throw new Error("Max 5 variables supported");
  const rpn = toRPN(tokens);
  const rows = [];
  const n = vars.length;
  const combos = 1 << n;
  for (let i = 0; i < combos; i++) {
    const assign = {};
    for (let b = 0; b < n; b++) assign[vars[n - 1 - b]] = ((i >> b) & 1);
    const out = evalRPN(rpn, assign);
    rows.push({ inputs: { ...assign }, out, index: i });
  }
  return { vars, rows, rpn };
}

// Gray code helper
function grayCode(n){
  if (n === 0) return [0];
  if (n === 1) return [0,1];
  const prev = grayCode(n-1);
  const res = [];
  for (let x of prev) res.push(x);
  for (let i = prev.length - 1; i >= 0; i--) res.push(prev[i] | (1 << (n-1)));
  return res;
}

// K-map builder
export function buildKMap(vars, rowsData) {
  const n = vars.length;
  if (n < 2 || n > 5) throw new Error("K-map supported for 2..5 vars");
  if (n === 5) {
    const low = rowsData.filter(r => r.inputs[vars[0]] === 0);
    const high = rowsData.filter(r => r.inputs[vars[0]] === 1);
    return { kind:'kmap5', splitVar: vars[0], map0: buildKMap(vars.slice(1), low), map1: buildKMap(vars.slice(1), high) };
  }
  let rowVars, colVars;
  if (n === 2) { rowVars=[vars[0]]; colVars=[vars[1]]; }
  else if (n === 3) { rowVars=[vars[0]]; colVars=[vars[1], vars[2]]; }
  else { rowVars=[vars[0],vars[1]]; colVars=[vars[2],vars[3]]; }

  const rCodes = grayCode(rowVars.length);
  const cCodes = grayCode(colVars.length);
  const rows = rCodes.map(code => ({ code }));
  const cols = cCodes.map(code => ({ code }));
  const cells = [];
  for (let i=0;i<rows.length;i++){
    const row = [];
    for (let j=0;j<cols.length;j++){
      const assign = {};
      for (let b=0;b<rowVars.length;b++){
        const bit = (rows[i].code >> (rowVars.length-1-b)) & 1;
        assign[rowVars[b]] = bit;
      }
      for (let b=0;b<colVars.length;b++){
        const bit = (cols[j].code >> (colVars.length-1-b)) & 1;
        assign[colVars[b]] = bit;
      }
      const match = rowsData.find(rw=>{
        for (const k in assign) if ((rw.inputs[k]||0) !== assign[k]) return false;
        return true;
      });
      row.push({ val: match ? match.out : 0, assign });
    }
    cells.push(row);
  }
  return { kind:'kmap', rowVars, colVars, rows, cols, cells };
}

// Quine-McCluskey simplifier (basic)
function intToBinStr(x, n) { return x.toString(2).padStart(n, '0'); }
function countOnes(s) { return (s.match(/1/g)||[]).length; }
function combineImplicants(a,b){
  let diff=0, idx=-1;
  for (let i=0;i<a.length;i++){
    if (a[i]!==b[i]) { diff++; idx=i; if (diff>1) return null; }
  }
  if (diff===1) return a.substring(0,idx)+'-'+a.substring(idx+1);
  return null;
}

export function qmSimplify(vars, rows){
  const n = vars.length;
  const minterms = rows.filter(r=>r.out===1).map(r=>r.index).sort((a,b)=>a-b);
  if (minterms.length===0) return { simplified: '0', terms: [] };
  if (minterms.length === (1<<n)) return { simplified: '1', terms: ['1'] };

  let groups = {};
  for (const m of minterms){
    const b = intToBinStr(m, n);
    const k = countOnes(b);
    groups[k] = groups[k] || [];
    groups[k].push({ bits: b, mt: [m], used:false });
  }

  let allPrimeImplicants = [];
  while (true){
    const newMap = {};
    const keys = Object.keys(groups).map(k=>parseInt(k)).sort((a,b)=>a-b);
    let any=false;
    for (let i=0;i<keys.length-1;i++){
      const g1 = groups[keys[i]];
      const g2 = groups[keys[i+1]];
      for (const it1 of g1){
        for (const it2 of g2){
          const comb = combineImplicants(it1.bits, it2.bits);
          if (comb !== null){
            any=true;
            it1.used = true; it2.used = true;
            newMap[comb] = newMap[comb] || { bits: comb, mt: new Set() };
            it1.mt.forEach(m=>newMap[comb].mt.add(m));
            it2.mt.forEach(m=>newMap[comb].mt.add(m));
          }
        }
      }
    }
    for (const k in groups) for (const item of groups[k]) if (!item.used) allPrimeImplicants.push({ bits: item.bits, mt: new Set(item.mt) });
    if (!any) break;
    groups = {};
    for (const k in newMap){
      const bits = newMap[k].bits;
      const ones = (bits.match(/1/g)||[]).length;
      groups[ones] = groups[ones] || [];
      groups[ones].push({ bits, mt: Array.from(newMap[k].mt) });
    }
  }

  const uniq = {};
  for (const p of allPrimeImplicants){ uniq[p.bits] = uniq[p.bits] || new Set(); for (const m of p.mt) uniq[p.bits].add(m); }
  const primes = Object.keys(uniq).map(b=> ({ bits:b, mt: new Set(Array.from(uniq[b])) }) );

  const chart = primes.map(p => minterms.map(m => p.mt.has(m) ? 1 : 0));
  const essential = new Set();
  const covered = new Set();
  for (let j=0;j<minterms.length;j++){
    let count=0, idx=-1;
    for (let i=0;i<primes.length;i++) if (chart[i][j]) { count++; idx=i; }
    if (count===1) { essential.add(idx); primes[idx].mt.forEach(m=>covered.add(m)); }
  }
  const selected = new Set(essential);
  while (covered.size < minterms.length){
    let best=-1, bestcnt=0;
    for (let i=0;i<primes.length;i++){
      if (selected.has(i)) continue;
      const arr = Array.from(primes[i].mt).filter(m=>!covered.has(m));
      if (arr.length > bestcnt) { bestcnt = arr.length; best = i; }
    }
    if (best === -1) break;
    selected.add(best); primes[best].mt.forEach(m=>covered.add(m));
  }
  const terms = [];
  for (const idx of Array.from(selected)){
    const bits = primes[idx].bits;
    let parts = [];
    for (let i=0;i<bits.length;i++){
      const ch = bits[i];
      if (ch === '-') continue;
      const v = vars[i];
      if (ch === '1') parts.push(v);
      else parts.push('~'+v);
    }
    terms.push(parts.length ? parts.join(' & ') : '1');
  }
  const simplified = terms.length ? terms.join(' | ') : '0';
  return { simplified, terms, primes };
}

// RPN -> AST (for circuit)
export function rpnToAST(rpn) {
  const st = [];
  for (const t of rpn) {
    if (OPS[t] && OPS[t].arity === 1) {
      const a = st.pop();
      st.push({ op: t, a });
    } else if (OPS[t]) {
      const b = st.pop(); const a = st.pop();
      st.push({ op: t, a, b });
    } else {
      st.push({ var: t });
    }
  }
  if (st.length !== 1) throw new Error("Invalid AST");
  return st[0];
}

// Verilog generator
export function exprToVerilog(expr) {
  return expr.replace(/\bAND\b/gi,'&')
             .replace(/\bOR\b/gi,'|')
             .replace(/\bNOT\b/gi,'~')
             .replace(/\bXOR\b/gi,'^')
             .replace(/\*/g,'&');
}

export function generateVerilogModule(moduleName, inputVars, outputName, expr) {
  const inList = inputVars.join(', ');
  const bodyExpr = exprToVerilog(expr);
  return `module ${moduleName}(${inList}, ${outputName});
  input ${inputVars.join(', ')};
  output ${outputName};

  assign ${outputName} = ${bodyExpr};

endmodule
`;
}

export function generateVerilogTestbench(moduleName, inputVars, outputName, truthRows) {
  const tb = [];
  tb.push(`module tb_${moduleName};`);
  tb.push(`  reg ${inputVars.join(', ')};`);
  tb.push(`  wire ${outputName};`);
  tb.push(`  ${moduleName} uut(${inputVars.join(', ')}, ${outputName});`);
  tb.push('');
  tb.push('  initial begin');
  tb.push('    $display("pattern expected actual");');
  for (let r of truthRows) {
    for (const v of inputVars) tb.push(`    ${v} = ${r.inputs[v] ? "1'b1" : "1'b0"};`);
    tb.push('    #1;');
    const pattern = inputVars.map(v=>'%b').join('');
    const vals = inputVars.join(', ');
    tb.push(`    $display("${pattern}  ${r.out}  %b", ${vals}, ${outputName});`);
    tb.push('');
  }
  tb.push('    $finish;');
  tb.push('  end');
  tb.push('endmodule');
  return tb.join('\n');
}
