import React from "react";

const HistoriasYReels = () => {
  const historias = [
    { id: 1, usuario: "Ana", imagen: "/uploads/historia1.jpg" },
    { id: 2, usuario: "Luis", imagen: "/uploads/historia2.jpg" },
    { id: 3, usuario: "Carlos", imagen: "/uploads/historia3.jpg" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Historias y Reels</h2>
      <div className="flex space-x-4 overflow-x-auto">
        {historias.map((historia) => (
          <div key={historia.id} className="w-24 flex-shrink-0 text-center">
            <img
              src={historia.imagen}
              alt={`Historia de ${historia.usuario}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-pink-500"
            />
            <p className="text-sm mt-1">{historia.usuario}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoriasYReels;
