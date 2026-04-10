import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoToggle() {
    const toggleRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentPos = useRef({ x: 0 });
    const releasePos = useRef({ x: 0 });
    // Guardamos hacia dónde va a rebotar (0 o 60)
    const targetPos = useRef(0);

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && toggleRef.current) {
                // En el reset, se va al estado de apagado (0)
                currentPos.current = { x: 0 };
                targetPos.current = 0;
                toggleRef.current.style.transform = `translateX(0px)`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            // La magia del Toggle: Calculamos la distancia restante y aplicamos Laplace
            const distanceX = targetPos.current - releasePos.current.x;
            const mathX = targetPos.current - (distanceX * (1 - p));

            currentPos.current = { x: mathX };

            if (toggleRef.current) {
                toggleRef.current.style.transform = `translateX(${mathX}px)`;
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
        // Restringimos el arrastre entre 0 y 60 pixeles
        let newX = currentPos.current.x + e.movementX;
        newX = Math.max(-20, Math.min(80, newX)); // Damos un poco de holgura para el rebote visual al arrastrar
        currentPos.current.x = newX;

        if (toggleRef.current) {
            toggleRef.current.style.transform = `translateX(${currentPos.current.x}px)`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);

        releasePos.current = { x: currentPos.current.x };

        // Decidimos el objetivo (Snap to state): Si pasa de la mitad (30px), se va a 60 (Encendido).
        targetPos.current = currentPos.current.x > 30 ? 60 : 0;

        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#dee2e6', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '30px', marginBottom: '30px' }}>
            {/* Contenedor del Switch */}
            <div style={{
                width: '120px', height: '60px', backgroundColor: '#adb5bd',
                borderRadius: '30px', padding: '5px', display: 'flex', alignItems: 'center'
            }}>
                <div
                    ref={toggleRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                        width: '50px', height: '50px', backgroundColor: '#ffffff',
                        borderRadius: '50%', cursor: 'grab', touchAction: 'none',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}
                />
            </div>
        </div>
    );
}