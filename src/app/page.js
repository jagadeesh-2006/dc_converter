"use client";
import Link from "next/link";
import { useState } from "react";
import ExpressionInput from "../components/ExpressionInput";
import TruthTable from "../components/TruthTable";
import KMap from "../components/KMap";
import CircuitDiagram from "../components/CircuitDiagram";

export default function Home() {
  const [expr, setExpr] = useState("A & (B | ~C)");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#e0f2fe',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}>
        {/* Floating orbs */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 20s ease-in-out infinite',
          animationDelay: '0s'
        }} />
        <div style={{
          position: 'absolute',
          top: '60%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 25s ease-in-out infinite',
          animationDelay: '5s'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 30s ease-in-out infinite',
          animationDelay: '10s'
        }} />
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Header */}
        <header style={{
          marginBottom: '40px',
          textAlign: 'center',
          animation: 'fadeIn 1s ease-out'
        }}>
          <div style={{
            display: 'inline-block',
            padding: '32px 48px',
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
            borderRadius: '24px',
            border: '2px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 60px rgba(56, 189, 248, 0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
              <span style={{ fontSize: '48px', filter: 'drop-shadow(0 0 20px rgba(56, 189, 248, 0.6))' }}>
                ⚡
              </span>
              <h1 style={{
                fontSize: '42px',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '1px'
              }}>
                Boolean Expression Converter
              </h1>
            </div>
            <p style={{
              marginTop: '12px',
              fontSize: '16px',
              color: '#94a3b8',
              letterSpacing: '0.5px'
            }}>
              Transform logic expressions into truth tables, K-maps, and circuits
            </p>
          </div>
        </header>

        {/* Input Section */}
        <div style={{ animation: 'fadeIn 1s ease-out 0.2s both' }}>
          <ExpressionInput
            expr={expr}
            setExpr={setExpr}
            setResult={setResult}
            setError={setError}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div style={{
            marginTop: '24px',
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(185, 28, 28, 0.1) 100%)',
            borderRadius: '16px',
            border: '2px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
            animation: 'slideIn 0.5s ease-out'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '32px',
            animation: 'fadeIn 0.8s ease-out 0.3s both'
          }}>
            {/* Main Content Area */}
            <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div style={{ animation: 'fadeIn 0.6s ease-out 0.4s both' }}>
                <TruthTable vars={result.vars} rows={result.rows} />
              </div>
              <div style={{ animation: 'fadeIn 0.6s ease-out 0.5s both' }}>
                <KMap kmap={result.kmap} />
              </div>
              <div style={{ animation: 'fadeIn 0.6s ease-out 0.6s both' }}>
                <CircuitDiagram ast={result.ast} />
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '24px',
              animation: 'slideIn 0.8s ease-out 0.5s both'
            }}>
              {/* Actions Card */}
              <div style={{
                padding: '32px',
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '24px',
                border: '2px solid rgba(56, 189, 248, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                position: 'sticky',
                top: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '24px'
                }}>
                  <span style={{ fontSize: '28px' }}>🚀</span>
                  <h2 style={{
                    fontSize: '22px',
                    fontWeight: 'bold',
                    color: '#38bdf8',
                    letterSpacing: '0.5px'
                  }}>
                    Export & Test
                  </h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Link
                    href={{
                      pathname: "/verilog",
                      query: { moduleName: "expr_module", expr: expr, verilog: result.verilog },
                    }}
                    style={{
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(34, 197, 94, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)';
                    }}
                  >
                    📝 View Verilog Code
                  </Link>

                  <Link
                    href={{
                      pathname: "/testbench",
                      query: { moduleName: "expr_module", rows: JSON.stringify(result.rows), tb: result.tb },
                    }}
                    style={{
                      padding: '16px 24px',
                      background: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
                      color: 'white',
                      borderRadius: '16px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 12px rgba(234, 179, 8, 0.3)',
                      transition: 'all 0.3s ease',
                      display: 'block'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(234, 179, 8, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(234, 179, 8, 0.3)';
                    }}
                  >
                    🧪 Run Testbench
                  </Link>
                </div>

                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  backgroundColor: 'rgba(15, 23, 42, 0.5)',
                  borderRadius: '12px',
                  border: '1px solid #334155',
                  fontSize: '13px',
                  color: '#94a3b8',
                  lineHeight: '1.6'
                }}>
                  <strong style={{ color: '#38bdf8' }}>Tip:</strong> Export your logic design to Verilog HDL or test it with an automated testbench
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: '60px',
          padding: '24px',
          textAlign: 'center',
          background: 'rgba(15, 23, 42, 0.5)',
          borderRadius: '16px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          fontSize: '14px',
          color: '#64748b',
          lineHeight: '1.8',
          animation: 'fadeIn 1s ease-out 0.8s both'
        }}>
          <div style={{ marginBottom: '8px', color: '#94a3b8', fontWeight: '600' }}>
            📚 Supported Syntax
          </div>
          <div>
            Variables: <strong style={{ color: '#38bdf8' }}>A-E</strong> (max 5) • 
            NOT: <strong style={{ color: '#38bdf8' }}>~</strong> or <strong style={{ color: '#38bdf8' }}>!</strong> • 
            AND: <strong style={{ color: '#38bdf8' }}>&</strong> or <strong style={{ color: '#38bdf8' }}>.</strong> • 
            OR: <strong style={{ color: '#38bdf8' }}>|</strong> or <strong style={{ color: '#38bdf8' }}>+</strong> • 
            XOR: <strong style={{ color: '#38bdf8' }}>^</strong> • 
            Parentheses: <strong style={{ color: '#38bdf8' }}>( )</strong>
          </div>
        </footer>
      </div>
    </main>
  );
}