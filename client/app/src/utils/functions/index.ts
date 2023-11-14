export const parseTime = (timeString: string) => {
  const timeRegex = /(\d+d)?\s*(\d+h)?\s*(\d+m)?/;
  const matches = timeString.match(timeRegex);
  if (!matches) {
    return 0;
  }

  let totalSeconds = 0;

  const daysMatch = matches[1];
  const hoursMatch = matches[2];
  const minutesMatch = matches[3];

  if (daysMatch) {
    const days = parseInt(daysMatch.replace("d", ""), 10);
    totalSeconds += days * 24 * 60 * 60;
  }

  if (hoursMatch) {
    const hours = parseInt(hoursMatch.replace("h", ""), 10);
    totalSeconds += hours * 60 * 60;
  }

  if (minutesMatch) {
    const minutes = parseInt(minutesMatch.replace("m", ""), 10);
    totalSeconds += minutes * 60;
  }

  return totalSeconds;
};

export const formatSelectedTasksMessage = (selectedTasks: Array<any>) => {
  let taskForTheNextDayInText = "";

  for (let index = 0; index < selectedTasks.length; index++) {
    const task = selectedTasks[index];

    // Asegúrate de que cada tarea tenga las claves 'keyTask' y 'summary'
    const keyTask = task.key || "Unknown Key";
    const summary = task.fields.summary || "No Summary";

    taskForTheNextDayInText += `${index + 1}. ${keyTask} - ${summary}.\n`;
  }

  return taskForTheNextDayInText;
};

export const formatDate = (dateString: any) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const monthIndex = date.getMonth(); // getMonth() devuelve un índice de 0-11
  const month = months[monthIndex];
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
