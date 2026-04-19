import { useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={showCloseButton ? onClose : undefined}
        >
          <motion.div
            className="bg-gradient-to-br from-red-100 via-orange-50  to-orange-100 rounded-2xl shadow-2xl w-full max-w-[42vw] max-h-[85vh] flex flex-col"
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-2 p-4 border-b">
              {icon && <span className="text-[#B5651D]">{icon}</span>}
              <h2 className="text-xl font-bold text-[#B5651D]">{title}</h2>
              <div className="ml-auto ">
                {showCloseButton && (
                  <motion.button
                    onClick={onClose}
                    className="text-gray-400 hover:text-red-500 text-xl transition"
                    whileHover={{ scale: 1.2, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ✕
                  </motion.button>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-7 flex flex-1 items-center justify-content-center ">
              <div className="w-full max-w-[40vw] max-h-full ">
                {children}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  showCloseButton: PropTypes.bool,
  icon: PropTypes.element,
};

export default Modal;
