import express from "express";
import fetch from "node-fetch";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";

const app = express();
const port = 5001;

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(express.json()); // Para parsear el body de las requests JSON

app.get("/api/tasks", async (req, res) => {
  try {
    // Obtiene el email de la query string
    const { email, providerUserId } = req.query;

    console.log("email", email);
    console.log("providerUserId", providerUserId);

    const JIRA_TOKEN =
      "ATATT3xFfGF0gLFWgxUeaOAjfiKwdRgnkXbvsWg5tt2RSEkuKuHd7srKYvIZebC2jjKgxVYuLW-4XX5Kc1ogEcFrLGanJWM6OvzWKNr69cf1ugedxHMsqe2eHVE2XB95D0IZgYylT0T8cjrZh8WnMmvCQWIupWBnPMztiRJ5Wfp_kHgGyaMvCAc=598C84FC";

    // Ejemplo de uso del token
    const jiraUrl = `https://etendoproject.atlassian.net/rest/api/3/search?jql=assignee = ${providerUserId} AND statusCategory != "Done"`;

    const response = await fetch(jiraUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${email}:ATATT3xFfGF0gLFWgxUeaOAjfiKwdRgnkXbvsWg5tt2RSEkuKuHd7srKYvIZebC2jjKgxVYuLW-4XX5Kc1ogEcFrLGanJWM6OvzWKNr69cf1ugedxHMsqe2eHVE2XB95D0IZgYylT0T8cjrZh8WnMmvCQWIupWBnPMztiRJ5Wfp_kHgGyaMvCAc=598C84FC`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }

    const data = await response.json();
    res.status(200).json(data.issues);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Failed to fetch data");
  }
});

app.post("/api/worklog", async (req, res) => {
  const { comment, time, taskKey, email } = req.body; // Recibe los datos directamente

  const bodyData = JSON.stringify({
    comment: {
      content: [
        {
          content: [
            {
              text: comment,
              type: "text",
            },
          ],
          type: "paragraph",
        },
      ],
      type: "doc",
      version: 1,
    },
    timeSpentSeconds: time,
  });

  const jiraUrl = `https://etendoproject.atlassian.net/rest/api/3/issue/${taskKey}/worklog`;

  try {
    const response = await fetch(jiraUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${email}:ATATT3xFfGF0gLFWgxUeaOAjfiKwdRgnkXbvsWg5tt2RSEkuKuHd7srKYvIZebC2jjKgxVYuLW-4XX5Kc1ogEcFrLGanJWM6OvzWKNr69cf1ugedxHMsqe2eHVE2XB95D0IZgYylT0T8cjrZh8WnMmvCQWIupWBnPMztiRJ5Wfp_kHgGyaMvCAc=598C84FC`
        ).toString("base64")}`,
      },
      body: bodyData,
    });

    const text = await response.text();

    res.status(response.status).send(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // Obtiene el email de la query string
    const { email } = req.query;
    console.log("email", email);

    const jiraUrl =
      "https://etendoproject.atlassian.net/rest/api/2/user/assignable/search?project=INT&maxResults=200";

    const response = await fetch(jiraUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${email}:ATATT3xFfGF0gLFWgxUeaOAjfiKwdRgnkXbvsWg5tt2RSEkuKuHd7srKYvIZebC2jjKgxVYuLW-4XX5Kc1ogEcFrLGanJWM6OvzWKNr69cf1ugedxHMsqe2eHVE2XB95D0IZgYylT0T8cjrZh8WnMmvCQWIupWBnPMztiRJ5Wfp_kHgGyaMvCAc=598C84FC`
        ).toString("base64")}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const users = await response.json();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("Failed to fetch users");
  }
});
``;

app.post("/api/gpt", async (req, res) => {
  try {
    const { content } = req.body;

    // Crear un prompt combinando la instrucción del sistema con el contenido proporcionado
    const prompt =
      "Eres un asistente virtual que mejora y embellece las descripciones de los registros de trabajo, haciéndolas más claras, concisas y profesionales. " +
      "Por favor, redacta en primera persona lo que el trabajador realizó hoy.";

    // Asegúrate de que estás usando el modelo correcto y la estructura de mensaje correcta
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: content },
      ],
    });

    // Acceder a la respuesta de la API correctamente
    const apiResponse = response.data.choices[0].message.content;
    res.send(apiResponse);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Get transitions
app.get("/api/issue-transitions", async (req, res) => {
  try {
    const { issueKey, email } = req.query;

    const jiraUrl = `https://etendoproject.atlassian.net/rest/api/3/issue/${issueKey}/transitions`;

    const response = await fetch(jiraUrl, {
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${email}:ATATT3xFfGF0gLFWgxUeaOAjfiKwdRgnkXbvsWg5tt2RSEkuKuHd7srKYvIZebC2jjKgxVYuLW-4XX5Kc1ogEcFrLGanJWM6OvzWKNr69cf1ugedxHMsqe2eHVE2XB95D0IZgYylT0T8cjrZh8WnMmvCQWIupWBnPMztiRJ5Wfp_kHgGyaMvCAc=598C84FC`
        ).toString("base64")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok: " + response.statusText);
    }

    const transitions = await response.json();
    res.status(200).json(transitions);
  } catch (error) {
    console.error("Error fetching issue transitions:", error);
    res.status(500).send("Failed to fetch issue transitions");
  }
});

// Change issue status
app.post("/api/change-issue-status", async (req, res) => {
  try {
    const { issueKey, transitionId, email } = req.body; // Recibe los datos directamente

    const jiraUrl = `https://etendoproject.atlassian.net/rest/api/3/issue/${issueKey}/transitions`;

    const bodyData = JSON.stringify({
      transition: {
        id: transitionId,
      },
    });

    const response = await fetch(jiraUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${email}:ATATT3xFfGF0gLFWgxUeaOAjfiKwdRgnkXbvsWg5tt2RSEkuKuHd7srKYvIZebC2jjKgxVYuLW-4XX5Kc1ogEcFrLGanJWM6OvzWKNr69cf1ugedxHMsqe2eHVE2XB95D0IZgYylT0T8cjrZh8WnMmvCQWIupWBnPMztiRJ5Wfp_kHgGyaMvCAc=598C84FC`
        ).toString("base64")}`,
      },
      body: bodyData,
    });

    if (!response.ok) {
      throw new Error(`Error changing issue status: ${response.statusText}`);
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (error) {
    console.error("Error changing issue status:", error);
    res.status(500).send("Failed to change issue status");
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
