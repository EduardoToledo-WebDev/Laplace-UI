import React, { useRef, useEffect, useState } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function GraficaLaplace() {
    // ESTADO PARA LA PESTAÑA 
    const [isExpanded, setIsExpanded] = useState(false);

    const canvasRef = useRef(null);
    const requestRef = useRef(null);
    const liveStatsRef = useRef(null);
    const pathHistory = useRef([]);

    const { mass, friction, tension, triggerTimestamp } = useLaplace();

    // --- ANÁLISIS MATEMÁTICO EN VIVO ---
    const discriminant = (4 * mass * tension) - (friction * friction);
    let estadoUI = "";
    let formulaUI = "";

    if (discriminant > 0) {
        estadoUI = "Subamortiguado (Raíces Complejas)";
        formulaUI = "x(t) = 1 - e^{-αt} [ cos(ωt) + (α/ω)sin(ωt) ]";
    } else if (discriminant < 0) {
        estadoUI = "Sobreamortiguado (Raíces Reales)";
        formulaUI = "x(t) = 1 - e^{-αt} [ cosh(ωt) + (α/ω)sinh(ωt) ]";
    } else {
        estadoUI = "Amortiguamiento Crítico";
        formulaUI = "x(t) = 1 - e^{-αt} [ 1 + αt ]";
    }

    const drawGrid = (ctx, width, height) => {
        ctx.beginPath();
        ctx.strokeStyle = '#28a745';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(0, height);
        ctx.moveTo(0, height); ctx.lineTo(width, height);
        ctx.stroke();
    };

    // EL MOTOR DE DIBUJO 
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            pathHistory.current = [];
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid(ctx, canvas.width, canvas.height);
            if (liveStatsRef.current) liveStatsRef.current.innerText = "t: 0.00s  |  x(t): 0.000";
            return;
        }

        pathHistory.current = [];
        const maxTime = calcularTiempoMaximo(mass, friction, tension);

        const animateGraph = () => {
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            if (liveStatsRef.current) {
                liveStatsRef.current.innerText = `t: ${t.toFixed(2)}s  |  x(t): ${p.toFixed(3)}`;
            }

            const drawX = (t / maxTime) * canvas.width;
            const drawY = canvas.height - (p * (canvas.height / 2));

            pathHistory.current.push({ x: drawX, y: drawY });

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid(ctx, canvas.width, canvas.height);

            ctx.beginPath();
            ctx.strokeStyle = '#ff3366';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            pathHistory.current.forEach((pt, index) => {
                if (index === 0) ctx.moveTo(pt.x, pt.y);
                else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();

            const lastPt = pathHistory.current[pathHistory.current.length - 1];
            ctx.beginPath();
            ctx.fillStyle = '#ff3366';
            ctx.arc(lastPt.x, lastPt.y, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 51, 102, 0.3)';
            ctx.arc(lastPt.x, lastPt.y, 12, 0, Math.PI * 2);
            ctx.fill();

            if (t < maxTime) {
                requestRef.current = requestAnimationFrame(animateGraph);
            }
        };

        requestRef.current = requestAnimationFrame(animateGraph);

        return () => cancelAnimationFrame(requestRef.current);
    }, [triggerTimestamp, mass, friction, tension]);

    return (
        <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', border: '1px solid #dee2e6', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'all 0.3s ease' }}>

            {/* PARTE 1: SIEMPRE VISIBLE (Telemetría y Canvas) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h4 style={{ margin: 0, color: '#333' }}>Telemetría en vivo</h4>
                <div
                    ref={liveStatsRef}
                    style={{ background: '#212529', color: '#20c997', padding: '5px 15px', borderRadius: '20px', fontFamily: 'monospace', fontWeight: 'bold', fontSize: '14px' }}
                >
                    t: 0.00s  |  x(t): 0.000
                </div>
            </div>

            <canvas ref={canvasRef} width={600} height={150} style={{ width: '100%', height: '150px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }} />

            {/* BOTÓN TIPO PESTAÑA PARA EXPANDIR */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    style={{
                        background: 'transparent', border: 'none', color: '#007bff', fontWeight: 'bold',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px',
                        padding: '5px 10px', borderRadius: '5px', transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = '#f8f9fa'}
                    onMouseOut={(e) => e.target.style.background = 'transparent'}
                >
                    {isExpanded ? 'Ocultar Análisis Matemático ▼' : 'Ver Análisis Matemático ▲'}
                </button>
            </div>

            {/* PARTE 2: EL PANEL OCULTO (Solo se renderiza si isExpanded es true) */}
            {isExpanded && (
                <div style={{
                    marginTop: '10px', padding: '15px', background: '#e9ecef',
                    borderRadius: '8px', borderLeft: '5px solid #007bff',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <style>
                        {`@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }`}
                    </style>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <span style={{ fontWeight: 'bold', color: '#495057', fontSize: '14px' }}>Estado Analítico:</span>
                        <span style={{ fontWeight: 'bold', color: '#007bff', fontSize: '14px' }}>{estadoUI}</span>
                    </div>
                    <div style={{ fontFamily: 'monospace', color: '#343a40', fontSize: '15px', background: '#fff', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da', textAlign: 'center' }}>
                        {formulaUI}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '8px', textAlign: 'center' }}>
                        α = c / 2m &nbsp; | &nbsp; Discriminante = 4mk - c²
                    </div>
                </div>
            )}

        </div>
    );
}