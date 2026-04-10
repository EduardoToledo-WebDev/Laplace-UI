import { FcDataConfiguration } from "react-icons/fc";
import React from "react";
import ControlesLaplace from "./ControlesLaplace";

function BotonConfiguracion() {
    const [menuAbierto, setMenuAbierto] = React.useState(false);


    return (
        <>
            <button className="cursor-pointer absolute top-4 right-4" onClick={() => setMenuAbierto(!menuAbierto)}>
                <FcDataConfiguration size={50} />
            </button>

            {
                menuAbierto && (
                    <div className="absolute  z-100 top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                        <div>
                            <ControlesLaplace />
                        </div>
                        <button onClick={() => setMenuAbierto(!menuAbierto)} className="cursor-pointer bg-red-500 text-white p-2 rounded-lg mt-4 w-full">Cerrar</button>
                    </div>
                )
            }
        </>
    );
}

export { BotonConfiguracion };