import React, { createContext, useState, useContext } from 'react';

// 1. Creamos el contexto
const LaplaceContext = createContext();

// 2. Función Matemática Pura 
export const calcularLaplace = (t, m, c, k) => {
    const alpha = c / (2 * m);
    const discriminant = (4 * m * k) - (c * c);

    if (discriminant > 0) { // Subamortiguado
        const omega = Math.sqrt(discriminant) / (2 * m);
        return 1 - Math.exp(-alpha * t) * (Math.cos(omega * t) + (alpha / omega) * Math.sin(omega * t));
    } else if (discriminant < 0) { // Sobreamortiguado
        const omega = Math.sqrt(-discriminant) / (2 * m);
        return 1 - Math.exp(-alpha * t) * (Math.cosh(omega * t) + (alpha / omega) * Math.sinh(omega * t));
    } else { // Crítico
        return 1 - Math.exp(-alpha * t) * (1 + alpha * t);
    }
};
export const calcularTiempoMaximo = (m, c, k) => {
    const alpha = c / (2 * m);
    const discriminant = (4 * m * k) - (c * c);

    let decayRate = alpha;

    if (discriminant < 0) {
        // Caso Sobreamortiguado: Buscamos la raíz lenta
        const omega = Math.sqrt(-discriminant) / (2 * m);
        decayRate = alpha - omega;
    }

    // Retornamos los segundos exactos (topado a 30s)
    return Math.min(4.6 / Math.max(decayRate, 0.01), 30);
};

// 3. El Proveedor del Estado
export const LaplaceProvider = ({ children }) => {
    const [mass, setMass] = useState(1);
    const [friction, setFriction] = useState(6);
    const [tension, setTension] = useState(25);
    const [activeExample, setActiveExample] = useState(1);

    // Usamos un timestamp como "gatillo" para sincronizar la gráfica y la animación
    const [triggerTimestamp, setTriggerTimestamp] = useState(null);

    const launchAnimation = () => setTriggerTimestamp(Date.now());
    const resetAnimation = () => setTriggerTimestamp(null);

    return (
        <LaplaceContext.Provider value={{
            mass, setMass,
            friction, setFriction,
            tension, setTension,
            activeExample, setActiveExample,
            triggerTimestamp, launchAnimation, resetAnimation,
            calcularTiempoMaximo
        }}>
            {children}
        </LaplaceContext.Provider>
    );
};

// 4. Custom Hook para consumirlo fácilmente
export const useLaplace = () => useContext(LaplaceContext);