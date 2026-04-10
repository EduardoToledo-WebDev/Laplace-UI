import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoConsola() {
    const consoleRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentPos = useRef({ y: 0 });
    const releasePos = useRef({ y: 0 });

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && consoleRef.current) {
                currentPos.current = { y: 0 };
                consoleRef.current.style.transform = `translateY(0px)`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            // Solo animamos el eje Y
            const mathY = releasePos.current.y * (1 - p);
            currentPos.current = { y: mathY };

            if (consoleRef.current) {
                consoleRef.current.style.transform = `translateY(${mathY}px)`;
            }

            const maxTime = calcularTiempoMaximo(mass, friction, tension);

            if (t < maxTime) {
                requestRef.current = requestAnimationFrame(animateElement);
            }
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
        currentPos.current.y += e.movementY;
        if (consoleRef.current) {
            consoleRef.current.style.transform = `translateY(${currentPos.current.y}px)`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releasePos.current = { y: currentPos.current.y };
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#e9ecef', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', marginTop: '30px', marginBottom: '30px', userSelect: 'none' }}>
            {/* Meta */}
            <div style={{ position: 'absolute', width: '100%', height: '2px', backgroundColor: 'rgba(40, 167, 69, 0.5)', borderTop: '2px dashed #28a745' }} />

            <div
                ref={consoleRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: '300px', height: '150px', backgroundColor: '#212529',
                    color: '#20c997', fontFamily: 'monospace', padding: '15px',
                    borderRadius: '10px', cursor: 'grab', touchAction: 'none',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.3)'
                }}
            >
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                    <div style={{ width: 10, height: 10, background: '#ff5f56', borderRadius: '50%' }} />
                    <div style={{ width: 10, height: 10, background: '#ffbd2e', borderRadius: '50%' }} />
                    <div style={{ width: 10, height: 10, background: '#27c93f', borderRadius: '50%' }} />
                </div>
                &gt;_ sys_anim --laplace
                <br />&gt;_ arrástrame arriba o abajo...
            </div>
        </div>
    );
}