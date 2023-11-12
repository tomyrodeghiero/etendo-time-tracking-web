import React from "react";
import { useProgress } from "../../context/ProgressContext";
import { ButtonBase } from "@mui/material";

const Footer = () => {
  const { currentPhase, prevStep, nextStep } = useProgress();

  return (
    <div className="border-t-2 border-gray-500 flex justify-between">
      <button
        onClick={prevStep}
        style={{
          padding: "12px 20px", // py-3 px-5
          marginTop: "20px", // mt-5
          backgroundColor: currentPhase === 0 ? "#9CA3AF" : "#202452", // bg-blue-900 if not disabled, otherwise a gray color
          marginLeft: "80px", // ml-20
          color: "white", // text-white
          borderRadius: "0.75rem", // rounded-lg
          cursor: currentPhase === 0 ? "default" : "pointer", // Default cursor if disabled
        }}
        disabled={currentPhase === 0} // Desactiva el botón en la primera fase
      >
        Volver
      </button>
      <ButtonBase
        onClick={nextStep}
        style={{
          padding: "0.75rem 1.25rem",
          marginTop: "1.25rem",
          backgroundColor: currentPhase === 3 ? "#9CA3AF" : "#202452",
          marginRight: "5rem",
          color: "white",
          borderRadius: "0.5rem",
          cursor: currentPhase === 3 ? "default" : "pointer",
        }}
        disabled={currentPhase === 3}
      >
        Avanzar
      </ButtonBase>
    </div>
  );
};

export default Footer;
