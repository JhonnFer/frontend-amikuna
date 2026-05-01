//src\components\Dashboard_Admin\Eventos\DatePicker.jsx

import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const DatePicker = ({ value, onChange, onBlur, hasError, name = "fecha" }) => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
  ];

  const currentYear = new Date().getFullYear();

  // 🔥 Para eventos → futuro (no pasado)
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Inicializar desde value (YYYY-MM-DD)
  useEffect(() => {
    if (value && value.includes("-")) {
      const [y, m, d] = value.split("-");
      setYear(y || "");
      setMonth(m ? String(parseInt(m)) : "");
      setDay(d ? String(parseInt(d)) : "");
    } else {
      setYear("");
      setMonth("");
      setDay("");
    }
  }, [value]);

  const notify = (d, m, y) => {
    if (d && m && y) {
      const mm = String(m).padStart(2, "0");
      const dd = String(d).padStart(2, "0");

      onChange({
        target: { name, value: `${y}-${mm}-${dd}` },
      });
    }
  };

  const selectCls = (hasErr) =>
    `px-3 py-2.5 text-sm text-gray-800 bg-white border rounded-lg outline-none transition appearance-none cursor-pointer
    ${
      hasErr
        ? "border-red-400 focus:ring-2 focus:ring-red-100"
        : "border-gray-300 focus:ring-2 focus:ring-blue-100"
    }`;

  return (
    <div className="grid grid-cols-3 gap-2" onBlur={onBlur}>
      {/* Día */}
      <select
        value={day}
        onChange={(e) => {
          setDay(e.target.value);
          notify(e.target.value, month, year);
        }}
        className={selectCls(hasError)}
      >
        <option value="">Día</option>
        {days.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      {/* Mes */}
      <select
        value={month}
        onChange={(e) => {
          setMonth(e.target.value);
          notify(day, e.target.value, year);
        }}
        className={selectCls(hasError)}
      >
        <option value="">Mes</option>
        {months.map((m, i) => (
          <option key={i} value={i + 1}>{m}</option>
        ))}
      </select>

      {/* Año */}
      <select
        value={year}
        onChange={(e) => {
          setYear(e.target.value);
          notify(day, month, e.target.value);
        }}
        className={selectCls(hasError)}
      >
        <option value="">Año</option>
        {years.map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
};

DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  hasError: PropTypes.bool,
  name: PropTypes.string,
};

export default DatePicker;