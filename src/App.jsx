import React from 'react';
import { BotonConfiguracion } from './components/BotonConfiguracion';

function App() {
  const [menuAbierto, setMenuAbierto] = React.useState(false);
  return (
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
          <nav className="flex flex-col space-y-7 text-gray-400">
            <div className="cursor-pointer text-black border-b border-gray-200">
              <a href="/pagina2">Toledooooo</a>
            </div>
            <div className="cursor-pointer text-black border-b border-gray-200">
              <a href="/pagina3">Guapo</a>
            </div>
          </nav>
        )}
      </aside>

      <main className="flex-1 flex flex-col relative overflow-y-auto items-center">
        <BotonConfiguracion />
      </main>

    </div>
  );
};

export default App;