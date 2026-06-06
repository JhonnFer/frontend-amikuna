import PropTypes from "prop-types";

const ChatbotWidget = ({ isOpen, userId }) => {
  // Clave única por usuario — fuerza nuevo iframe al cambiar de usuario
  const iframeKey = `botpress-${userId || "guest"}`;

  return (
    <div style={{ display: isOpen ? "block" : "none", width: "100%", height: "100%" }}>
      <iframe
        key={iframeKey}
        src="https://cdn.botpress.cloud/webchat/v3.6/shareable.html?configUrl=https://files.bpcontent.cloud/2026/04/23/02/20260423024610-NNKB4Q1Y.json"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "0 0 16px 16px",
        }}
        title="Asistente Amikuna"
      />
    </div>
  );
};

ChatbotWidget.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  userId: PropTypes.string,
};

export default ChatbotWidget;
