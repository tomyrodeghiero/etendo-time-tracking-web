import React, { useState } from "react";
import { useProgress } from "../../context/ProgressContext";
import { Button, Typography } from "@mui/material";
import { ETENDO_LOGOTYPE } from "../../constants/assets";

const steps = [
    {
        label: "Imputar",
        description: "Descripción del paso de Imputar.",
    },
    { label: "Tareas de mañana", },
    {
        label: "Problemas",
    },
];

export default function Sidebar() {
    const { currentPhase, setCurrentPhase } = useProgress();

    return (
        <div className="flex flex-col h-screen bg-gray-100 shadow">
            {/* Logo or title of the sidebar */}
            <img src={ETENDO_LOGOTYPE} alt="Etendo Logo" className="w-40 mx-auto mt-5" />

            <div className="flex flex-col py-4 px-3">
                {/* List of phases */}
                {steps.map((step, index) => (
                    <div
                        key={step.label}
                        role="button"
                        onClick={() => setCurrentPhase(index)}
                        className={`text-left font-medium mb-2 text-blue-900 rounded-lg py-2 px-4 w-full ${currentPhase === index ? "bg-yellow-500" : ""
                            }`}
                    >
                        {step.label}
                    </div>
                ))}
            </div>

            {/* Button at the bottom to open tokenPopup */}
            <div
                className="text-center font-medium mx-auto py-3 px-10 mb-4 rounded-full text-white text-sm bg-blue-900 cursor-pointer mt-auto"
            >
                Jira Api Token
            </div>
        </div>
    );
}