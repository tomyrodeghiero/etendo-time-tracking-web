import { TasksProps } from "../../utils/interfaces";
import { ISSUE_TAG } from "../../constants/assets";
import { formatDate } from "../../utils/functions";
import { ButtonBase } from "@mui/material";
import { useUser } from "@clerk/nextjs";

const TaskItem = ({
  task,
  isSelected,
  handleTaskClick,
  getStatusColor,
  transitions,
  user,
}: any) => {
  console.log("isSelected", isSelected);
  console.log("transitions", transitions);

  const handleTaskClickModified = (event: any, task: any) => {
    // Comprobar si el clic proviene del select o sus hijos
    if (event.target.closest("select")) {
      return; // No hacer nada si el clic proviene del select
    }
    handleTaskClick(task);
  };

  const handleStatusChange = async (event: any) => {
    event.stopPropagation(); // Detener la propagación del evento

    const transitionId = event.target.value;
    const issueKey = task.key;
    const email: any = user?.user?.primaryEmailAddress?.emailAddress;

    try {
      const response = await fetch("/api/change-issue-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issueKey,
          transitionId,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      // Aquí puedes manejar la respuesta, como actualizar el estado de la tarea en la UI
    } catch (error: any) {
      console.error("Error changing issue status:", error.message);
    }
  };

  return (
    <ButtonBase
      // onClick={() => handleTaskClick(task)}
      onClick={(event) => handleTaskClickModified(event, task)}
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: isSelected ? "#FEF7D0" : "white",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
      }}
      key={task.id}
      className={`flex shadow cursor-pointer rounded-r hover:bg-gray-100 overflow-hidden`}
    >
      <div
        className={`h-full p-[0.075rem] ${getStatusColor(
          task.fields.status.name
        )}`}
      />
      <div className="flex flex-col p-3 text-left gap-3">
        <h2 className="text-base text-black font-medium">
          {task.fields.summary}
        </h2>

        {task.fields.parent?.fields.summary && (
          <div>
            <h3 className="text-sm text-black font-medium rounded shadow-sm px-3 py-1 bg-yellow-400 text-yellow-800 inline-flex">
              {task.fields.parent?.fields.summary}
            </h3>
          </div>
        )}

        {task.fields.duedate && (
          <span className="text-sm font-medium text-gray-700">
            {formatDate(task.fields.duedate)}
          </span>
        )}

        <div className="flex gap-2 mt-1">
          <div
            className={`flex ${getStatusColor(
              task.fields.status.name
            )} shadow p-1 rounded`}
          >
            <img
              src={ISSUE_TAG}
              className="w-3 h-3 self-center"
              alt="Issue tag"
            />
          </div>
          <p className="text-sm font-medium">{task.key}</p>
        </div>

        <select onChange={handleStatusChange}>
          {transitions?.map((transition: any) => (
            <option key={transition.id} value={transition.id}>
              {`${task.fields.status.name} -> ${transition.name}`}
            </option>
          ))}
        </select>
      </div>
    </ButtonBase>
  );
};

export const Tasks = ({
  tasks,
  selectedTasks,
  getStatusColor,
  handleTaskClick,
  user,
}: TasksProps) => {
  return (
    <>
      {tasks.map((task, index) => {
        const isSelected = selectedTasks?.some((t: any) => t.id === task.id);
        return (
          <TaskItem
            key={task.id}
            task={task}
            isSelected={isSelected}
            handleTaskClick={handleTaskClick}
            getStatusColor={getStatusColor}
            transitions={task.transitions.transitions}
            user={user}
          />
        );
      })}
    </>
  );
};
