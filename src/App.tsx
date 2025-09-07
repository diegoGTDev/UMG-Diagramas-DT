import './index.css'

import AutomataDiagram from './AutomataDiagram';
import { useRef } from 'react';

function App() {
  // Referencia para acceder a la función de añadir estado en el hijo
  const addStateRef = useRef<() => void>(undefined);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-[#223A5F] text-white flex flex-col p-4 shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <img
            src={`${import.meta.env.BASE_URL}mariano_logo.png`}
            alt="Logo de la mariano galvez"
            className="size-20 mb-2"
          />
          <h1 className="text-xl font-bold text-center">Diagrama de Autómatas</h1>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
          onClick={() => addStateRef.current && addStateRef.current()}
        >
          Añadir Estado
        </button>
        <div className="flex-1">
          <p className="text-sm text-gray-300">Barra lateral para herramientas y componentes</p>
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 bg-white">
        <AutomataDiagram setAddStateRef={fn => { addStateRef.current = fn; }} />
      </main>
    </div>
  );
}

export default App;
