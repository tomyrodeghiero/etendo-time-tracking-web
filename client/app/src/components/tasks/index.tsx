import { ButtonBase } from "@mui/material";
import { TasksProps } from "../../utils/interfaces";

export const Tasks = ({
  tasks,
  selectedTasks,
  getStatusColor,
  handleTaskClick,
}: TasksProps) => (
  <div className="grid grid-cols-3 gap-4 w-full">
    {tasks.map((task: any, index: number) => {
      const isSelected = selectedTasks?.some((t: any) => t.id === task.id);
      const taskClasses = isSelected ? "bg-yellow-300" : "";

      return (
        <ButtonBase
          style={{
            padding: "1rem",
            borderRadius: "0.5rem",
            backgroundColor: "white",
          }}
          onClick={() => handleTaskClick(task)}
          key={task.id}
          className={`card shadow hover:bg-gray-100 overflow-hidden ${taskClasses}`}
        >
          <div className="flex items-center w-full text-left">
            <div
              className={`w-4 h-4 m-3 rounded-full ${getStatusColor(
                task.fields.status.statusCategory.name
              )}`}
            />
            <span className="text-lg text-black">{task.fields.summary}</span>
          </div>
        </ButtonBase>
      );
    })}
  </div>
);
