export const addWorklog = (
  time: any,
  comment: any,
  taskKey: any,
  email: string | undefined
) => {
  console.log("taskKey :) ", taskKey);
  const bodyData = JSON.stringify({
    comment: comment,
    time: time,
    taskKey: taskKey,
    email: email,
  });

  fetch("/api/worklog", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: bodyData,
  })
    .then((response) => {
      console.log(`Response: ${response.status} ${response.statusText}`);
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
};
