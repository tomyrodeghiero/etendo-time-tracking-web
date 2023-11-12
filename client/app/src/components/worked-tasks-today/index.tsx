"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { TIME } from "../../constants/assets";
import { Tasks } from "../tasks";
import { parseTime } from "../../utils/functions";
import TaskPopup from "./task-popup";
import { useUser } from "@clerk/nextjs";

const WorkedTasksToday = ({ assignedTasks, setAssignedTasks, users }: any) => {
  const user = useUser();
  const email: any = user?.user?.primaryEmailAddress?.emailAddress;

  const [showPopup, setShowPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [improvedInput, setImprovedInput] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [workedTime, setWorkedTime] = useState<string>(""); // Nuevo estado para el tiempo trabajado
  const [searchTask, setSearchTask] = useState(""); // Estado para el término de búsqueda
  const [isFocused, setIsFocused] = useState(false);
  const [showUsers, setShowUsers] = useState(false); // Nuevo estado para controlar la visualización

  // Función para filtrar usuarios basado en el término de búsqueda
  const filteredUsers = users.filter((user: any) =>
    user.displayName.toLowerCase().includes(searchTask.toLowerCase())
  );

  const loadUserTasks = async (userId: string) => {
    console.log("USER ID: ", userId);
    console.log("EMAIL: ", email);

    try {
      const response = await fetch(
        `/api/tasks?email=${encodeURIComponent(
          email
        )}&providerUserId=${encodeURIComponent(userId)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setShowUsers(false);
      setAssignedTasks(data); // Actualiza el estado con las tareas del usuario seleccionado
    } catch (error: any) {
      console.error(error.message);
    }
  };

  // Cambia entre mostrar tareas y usuarios
  const toggleShowUsers = () => setShowUsers(!showUsers);

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
      // Renderiza tareas
      return taskCategories.map((category, index) => (
        <Tasks
          key={index}
          tasks={filteredTasks.filter(
            (task: any) =>
              task.fields.status.statusCategory.name === category.status
          )}
          getStatusColor={getStatusColor}
          handleTaskClick={handleTaskClick}
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

  // Functions
  const closePopup = () => {
    setShowPopup(false);
    setSelectedTask(null);
    setImprovedInput("");
    setDescription("");
  };

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

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setDescription(""); // Limpia el campo de descripción al abrir el popup
    setWorkedTime(""); // Limpia el campo de tiempo trabajado al abrir el popup
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
        <div
          className={`relative p-3 rounded-full mt-4 mb-8 transition-all duration-1000 ease-in-out ${
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
          <img
            src="/assets/icons/search-user.png"
            alt="Buscar Usuarios"
            className={`absolute cursor-pointer rounded-full bg-blue-400 right-4 top-[80%] transform -translate-y-1/2 h-6 w-6`}
            onClick={toggleShowUsers} // Agregar función de clic para cambiar la visualización
          />
        </div>

        <div
          className={`h-[55vh] w-full overflow-y-auto ${
            showUsers && "grid grid-cols-3 gap-4 w-full"
          }`}
        >
          {renderContent()}
        </div>

        {showPopup && <TaskPopup task={selectedTask} onClose={closePopup} />}
      </div>
    </div>
  );
};

export default WorkedTasksToday;
