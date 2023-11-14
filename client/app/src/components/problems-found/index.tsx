import React, { useState } from "react";
import { addWorklog } from "../../utils/api/jira"; // Asegúrate de que esta importación sea correcta
import { TextField } from "@mui/material";
import { parseTime } from "../../utils/functions";
import { PROBLEMS_FOUND_TASK_ID } from "../../utils/constants";
import { useUser } from "@clerk/nextjs";

const ProblemsFound = () => {
  const user = useUser();
  const email: any = user.user?.primaryEmailAddress?.emailAddress;
  const [problems, setProblems] = useState("");

  const handleInputChange = (event: any) => {
    setProblems(event.target.value);
  };

  const handleSubmit = () => {
    console.log("Problemas Encontrados:", problems);
    // Enviar worklog a la tarea INT-5612
    addWorklog(
      parseTime("1m"), // Ajusta según necesites
      problems,
      PROBLEMS_FOUND_TASK_ID,
      email // Cambia por el email real o una variable
    );
  };

  return (
    <div className="w-full my-8 h-[90%]">
      <TextField
        fullWidth
        label="Problemas Encontrados"
        variant="outlined"
        multiline
        value={problems}
        className="h-full"
        onChange={handleInputChange}
        placeholder="Describe los problemas encontrados..."
        InputProps={{
          style: {
            height: "100%",
            alignItems: "flex-start", // Alinea el contenido al inicio verticalmente
          },
          inputProps: {
            style: {
              height: "100%",
              paddingTop: 0, // Asegúrate de que no haya relleno adicional en la parte superior
            },
          },
        }}
      />
      <button
        onClick={handleSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Enviar
      </button>
    </div>
  );
};

export default ProblemsFound;
