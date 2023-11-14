import { TasksProps } from "../../utils/interfaces";
import { ISSUE_TAG } from "../../constants/assets";
import { formatDate } from "../../utils/functions";
import { ButtonBase } from "@mui/material";

const TaskItem = ({
  task,
  isSelected,
  handleTaskClick,
  getStatusColor,
}: any) => {
  console.log("isSelected", isSelected);
  return (
    <ButtonBase
      onClick={() => handleTaskClick(task)}
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
      </div>
    </ButtonBase>
  );
};

export const Tasks = ({
  tasks,
  selectedTasks,
  getStatusColor,
  handleTaskClick,
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
          />
        );
      })}
    </>
  );
};
