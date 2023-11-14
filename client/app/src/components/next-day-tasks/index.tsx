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
  const [isFocused, setIsFocused] = useState(false);
  const [showUsers, setShowUsers] = useState(false); // Nuevo estado para controlar la visualización
  const [searchTask, setSearchTask] = useState(""); // Estado para el término de búsqueda
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTask(event.target.value);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTasks((prevTasks: any) => {
      const taskIndex = prevTasks.findIndex((t: any) => t.id === task.id);
      if (taskIndex > -1) {
        // Si la tarea ya está seleccionada, remueve la tarea
        return prevTasks.filter((t: any) => t.id !== task.id);
      } else {
        // Si la tarea no está seleccionada, agrega la tarea
        return [...prevTasks, task];
      }
    });
  };

  // Filter tasks
  const toDoTasks = assignedTasks.filter(
    (task: any) => task.fields.status.name === "To Do"
  );
  const definedTasks = assignedTasks.filter(
    (task: any) => task.fields.status.name === "Defined"
  );
  const blockedTasks = assignedTasks.filter(
    (task: any) => task.fields.status.name === "Blocked"
  );
  const inProgressTasks = assignedTasks.filter(
    (task: any) => task.fields.status.name === "In Progress"
  );
  const inReviewTasks = assignedTasks.filter(
    (task: any) => task.fields.status.name === "In Review"
  );
  const qaTasks = assignedTasks.filter(
    (task: any) => task.fields.status.name === "QA"
  );

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

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Render
  return (
    <div className="flex flex-col w-full h-full mt-4">
      <div
        className={`relative p-3 my-4 rounded-full transition-all duration-1000 ease-in-out ${
          isFocused ? "w-1/2 rounded-b-md" : "w-12"
        }`}
        onClick={handleFocus}
      >
        <img
          src="/assets/icons/search.png"
          alt="Buscar"
          className={`absolute cursor-pointer p-2 rounded-full bg-blue-300 left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
            isFocused && "hidden"
          }`}
        />
        <input
          type="text"
          placeholder={isFocused ? "Buscar tarea..." : ""}
          value={searchTask}
          onChange={handleSearchChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`absolute inset-0 w-full p-5 bg-blue-300 text-gray-700 placeholder-gray-600 rounded-sm focus:outline-none transition-all duration-300 ease-in-out ${
            isFocused ? "opacity-100" : "opacity-0 w-0"
          }`}
        />
      </div>
      <div className={`h-[55vh] overflow-y-auto gap-4 w-full grid grid-cols-3`}>
        {taskCategories.map((category, index) => (
          <Tasks
            key={index}
            tasks={category.tasks}
            selectedTasks={selectedTasks}
            getStatusColor={getStatusColor}
            handleTaskClick={handleTaskClick}
          />
        ))}
        <button onClick={submitWorklog}>Enviar Worklog</button>
      </div>
    </div>
  );
};

export default NextDayTasks;
