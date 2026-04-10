import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoCartel() {
    const cartelRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    // Guardamos el ángulo de rotación en grados
    const currentAngle = useRef(0);
    const releaseAngle = useRef(0);

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && cartelRef.current) {
                currentAngle.current = 0;
                cartelRef.current.style.transform = `rotate(0deg)`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            // Aplicamos Laplace al ángulo de rotación
            const mathAngle = releaseAngle.current * (1 - p);
            currentAngle.current = mathAngle;

            if (cartelRef.current) {
                cartelRef.current.style.transform = `rotate(${mathAngle}deg)`;
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

        // Mapeamos el movimiento horizontal (X) del mouse a una inclinación en grados
        // Dividimos entre 3 para que no gire como loco al mover un poco el mouse
        let newAngle = currentAngle.current + (e.movementX / 3);

        // Topamos la inclinación a 80 grados máximo para que no dé la vuelta completa
        newAngle = Math.max(-80, Math.min(80, newAngle));
        currentAngle.current = newAngle;

        if (cartelRef.current) {
            cartelRef.current.style.transform = `rotate(${currentAngle.current}deg)`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);

        // Guardamos en qué ángulo soltó el usuario el cartel
        releaseAngle.current = currentAngle.current;
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#e0f7fa', borderRadius: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden', marginTop: '30px', marginBottom: '30px' }}>

            {/* El Clavo en la pared */}
            <div style={{ width: '15px', height: '15px', background: '#455a64', borderRadius: '50%', position: 'absolute', top: '42px', zIndex: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} />

            {/* Contenedor del Cartel que pivota desde arriba */}
            <div
                ref={cartelRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    marginTop: '50px',
                    width: '200px',
                    height: '120px',
                    backgroundColor: '#ffb300',
                    borderRadius: '10px',
                    cursor: 'grab',
                    touchAction: 'none',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '4px solid #ff8f00',
                    // IMPORTANTE: Cambiamos el punto de anclaje para que gire desde arriba al centro (como si colgara)
                    transformOrigin: 'top center',
                    userSelect: 'none',
                }}
            >
                <span style={{ fontWeight: 'bold', fontSize: '24px', color: '#fff', textShadow: '1px 1px 2px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                    ABIERTO
                </span>
            </div>
        </div>
    );
}