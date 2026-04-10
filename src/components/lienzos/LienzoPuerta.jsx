import React, { useRef, useEffect } from 'react';
import { useLaplace, calcularLaplace, calcularTiempoMaximo } from '../../Context/LaPlaceContext';

export default function LienzoPuerta() {
    const doorRef = useRef(null);
    const requestRef = useRef(null);
    const { mass, friction, tension, triggerTimestamp, launchAnimation, resetAnimation } = useLaplace();

    const isDragging = useRef(false);
    const currentH = useRef(100); // Altura porcentual inicial
    const releaseH = useRef(100);

    useEffect(() => {
        if (!triggerTimestamp) {
            cancelAnimationFrame(requestRef.current);
            if (!isDragging.current && doorRef.current) {
                currentH.current = 100;
                doorRef.current.style.height = `100%`;
            }
            return;
        }

        const animateElement = () => {
            if (isDragging.current) return;
            const t = (Date.now() - triggerTimestamp) / 1000;
            const p = calcularLaplace(t, mass, friction, tension);

            // Queremos que siempre regrese al 100% (cerrada) o a 0% (abierta) dependiendo de si cruzó la mitad
            const targetH = releaseH.current > 50 ? 100 : 0;
            const distanceH = targetH - releaseH.current;
            const mathH = targetH - (distanceH * (1 - p));
            currentH.current = mathH;

            if (doorRef.current) doorRef.current.style.height = `${mathH}%`;

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
        // Convertimos pixeles arrastrados a porcentaje basado en 400px de contenedor
        currentH.current += (e.movementY / 400) * 100;
        currentH.current = Math.max(0, Math.min(100, currentH.current));

        if (doorRef.current) doorRef.current.style.height = `${currentH.current}%`;
    };

    const handlePointerUp = (e) => {
        isDragging.current = false;
        e.target.releasePointerCapture(e.pointerId);
        releaseH.current = currentH.current;
        launchAnimation();
    };

    return (
        <div style={{ height: '500px', width: '500px', background: '#fff3e0', borderRadius: '15px', position: 'relative', overflow: 'hidden', marginTop: '30px', marginBottom: '30px', userSelect: 'none' }}>
            {/* Contenido Secreto detrás de la puerta */}
            <div style={{ position: 'absolute', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '60px' }}>
                🎉
            </div>

            {/* La Puerta Animada */}
            <div
                ref={doorRef}
                style={{
                    position: 'absolute', top: 0, width: '100%', height: '100%', background: '#ff9800',
                    borderBottom: '10px solid #e65100', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
                }}
            >
                <div
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{
                        width: '100px', height: '30px', background: '#e65100', borderTopLeftRadius: '10px', borderTopRightRadius: '10px',
                        cursor: 'ns-resize', touchAction: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                >
                    <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.5)', borderRadius: '2px' }} />
                </div>
            </div>
        </div>
    );
}