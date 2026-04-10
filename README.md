# Laplace UI: Demostración Interactiva ⚛️

Una demostración interactiva construida en React que visualiza cómo el cálculo avanzado puede aplicarse al diseño de interfaces de usuario (UI). A diferencia de las librerías de animación web tradicionales que dependen de curvas de interpolación estáticas (Bézier), este proyecto utiliza la **Transformada de Laplace** para resolver la Ecuación Diferencial Ordinaria (EDO) de un sistema armónico amortiguado en tiempo real.

El resultado es un laboratorio visual con componentes de interfaz (botones, tarjetas, interruptores) que reaccionan de manera orgánica a la interacción del usuario.

## 🌐 Laplace UI Demo

https://laplace-ui.vercel.app/

## 🚀 Características Principales

* **Modelado Matemático Preciso:** Animaciones gobernadas exclusivamente por ecuaciones diferenciales, demostrando visualmente los estados subamortiguado (rebote elástico), sobreamortiguado (fricción densa) y el amortiguamiento crítico.
* **Separación de Intereses (Context API):** Un único contexto matemático global (`LaplaceContext`) centraliza la lógica computacional, distribuyendo los resultados a 10 componentes visuales distintos simultáneamente.
* **Telemetría en Tiempo Real (Cero Lag):** Renderizado de gráficas a 60 FPS utilizando `HTML5 Canvas` puro y manipulación directa del DOM, evitando los cuellos de botella del ciclo de vida de React.
* **Optimización de Rendimiento:** El sistema calcula el discriminante de la ecuación y utiliza límites logarítmicos para predecir el milisegundo exacto en que la envolvente exponencial es imperceptible ($< 1\%$), apagando el ciclo `requestAnimationFrame` automáticamente para ahorrar CPU.

## 🧠 ¿Cómo funciona? (El Modelo Matemático)

El comportamiento de cada componente de esta demostración está modelado como un sistema masa-resorte-amortiguador, descrito por la siguiente ecuación diferencial de segundo orden:

$$m x''(t) + c x'(t) + k x(t) = 0$$

Donde las variables interactivas representan:
* **$m$ (Masa):** La inercia del componente de la interfaz.
* **$c$ (Fricción/Amortiguamiento):** La resistencia que frena el movimiento con el tiempo.
* **$k$ (Tensión del Resorte):** La fuerza de atracción hacia el estado de reposo.

Para evitar el alto costo computacional de resolver derivadas en tiempo real en el navegador, el sistema aplica la **Transformada de Laplace** para llevar la ecuación al dominio de la frecuencia compleja ($s$). Tras encontrar el polinomio característico y aplicar la antitransformada, inyectamos la solución directamente en las propiedades visuales:

$$x(t) = 1 - e^{-\alpha t} \left( \cos(\omega t) + \frac{\alpha}{\omega} \sin(\omega t) \right)$$

*Nota: La fórmula mostrada corresponde al caso subamortiguado. La demostración detecta automáticamente y cambia a funciones hiperbólicas para los casos sobreamortiguados.*

## 🧩 Componentes Interactivos

El repositorio incluye 10 experimentos donde la misma solución matemática gobierna diferentes propiedades CSS (`transform`, `scale`, `rotate`, `height`, `width`):

1. **Burbuja Magnética:** Traslación espacial 2D bidireccional.
2. **Terminal Drop:** Traslación vertical con límite de suelo.
3. **Botón Jelly:** Deformación de escala elástica.
4. **Toggle Switch Industrial:** Interpolación de límites con decisión de estado magnético.
5. **Cartel Péndulo:** Rotación 2D anclada a un eje superior .
6. **Tarjeta Holográfica 3D:** Rotación tridimensional sobre ejes $X$ y $Y$ con perspectiva.
7. **Swipe Card:** Translación horizontal con lógica de descarte dinámico.
8. **Slingshot (Tirachinas):** Interacción elástica con vectores SVG en tiempo real.
9. **Slider Pesado:** Modificación de ancho con alta inercia simulada.
10. **Puerta de Garaje:** Animación de altura relativa basada en vectores direccionales.

## 🛠️ Tecnologías Utilizadas

* **React (Hooks & Context API):** Para la arquitectura modular y gestión de estado.
* **HTML5 Canvas API:** Para el trazado de telemetría de alto rendimiento.
* **CSS3 Hardware Acceleration:** Uso exclusivo de transformaciones GPU para el movimiento fluido.


## 📦 Instalación y Uso

1. Clona este repositorio:
```bash
git clone [https://github.com/tu-usuario/laplace-ui-demo.git](https://github.com/tu-usuario/laplace-ui-demo.git)
