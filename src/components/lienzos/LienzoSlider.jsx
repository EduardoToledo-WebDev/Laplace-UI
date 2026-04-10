import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoSlider() {
    const thumbRef = useRef(null);
    const fillRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentX = useRef(0);
    const releaseX = useRef(0);
    const targetX = useRef(0); // Dependerá de dónde lo sueltes

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && thumbRef.current) {
                currentX.current = 0; targetX.current = 0;
                thumbRef.current.style.transform = `translateX(0px)`;
                fillRef.current.style.width = `0px`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            const distanceX = targetX.current - releaseX.current;
            const mathX = targetX.current - (distanceX * (1 - p));
            currentX.current = mathX;

            if (thumbRef.current) {
                thumbRef.current.style.transform = `translateX(${mathX}px)`;
                fillRef.current.style.width = `${mathX + 20}px`; // +20 para cubrir el botón
            }

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
        currentX.current += e.movementX;
        currentX.current = Math.max(0, Math.min(300, currentX.current)); // Límite del slider

        if (thumbRef.current) {
            thumbRef.current.style.transform = `translateX(${currentX.current}px)`;
            fillRef.current.style.width = `${currentX.current + 20}px`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releaseX.current = currentX.current;
        // Snap: Acomodamos el valor a bloques de 100px (0, 100, 200, 300)
        targetX.current = Math.round(currentX.current / 100) * 100;
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#343a40', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '30px', marginBottom: '30px' }}>
            <div style={{ width: '340px', height: '10px', background: '#495057', borderRadius: '5px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div ref={fillRef} style={{ height: '100%', background: '#20c997', borderRadius: '5px', width: '0px' }} />
                <div
                    ref={thumbRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                        width: '40px', height: '40px', background: '#fff', borderRadius: '50%',
                        position: 'absolute', left: '-20px', cursor: 'grab', touchAction: 'none',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
                    }}
                />
            </div>
        </div>
    );
}