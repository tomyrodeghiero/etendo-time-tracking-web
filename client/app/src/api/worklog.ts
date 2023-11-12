export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { comment, time, taskKey } = req.body;

  const bodyData = JSON.stringify({
    comment: comment,
    time: time,
    taskKey: taskKey,
  });

  const serverUrl = `${process.env.SERVER_URL}/api/worklog`; // Asume que tienes una variable de entorno para tu servidor Express

  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    });

    const text = await response.text();
    console.log(`Response: ${response.status} ${response.statusText}`);
    console.log(text);

    res.status(response.status).json(text);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
