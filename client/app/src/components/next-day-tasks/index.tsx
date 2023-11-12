"use client";

import React, { useRef, useState } from "react";
import { Tasks } from "../tasks";
import { addWorklog } from "../../utils/api/jira";
import { NEXT_DAY_TASK_ID } from "../../utils/constants";
import { formatSelectedTasksMessage, parseTime } from "../../utils/functions";
import { useUser } from "@clerk/nextjs";

const NextDayTasks = ({ assignedTasks, setAssignedTasks }: any) => {
  const user = useUser();
  const email: any = user?.user?.primaryEmailAddress?.emailAddress;

  const [selectedTasks, setSelectedTasks] = useState([]);

  const handleTaskClick = (task: any) => {
    setSelectedTasks((prevTasks: any) => {
      // Verifica si la tarea ya está seleccionada
      if (prevTasks.find((t: any) => t.id === task.id)) {
        // Si está seleccionada, la remueve
        return prevTasks.filter((t: any) => t.id !== task.id);
      } else {
        // Si no está seleccionada, la agrega
        return [...prevTasks, task];
      }
    });
  };

  // Filter tasks
  const toDoTasks = assignedTasks.filter(
    (task: any) => task.fields.status.statusCategory.name === "To Do"
  );
  const definedTasks = assignedTasks.filter(
    (task: any) => task.fields.status.statusCategory.name === "Defined"
  );
  const blockedTasks = assignedTasks.filter(
    (task: any) => task.fields.status.statusCategory.name === "Blocked"
  );
  const inProgressTasks = assignedTasks.filter(
    (task: any) => task.fields.status.statusCategory.name === "In Progress"
  );
  const inReviewTasks = assignedTasks.filter(
    (task: any) => task.fields.status.statusCategory.name === "In Review"
  );
  const qaTasks = assignedTasks.filter(
    (task: any) => task.fields.status.statusCategory.name === "QA"
  );

  const popupRef = useRef<any>(null);

  const getStatusColor = (status: string) => {
    console.log("status 😀 ", status);
    const colors: any = {
      "To Do": "bg-blue-300",
      Blocked: "bg-red-500",
      "In Progress": "bg-yellow-500",
      "In Review": "bg-orange-500",
      QA: "bg-green-500",
      Default: "bg-gray-300",
    };

    return colors[status] || colors["Default"];
  };

  // Task Categories
  const taskCategories = [
    { tasks: toDoTasks, status: "To Do" },
    { tasks: definedTasks, status: "Defined" },
    { tasks: blockedTasks, status: "Blocked" },
    { tasks: inProgressTasks, status: "In Progress" },
    { tasks: inReviewTasks, status: "In Review" },
  ];

  const submitWorklog = () => {
    const formattedMessage = formatSelectedTasksMessage(selectedTasks);
    console.log(formattedMessage); // Aquí puedes enviar este mensaje donde necesites
    console.log(email);
    console.log(NEXT_DAY_TASK_ID);
    console.log(parseTime("1m"));

    addWorklog(parseTime("1m"), formattedMessage, NEXT_DAY_TASK_ID, email);

    setSelectedTasks([]);
  };

  // Render
  return (
    <div className="flex flex-col w-full h-full mt-4">
      <div className="bg-white shadow-md w-full h-full rounded-xl">
        <ul>
          {taskCategories.map((category, index) => (
            <Tasks
              key={index}
              tasks={category.tasks}
              selectedTasks={selectedTasks}
              getStatusColor={getStatusColor}
              handleTaskClick={handleTaskClick}
            />
          ))}
        </ul>
        <button onClick={submitWorklog}>Enviar Worklog</button>
      </div>
    </div>
  );
};

export default NextDayTasks;
