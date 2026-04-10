import React from 'react';
import { BotonConfiguracion } from './components/BotonConfiguracion';
import LienzoBurbuja from './components/lienzos/LienzoBurbuja';
import { LaplaceProvider } from './Context/LaPlaceContext';
import GraficaLaplace from './components/grafica/GraficaLaplace';
import LienzoConsola from './components/lienzos/LienzoConsola';
import LienzoJelly from './components/lienzos/LienzoJelly';
import LienzoToggle from './components/lienzos/LienzoToggle';
import LienzoCartel from './components/lienzos/LienzoCartel';
import LienzoTarjeta3D from './components/lienzos/LienzoTarjeta3D';
import LienzoSwipe from './components/lienzos/LienzoSwipe';
import LienzoResortera from './components/lienzos/LienzoResortera';
import LienzoSlider from './components/lienzos/LienzoSlider';
import LienzoPuerta from './components/lienzos/LienzoPuerta';

function App() {
  const [paginaActual, setPaginaActual] = React.useState(1);
  const [menuAbierto, setMenuAbierto] = React.useState(false);
  return (
    <LaplaceProvider>
      <div className="flex h-screen w-full bg-[#F3F3F3] overflow-hidden">

        <aside className={`${menuAbierto ? 'w-[300px]' : 'w-[80px]'} transition-all duration-300 flex flex-col py-6 bg-white border-r border-gray-200 p-6`}>
          <button onClick={() => setMenuAbierto(!menuAbierto)} className="mb-10 w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white cursor-pointer">
            <div className="grid grid-cols-2 gap-0.5 absolute">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full opacity-50"></div>
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </button>
          {menuAbierto && (
            <nav className={`${menuAbierto ? 'flex' : 'hidden'} flex flex-col space-y-7 text-gray-400`}>
              <div onClick={() => setPaginaActual(1)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Burbuja </a>
              </div>
              <div onClick={() => setPaginaActual(2)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Consola</a>
              </div>
              <div onClick={() => setPaginaActual(3)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Jelly</a>
              </div>
              <div onClick={() => setPaginaActual(4)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Toggle</a>
              </div>
              <div onClick={() => setPaginaActual(5)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Cartel</a>
              </div>
              <div onClick={() => setPaginaActual(6)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Tarjeta 3D</a>
              </div>
              <div onClick={() => setPaginaActual(7)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Swipe</a>
              </div>
              <div onClick={() => setPaginaActual(8)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Resortera</a>
              </div>
              <div onClick={() => setPaginaActual(9)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Slider</a>
              </div>
              <div onClick={() => setPaginaActual(10)} className="cursor-pointer text-black border-b border-gray-200">
                <a>Puerta</a>
              </div>
              <div className="mt-auto">
                <div className="p-3 rounded-xl bg-gray-50 flex flex-col gap-3">
                  <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Autores</p>

                  <div className="flex flex-col gap-2">
                    {/* Autor 1 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                        ET
                      </div>
                      <div className="font-bold text-gray-900 text-sm"> <a href="https://github.com/EduardoToledo-WebDev">Eduardo Toledo</a></div>
                    </div>

                    {/* Autor 2 */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white text-xs font-bold">
                        YS
                      </div>
                      <div className="font-bold text-gray-900 text-sm"> <a href="https://github.com/FERNANELCHIDOXD">Yair Sanchez</a></div>
                    </div>
                  </div>
                </div>
              </div>
            </nav>
          )}

        </aside>

        <main className="flex-1 flex flex-col relative overflow-y-auto items-center">
          <BotonConfiguracion />
          {paginaActual == 1 && <LienzoBurbuja />}
          {paginaActual == 2 && <LienzoConsola />}
          {paginaActual == 3 && <LienzoJelly />}
          {paginaActual == 4 && <LienzoToggle />}
          {paginaActual == 5 && <LienzoCartel />}
          {paginaActual == 6 && <LienzoTarjeta3D />}
          {paginaActual == 7 && <LienzoSwipe />}
          {paginaActual == 8 && <LienzoResortera />}
          {paginaActual == 9 && <LienzoSlider />}
          {paginaActual == 10 && <LienzoPuerta />}
          <GraficaLaplace />
        </main>

      </div>
    </LaplaceProvider>
  );
};

export default App;