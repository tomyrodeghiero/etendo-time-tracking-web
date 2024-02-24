import React from "react";
import { useProgress } from "../../context/ProgressContext";
import WorkedTasksToday from "../worked-tasks-today";
import NextDayTasks from "../next-day-tasks";
import ProblemsFound from "../problems-found";
import VerticalLinearStepper from "../vertical-linear-stepper";
import Header from "../header";
import Footer from "../footer";
import Sidebar from "../sidebar";

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

      {/* Sidebar con el Stepper */}
      <div className="flex flex-col w-64 bg-gray-100 border-r">
        {/* <VerticalLinearStepper /> */}
        <Sidebar />
      </div>

      {/* Contenido principal a la derecha del Stepper */}
      <div className="flex w-full bg-gray-300 flex-col">
        <Header firstName={"tomi"} />
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
        <Footer />
      </div>
    </div>
  );
};

export default PhaseComponent;
