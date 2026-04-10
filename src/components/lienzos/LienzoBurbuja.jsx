import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoBurbuja() {
    const bubbleRef = useRef(null);
    const requestRef = useRef(null);

    const {
        mass, friction, tension,
        triggerTimestamp, launchAnimation, resetAnimation
    } = useLaplace();

    // Referencias físicas locales
    const isDragging = useRef(false);
    const currentPos = useRef({ x: 0, y: 0 });
    const releasePos = useRef({ x: 0, y: 0 });

    // EL MOTOR QUE ESCUCHA AL CONTEXTO
    useEffect(() => {
        // Si reseteamos la animación (trigger es null) y no estamos arrastrando la burbuja
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && bubbleRef.current) {
                currentPos.current = { x: 0, y: 0 };
                bubbleRef.current.style.transform = `translate(0px, 0px)`;
            }
            return;
        }

        // Si hay trigger, arrancamos la ecuación
        const animateElement = () => {
            if (isDragging.current) return; // Por si el usuario la agarra en pleno vuelo

            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            const mathX = releasePos.current.x * (1 - p);
            const mathY = releasePos.current.y * (1 - p);
            currentPos.current = { x: mathX, y: mathY };

            if (bubbleRef.current) {
                bubbleRef.current.style.transform = `translate(${mathX}px, ${mathY}px)`;
            }

            const maxTime = calcularTiempoMaximo(mass, friction, tension);

            if (t < maxTime) {
                requestRef.current = requestAnimationFrame(animateElement);
            }
        };

        requestRef.current = requestAnimationFrame(animateElement);

        return () => cancelAnimationFrame(requestRef.current);
    }, [triggerTimestamp, mass, friction, tension]);

    // EVENTOS DEL MOUSE (Arrastrar y Soltar)
    const handlePointerDown = (e) => {
        isDragging.current = true;
        cancelAnimationFrame(requestRef.current);
        e.target.setPointerCapture(e.pointerId);
        if (bubbleRef.current) bubbleRef.current.style.scale = '0.9';

        // Al agarrar la burbuja, mandamos un reset global. 
        // Esto limpia la gráfica inmediatamente en el otro componente.
        resetAnimation();
    };

    const handlePointerMove = (e) => {
        if (!isDragging.current) return;
        currentPos.current.x += e.movementX;
        currentPos.current.y += e.movementY;
        if (bubbleRef.current) {
            bubbleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px)`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        if (bubbleRef.current) bubbleRef.current.style.scale = '1';

        releasePos.current = { ...currentPos.current };


        launchAnimation();
    };

    return (
        <div style={{
            height: '500px', width: '500px', background: '#1a1a1a', borderRadius: '15px',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            position: 'relative', overflow: 'hidden', marginTop: '30px', marginBottom: '30px'
        }}>
            {/* Marcador del centro */}
            <div style={{ position: 'absolute', width: '12px', height: '12px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />

            <div
                ref={bubbleRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: '80px', height: '80px', backgroundColor: '#ff3366',
                    borderRadius: '50%', cursor: 'grab', touchAction: 'none',
                    boxShadow: '0 10px 30px rgba(255, 51, 102, 0.4)', transition: 'scale 0.2s'
                }}
            />
        </div>
    );
}