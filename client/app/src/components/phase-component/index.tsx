import React from "react";
import { useProgress } from "../../context/ProgressContext";
import WorkedTasksToday from "../worked-tasks-today";
import NextDayTasks from "../next-day-tasks";
import ProblemsFound from "../problems-found";
import VerticalLinearStepper from "../vertical-linear-stepper";

interface PhaseComponentProps {
  assignedTasks: any;
  setAssignedTasks: any;
  users: any;
}

const PhaseComponent: React.FC<PhaseComponentProps> = ({
  assignedTasks,
  setAssignedTasks,
  users,
}) => {
  const { currentPhase } = useProgress();

  return (
    <div className="flex h-full w-full">
      {/* Contenedor del Stepper */}
      <div className="flex flex-col h-[67.5vh] p-5 w-1/4">
        {/* Ajusta la anchura según necesidad */}
        <VerticalLinearStepper />
      </div>

      {/* Contenido a la derecha del Stepper */}
      <div className="flex flex-grow h-3/4 w-3/4">
        {currentPhase === 0 && (
          <WorkedTasksToday
            assignedTasks={assignedTasks}
            setAssignedTasks={setAssignedTasks}
            users={users}
          />
        )}
        {currentPhase === 1 && (
          <NextDayTasks
            assignedTasks={assignedTasks}
            setAssignedTasks={setAssignedTasks}
          />
        )}
        {currentPhase === 2 && <ProblemsFound />}
        {currentPhase === 3 && <div>Placeholder for SummaryHistory</div>}
      </div>
    </div>
  );
};

export default PhaseComponent;
