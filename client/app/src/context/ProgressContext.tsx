import React, { createContext, useState, useContext, ReactNode } from "react";

type ProgressState = {
  currentPhase: number;
  setCurrentPhase: React.Dispatch<React.SetStateAction<number>>;
  nextStep: () => void;
  prevStep: () => void;
};

interface ProgressProviderProps {
  children: ReactNode;
}

const ProgressContext = createContext<ProgressState | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used within a ProgressProvider");
  }
  return context;
};

export const ProgressProvider: React.FC<ProgressProviderProps> = ({
  children,
}) => {
  const [currentPhase, setCurrentPhase] = useState(0);

  const nextStep = () => {
    setCurrentPhase((prevPhase) => prevPhase + 1);
  };

  const prevStep = () => {
    setCurrentPhase((prevPhase) => prevPhase - 1);
  };

  return (
    <ProgressContext.Provider
      value={{
        currentPhase,
        setCurrentPhase,
        nextStep,
        prevStep,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};
