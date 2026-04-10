import React, { useRef, useEffect, useState } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoResortera() {
    const ballRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const [lineEndY, setLineEndY] = useState(0); // Estado solo para dibujar la liga
    const currentY = useRef(0);
    const releaseY = useRef(0);

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current) {
                currentY.current = 0;
                setLineEndY(0);
                if (ballRef.current) ballRef.current.style.transform = `translateY(0px)`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            const mathY = releaseY.current * (1 - p);
            currentY.current = mathY;
            setLineEndY(mathY); // Actualiza la liga

            if (ballRef.current) ballRef.current.style.transform = `translateY(${mathY}px)`;

            const maxTime = calcularTiempoMaximo(mass, friction, tension);

            if (t < maxTime) requestRef.current = requestAnimationFrame(animateElement);
        };
        requestRef.current = requestAnimationFrame(animateElement);
        return () => cancelAnimationFrame(requestRef.current);
    }, [triggerTimestamp, mass, friction, tension]);

    const handlePointerDown = (e) => {
        isDragging.current = true;
        cancelAnimationFrame(requestRef.current);
        e.target.setPointerCapture(e.pointerId);
        resetAnimation();
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current) return;
        currentY.current += e.movementY;
        // Solo permitimos jalar hacia abajo
        currentY.current = Math.max(0, Math.min(200, currentY.current));
        setLineEndY(currentY.current);

        if (ballRef.current) ballRef.current.style.transform = `translateY(${currentY.current}px)`;
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releaseY.current = currentY.current;
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#e3f2fd', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '30px', marginBottom: '30px' }}>
            {/* La Liga (SVG) */}
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                <line x1="250" y1="250" x2="250" y2={250 + lineEndY} stroke="#1976d2" strokeWidth="4" strokeDasharray="5,5" />
            </svg>
            <div
                ref={ballRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: '60px', height: '60px', background: '#1976d2', borderRadius: '50%',
                    cursor: 'grab', touchAction: 'none', zIndex: 2,
                    boxShadow: '0 5px 15px rgba(25, 118, 210, 0.5)'
                }}
            />
        </div>
    );
}