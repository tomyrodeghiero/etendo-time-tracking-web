"use client";

import React, { useRef, useState } from "react";
import { Tasks } from "../tasks";
import TaskPopup from "./task-popup";
import { useUser } from "@clerk/nextjs";

const WorkedTasksToday = ({ assignedTasks, setAssignedTasks, users }: any) => {
  const user = useUser();
  const email: any = user?.user?.primaryEmailAddress?.emailAddress;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [searchTask, setSearchTask] = useState(""); // Estado para el término de búsqueda
  const [isFocused, setIsFocused] = useState(false);
  const [showUsers, setShowUsers] = useState(false); // Nuevo estado para controlar la visualización

  // Función para filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter((user: any) =>
    user.displayName.toLowerCase().includes(searchTask.toLowerCase())
  );

  const loadUserTasks = async (userId: string) => {
    try {
      const response = await fetch(
        `/api/tasks?email=${encodeURIComponent(
          email
        )}&providerUserId=${encodeURIComponent(userId)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const tasks = await response.json();

      // Cargar las transiciones para cada tarea
      const tasksWithTransitions: any = await Promise.all(
        tasks.map(async (task: any) => {
          const transitionsResponse = await fetch(
            `/api/issue-transitions?email=${encodeURIComponent(
              email
            )}&issueKey=${encodeURIComponent(task.key)}`
          );
          if (!transitionsResponse.ok) {
            console.error("Error fetching transitions for task:", task.key);
            return task; // Retorna la tarea sin transiciones si falla la solicitud
          }
          const transitions = await transitionsResponse.json();
          return { ...task, transitions }; // Combina la tarea con sus transiciones
        })
      );

      setAssignedTasks(tasksWithTransitions); // Actualiza el estado con las tareas y sus transiciones
      setShowUsers(false);
    } catch (error: any) {
      console.error("Error loading user tasks:", error.message);
    }
  };

  // Renderizado condicional de tarjetas de usuario o tareas
  const renderContent = () => {
    if (showUsers) {
      // Renderiza tarjetas de usuario
      return filteredUsers.map((user: any) => (
        <div
          className="flex w-full bg-white p-4 shadow rounded-l gap-3 cursor-pointer"
          onClick={() => loadUserTasks(user.accountId)}
          key={user.id}
        >
          <img
            src={user.avatarUrls["48x48"]}
            className="h-5 w-5 rounded-full"
            alt={user.displayName}
          />
          <div className="flex flex-col gap-1">
            <h3>{user.displayName}</h3>
            <p>{user.emailAddress}</p>
          </div>
        </div>
      ));
    } else {
      return taskCategories.map((category, index) => (
        <Tasks
          key={index}
          tasks={filteredTasks.filter(
            (task: any) => task.fields.status.name === category.status
          )}
          getStatusColor={getStatusColor}
          handleTaskClick={handleTaskClick}
          user={user}
        />
      ));
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Filtrar tareas basado en el término de búsqueda
  const filteredTasks = assignedTasks.filter((task: any) =>
    task.fields.summary.toLowerCase().includes(searchTask.toLowerCase())
  );

  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTask(event.target.value);
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

  // Functions
  const closePopup = () => {
    setShowPopup(false);
    setSelectedTask(null);
  };

  const getStatusColor = (status: string) => {
    console.log("status 😀 ", status);
    const colors: any = {
      "To Do": "bg-blue-400",
      Blocked: "bg-red-500",
      "In Progress": "bg-yellow-500",
      "In Review": "bg-orange-500",
      QA: "bg-green-500",
      Default: "bg-gray-300",
    };

    return colors[status] || colors["Default"];
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setShowPopup(true);
  };

  // Task Categories
  const taskCategories = [
    { tasks: toDoTasks, status: "To Do" },
    { tasks: definedTasks, status: "Defined" },
    { tasks: blockedTasks, status: "Blocked" },
    { tasks: inProgressTasks, status: "In Progress" },
    { tasks: inReviewTasks, status: "In Review" },
    { tasks: qaTasks, status: "QA" },
  ];

  // Render
  return (
    <div className="flex flex-col w-full h-full mt-4">
      <div className="w-full h-full rounded-xl">
        <div className="w-full flex items-center my-4 justify-between pr-8">
          <div
            className={`relative p-3 rounded-full transition-all duration-1000 ease-in-out ${
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

          <div
            className={`relative p-3 rounded-full transition-all duration-1000 ease-in-out ${
              isFocused ? "w-1/2 rounded-b-md" : "w-12"
            }`}
          >
            <img
              src="/assets/icons/search-user.png"
              alt="Buscar"
              className={`absolute cursor-pointer p-2 rounded-full bg-blue-300 left-4 top-1/2 transform -translate-y-1/2 h-8 w-8 ${
                isFocused && "hidden"
              }`}
              onClick={() => setShowUsers(!showUsers)}
            />
          </div>
        </div>

        <div
          className={`h-[55vh] overflow-y-auto gap-4 w-full grid grid-cols-3`}
        >
          {renderContent()}
        </div>

        {showPopup && <TaskPopup task={selectedTask} onClose={closePopup} />}
      </div>
    </div>
  );
};

export default WorkedTasksToday;
