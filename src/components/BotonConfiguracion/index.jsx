import { FcDataConfiguration } from "react-icons/fc";
import React from "react";

function BotonConfiguracion() {
    const [menuAbierto, setMenuAbierto] = React.useState(false);
    const [masa, setMasa] = React.useState(0);
    const [friccion, setFriccion] = React.useState(0);
    const [tension, setTension] = React.useState(0);

    return (
        <>
            <button className="cursor-pointer absolute top-4 right-4" onClick={() => setMenuAbierto(!menuAbierto)}>
                <FcDataConfiguration size={50} />
            </button>

            {
                menuAbierto && (
                    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-xl mb-6">Variables de Laplace</p>
                        <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-2">
                                <input type="range" id="masa" value={masa} onChange={(e) => setMasa(e.target.value)} />
                                <label htmlFor="masa">Masa</label>
                                <p>{masa}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="range" id="friccion" value={friccion} onChange={(e) => setFriccion(e.target.value)} />
                                <label htmlFor="friccion">Friccion</label>
                                <p>{friccion}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input type="range" id="tension" value={tension} onChange={(e) => setTension(e.target.value)} />
                                <label htmlFor="tension">Tension</label>
                                <p>{tension}</p>
                            </div>


                        </div>
                        <button onClick={() => setMenuAbierto(!menuAbierto)} className="cursor-pointer bg-red-500 text-white p-2 rounded-lg mt-4 w-full">Cerrar</button>
                    </div>
                )
            }
        </>
    );
}

export { BotonConfiguracion };