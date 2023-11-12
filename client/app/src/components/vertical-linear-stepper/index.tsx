import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Typography,
} from "@mui/material";
import { useProgress } from "../../context/ProgressContext";

const steps = [
  {
    label: "Imputar",
    description: "Descripción del paso de Imputar.",
  },
  {
    label: "Tareas del próximo día",
    description: "Descripción del paso de Tareas del próximo día.",
  },
  {
    label: "Problemas encontrados",
    description: "Descripción del paso de Problemas encontrados.",
  },
  {
    label: "Resumen",
    description: "Descripción del paso de Resumen.",
  },
];

export default function VerticalLinearStepper() {
  const { currentPhase } = useProgress();

  // Estilos personalizados para el Stepper y sus componentes
  const stepperStyles = {
    "& .MuiStepConnector-line": {
      height: "100%", // Asegura que las líneas ocupen el 100% del espacio disponible
    },
    "& .MuiStepContent-root": {
      height: "100%", // Asegura que el contenido también ocupe el 100% del alto
    },
    // Asegura que el contenedor del contenido ocupe el 100% del alto
    "& .MuiCollapse-container": {
      height: "100%",
    },
    // Asegura que el contenido interno del contenedor ocupe el 100% del alto
    "& .MuiCollapse-wrapperInner": {
      height: "100%",
    },
  };

  return (
    <Stepper
      activeStep={currentPhase}
      orientation="vertical"
      sx={stepperStyles}
      className="h-full"
    >
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel>{step.label}</StepLabel>
          <StepContent>
            <Typography>{step.description}</Typography>
          </StepContent>
        </Step>
      ))}
    </Stepper>
  );
}
