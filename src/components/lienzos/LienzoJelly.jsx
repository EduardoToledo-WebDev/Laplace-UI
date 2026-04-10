import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoJelly() {
    const jellyRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentPos = useRef({ x: 0, y: 0 });
    const releasePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && jellyRef.current) {
                currentPos.current = { x: 0, y: 0 };
                jellyRef.current.style.transform = `scale(1, 1)`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            const mathX = releasePos.current.x * (1 - p);
            const mathY = releasePos.current.y * (1 - p);
            currentPos.current = { x: mathX, y: mathY };

            if (jellyRef.current) {
                // Convertimos la distancia en píxeles a un porcentaje de escala
                const scaleX = 1 + (mathX / 150);
                const scaleY = 1 + (mathY / 150);
                jellyRef.current.style.transform = `scale(${scaleX}, ${scaleY})`;
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
        currentPos.current.x += e.movementX;
        currentPos.current.y += e.movementY;
        if (jellyRef.current) {
            const scaleX = 1 + (currentPos.current.x / 150);
            const scaleY = 1 + (currentPos.current.y / 150);
            jellyRef.current.style.transform = `scale(${scaleX}, ${scaleY})`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releasePos.current = { ...currentPos.current };
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#fdf0d5', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden', marginTop: '30px', marginBottom: '30px' }}>
            <div
                ref={jellyRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: '120px', height: '120px', backgroundColor: '#6610f2',
                    borderRadius: '40%', cursor: 'grab', touchAction: 'none',
                    boxShadow: '0 10px 30px rgba(102, 16, 242, 0.4)'
                }}
            />
        </div>
    );
}