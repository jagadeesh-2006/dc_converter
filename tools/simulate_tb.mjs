import fs from 'fs';
import path from 'path';
import { qmSimplify, generateVerilogModule, generateVerilogTestbench } from '../src/lib/logic.js';

// Very small JS "simulator" for the generated testbench display outputs.
// It will not run Verilog; instead it will re-evaluate outputs using the simplified expression
// and print the same pattern/expected/actual lines the Verilog tb would print.

function simulate(moduleName, vars, rows) {
  const qm = qmSimplify(vars, rows);
  const expr = qm.simplified || '0';
  const verilog = generateVerilogModule(moduleName, vars, 'Y', expr);
  const tb = generateVerilogTestbench(moduleName, vars, 'Y', rows);

  console.log('=== Generated Verilog ===');
  console.log(verilog);
  console.log('=== Generated Testbench (Verilog) ===');
  console.log(tb);

  console.log('\n=== Simulated Testbench Output (JS) ===');
  // Print header same as tb
  console.log('pattern expected actual');
  for (const r of rows) {
    const inputs = vars.map(v => r.inputs[v] ? '1' : '0').join('');
    const expected = r.out ? '1' : '0';
    // Evaluate expr in JS by replacing ~ with !, & with &&, | with ||, ^ with !=
    // but safer: evaluate using the rpn path by importing tokenize/toRPN/evalRPN
  }
}

// We'll use tokenize/toRPN/evalRPN to evaluate safely
import { tokenize, toRPN, evalRPN } from '../src/lib/logic.js';

function simulateUsingEval(moduleName, rows) {
  // Extract vars from rows[0].inputs
  const vars = Object.keys(rows[0].inputs);
  const qm = qmSimplify(vars, rows);
  const expr = qm.simplified || '0';
  const rpn = toRPN(tokenize(expr));

  console.log('Using simplified expression:', expr);
  console.log('pattern expected actual');
  for (const r of rows) {
    const inputs = vars.map(v => r.inputs[v] ? '1' : '0').join('');
    const expected = r.out ? '1' : '0';
    const actualBit = evalRPN(rpn, r.inputs);
    console.log(`${inputs}  ${expected}  ${actualBit}`);
  }
}

// Sample 3-variable table for expression A & (B | ~C)
const vars3 = ['A','B','C'];
const rows3 = [];
for (let i=0;i<8;i++){
  const assign = {};
  assign['A'] = (i>>2)&1;
  assign['B'] = (i>>1)&1;
  assign['C'] = (i>>0)&1;
  // define original function
  const out = (assign['A'] && (assign['B'] || (!assign['C']))) ? 1 : 0;
  rows3.push({ inputs: assign, out, index: i });
}

simulateUsingEval('expr_module', rows3);

// small 2-variable example: XOR (A ^ B)
const vars2 = ['A','B'];
const rows2 = [];
for (let i=0;i<4;i++){
  const assign = {};
  assign['A'] = (i>>1)&1;
  assign['B'] = (i>>0)&1;
  const out = (assign['A'] ^ assign['B']) ? 1 : 0;
  rows2.push({ inputs: assign, out, index: i });
}

console.log('\n--- 2-variable XOR example ---');
simulateUsingEval('xor_mod', rows2);
