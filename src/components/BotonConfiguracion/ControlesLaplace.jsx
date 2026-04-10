import React from 'react';
import { useLaplace } from '../../Context/LaPlaceContext';

export default function ControlesLaplace() {
    const {
        mass, setMass,
        friction, setFriction,
        tension, setTension,
        resetAnimation
    } = useLaplace();

    return (
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '15px', border: '1px solid #dee2e6' }}>
            <h3 style={{ marginTop: 0 }}>Parámetros de la EDO</h3>

            <div style={{ marginBottom: '15px' }}>
                <label>Masa (m): {mass}</label>
                <input type="range" min="0.5" max="5" step="0.5" value={mass} onChange={(e) => setMass(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label>Fricción (c): {friction}</label>
                <input type="range" min="1" max="20" step="1" value={friction} onChange={(e) => setFriction(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <label>Tensión (k): {tension}</label>
                <input type="range" min="10" max="100" step="5" value={tension} onChange={(e) => setTension(Number(e.target.value))} style={{ width: '100%' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>

                <button onClick={resetAnimation} style={{ flex: 1, padding: '10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Reset
                </button>
            </div>
        </div>
    );
}