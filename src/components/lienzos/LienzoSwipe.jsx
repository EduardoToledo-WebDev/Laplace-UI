import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoSwipe() {
    const cardRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentPos = useRef(0);
    const releasePos = useRef(0);
    const targetPos = useRef(0); // Puede ser 0 (centro), 600 (derecha) o -600 (izquierda)

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && cardRef.current) {
                currentPos.current = 0;
                targetPos.current = 0;
                cardRef.current.style.transform = `translateX(0px)`;
                cardRef.current.style.opacity = 1;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            const distanceX = targetPos.current - releasePos.current;
            const mathX = targetPos.current - (distanceX * (1 - p));
            currentPos.current = mathX;

            if (cardRef.current) {
                cardRef.current.style.transform = `translateX(${mathX}px)`;
                // Se desvanece si sale volando
                if (targetPos.current !== 0) {
                    cardRef.current.style.opacity = 1 - Math.abs(mathX / 400);
                }
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
        currentPos.current += e.movementX;
        if (cardRef.current) cardRef.current.style.transform = `translateX(${currentPos.current}px)`;
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releasePos.current = currentPos.current;

        // Decisión Matemática: Límite de descarte de 150px
        if (currentPos.current > 150) targetPos.current = 600; // Descartar a la derecha
        else if (currentPos.current < -150) targetPos.current = -600; // Descartar a la izquierda
        else targetPos.current = 0; // Regresar al centro

        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#ffebee', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginTop: '30px', marginBottom: '30px' }}>
            <div style={{ position: 'absolute', fontSize: '20px', color: '#d32f2f', fontWeight: 'bold' }}>Eliminado</div>
            <div
                ref={cardRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: '350px', height: '100px', background: '#fff', borderRadius: '15px',
                    display: 'flex', alignItems: 'center', padding: '0 20px', zIndex: 2, cursor: 'grab', touchAction: 'none',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', marginRight: '15px' }} />
                <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#333' }}>Mensaje del Sistema</h4>
                    <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>Desliza para descartar...</p>
                </div>
            </div>
        </div>
    );
}