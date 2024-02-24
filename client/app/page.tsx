"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { ProgressProvider } from "./src/context/ProgressContext";
import PhaseComponent from "./src/components/phase-component";
import Header from "./src/components/header";
import Footer from "./src/components/footer";
import TokenPopup from "./src/components/token-popup";

const Home = () => {
  const user = useUser();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [showTokenPopup, setShowTokenPopup] = useState(false);
  const [jiraApiToken, setJiraApiToken] = useState<any>("")

  useEffect(() => {
    const jiraApiToken = localStorage.getItem("jiraApiToken");
    setJiraApiToken(jiraApiToken);
    if (!jiraApiToken) {
      setShowTokenPopup(true);
    }
  }, []);

  const handleTokenSubmit = (token) => {
    localStorage.setItem("jiraApiToken", token);
    setShowTokenPopup(false);
  };

  const loadUsers = async (email: string, providerUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/users?email=${encodeURIComponent(
          email
        )}&providerUserId=${encodeURIComponent(providerUserId)}&jiraApiToken=${encodeURIComponent(jiraApiToken)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setUsers(data); // Actualiza el estado con los usuarios obtenidos
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async (email: string, providerUserId: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/tasks?email=${encodeURIComponent(
          email
        )}&providerUserId=${encodeURIComponent(providerUserId)}&jiraApiToken=${encodeURIComponent(jiraApiToken)}`
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
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = user?.user?.primaryEmailAddress?.emailAddress;
    const providerUserId = user?.user?.externalAccounts?.[0]?.providerUserId;
    console.log("providerUserId", providerUserId);

    if (email && providerUserId) {
      loadTasks(email, providerUserId);
      loadUsers(email, providerUserId);
    } else {
      console.log("No email or providerUserId available");
    }
  }, [
    user?.user?.primaryEmailAddress?.emailAddress,
    user?.user?.externalAccounts,
  ]);

  if (!user?.user) {
    return null;
  }
  if (!user?.user) {
    return null;
  }

  return (
    <ProgressProvider>
      {showTokenPopup && (
        <TokenPopup onSubmit={handleTokenSubmit} />
      )}
      <div className="bg-gray-300 h-screen overflow-hidden flex flex-col">
        <div className="flex flex-grow">
          <PhaseComponent
            assignedTasks={assignedTasks}
            setAssignedTasks={setAssignedTasks}
            users={users}
          />
        </div>
      </div>
    </ProgressProvider>
  );
};

export default Home;
