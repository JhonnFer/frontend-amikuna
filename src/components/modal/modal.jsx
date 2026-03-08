import PropTypes from "prop-types";

const Modal = ({ isOpen, onClose, title, children, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
      onClick={showCloseButton ? onClose : null} // Solo cierra al clic fuera si se permite cerrar
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-[800px] h-[700px] overflow-y-auto relative animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* Cabecera */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b bg-white z-20">
          <h2 className="text-2xl font-bold text-[#B5651D]">{title}</h2>
          
          {/* Mostramos la X solo si showCloseButton es true */}
          {showCloseButton && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 text-xl hover:text-red-500"
            >
              ✕
            </button>
          )}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showCloseButton: PropTypes.bool, // Nueva prop opcional
};

export default Modal;