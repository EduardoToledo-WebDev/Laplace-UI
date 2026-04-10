import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoTarjeta3D() {
    const cardRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentRot = useRef({ x: 0, y: 0 });
    const releaseRot = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && cardRef.current) {
                currentRot.current = { x: 0, y: 0 };
                cardRef.current.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg)`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            // Laplace controla los ángulos
            const mathRotX = releaseRot.current.x * (1 - p);
            const mathRotY = releaseRot.current.y * (1 - p);
            currentRot.current = { x: mathRotX, y: mathRotY };

            if (cardRef.current) {
                cardRef.current.style.transform = `perspective(800px) rotateX(${mathRotX}deg) rotateY(${mathRotY}deg)`;
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
        // Invertimos el movimiento X para rotateY y el Y para rotateX (física de pivote 3D)
        currentRot.current.x -= e.movementY / 2;
        currentRot.current.y += e.movementX / 2;

        // Topamos a 60 grados para que no se voltee por completo
        currentRot.current.x = Math.max(-60, Math.min(60, currentRot.current.x));
        currentRot.current.y = Math.max(-60, Math.min(60, currentRot.current.y));

        if (cardRef.current) {
            cardRef.current.style.transform = `perspective(800px) rotateX(${currentRot.current.x}deg) rotateY(${currentRot.current.y}deg)`;
        }
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releaseRot.current = { ...currentRot.current };
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#111', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '30px', marginBottom: '30px', userSelect: 'none' }}>
            <div
                ref={cardRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                    width: '200px', height: '280px', background: 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)',
                    borderRadius: '20px', cursor: 'grab', touchAction: 'none',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 0 0 2px rgba(255,255,255,0.2)',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    color: 'white', fontWeight: 'bold', fontSize: '24px', letterSpacing: '2px'
                }}
            >
                HOLA MUNDO
            </div>
        </div>
    );
}