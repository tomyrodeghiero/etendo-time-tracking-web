"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import Header from "../src/components/header";
import PhaseComponent from "../src/components/phase-component";
import Footer from "../src/components/footer";
import { ProgressProvider, useProgress } from "../src/context/ProgressContext";
import { Stepper, Step, StepLabel, Typography } from "@mui/material";
import { STEPS } from "../src/utils/constants";

const DashboardPage = () => {
  const user = useUser();
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log("user.user", user?.user);

  // Esta función se ejecutará dentro de useEffect
  const loadTasks = async (email: any) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/tasks?email=${encodeURIComponent(email)}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setAssignedTasks(data); // Actualiza el estado con las tareas obtenidas
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const email = user?.user?.primaryEmailAddress?.emailAddress;

    if (email) {
      loadTasks(email);
    } else {
      console.log("No email available");
    }
  }, [user?.user?.primaryEmailAddress?.emailAddress]); // Dependencia de useEffect

  if (!user?.user) {
    return null;
  }
  if (!user?.user) {
    return null;
  }

  return (
    <ProgressProvider>
      <div className="bg-gray-300 h-screen overflow-hidden">
        <div className="h-[87.5vh]">
          <Header firstName={user?.user?.firstName} />
          <PhaseComponent assignedTasks={assignedTasks} />
        </div>
        <div className="h-[12.5vh]">
          <Footer />
        </div>
      </div>
    </ProgressProvider>
  );
};

export default DashboardPage;
