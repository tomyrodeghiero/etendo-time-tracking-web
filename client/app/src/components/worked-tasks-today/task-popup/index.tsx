import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import { parseTime } from "@/app/src/utils/functions";
import { Typography } from "@mui/material";
import { diffWordsWithSpace } from "diff";
import { addWorklog } from "@/app/src/utils/api/jira";
import { useUser } from "@clerk/nextjs";
import ComparisonBar from "../../comparison-bar";

interface TaskPopupProps {
  task: any;
  onClose: () => void;
}

const compareTexts = (original: string, improved: string) => {
  const diff = diffWordsWithSpace(original, improved);
  return diff.map((part: any, index: number) => {
    const style = {
      backgroundColor: part.added
        ? "yellow"
        : part.removed
        ? "lightgrey"
        : "none",
    };
    return (
      <span key={index} style={style}>
        {part.value}
      </span>
    );
  });
};

const TaskPopup: React.FC<TaskPopupProps> = ({ task, onClose }) => {
  const [description, setDescription] = useState<string>("");
  const [workedTime, setWorkedTime] = useState<any>("");
  const [timeRemaining, setTimeRemaining] = useState<any>("");
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [improvedDescription, setImprovedDescription] = useState<string>("");

  const user = useUser();
  const email = user?.user?.primaryEmailAddress?.emailAddress;

  const handleImproveInput = async () => {
    try {
      const response = await fetch("/api/gpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: description }),
      });

      if (response.ok) {
        const responseData = await response.text(); // Asumiendo que la API devuelve un JSON
        setImprovedDescription(responseData); // Actualiza el estado con la respuesta
        setComparisonOpen(true); // Abre el popup de comparación
      } else {
        throw new Error("Error with product completion API");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while improving the description.");
    }
  };

  const handleUseImprovedDescription = () => {
    setDescription(improvedDescription); // Actualiza la descripción con el texto mejorado
    setComparisonOpen(false); // Cierra el diálogo de comparación
  };

  return (
    <>
      <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Time Tracking</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <ComparisonBar logged="10d 4h 1m" estimated="2d" />
            <div className="text-sm">3d 4h 1m logged</div>
            <div className="text-sm">
              The original estimate for this issue was 2d.
            </div>
            <div className="w-full gap-4 flex">
              <TextField
                autoFocus
                margin="dense"
                id="time-spent"
                label="Time spent"
                type="text"
                fullWidth
                variant="outlined"
                value={workedTime}
                onChange={(e) => setWorkedTime(e.target.value)}
                placeholder="e.g. 3h 45m"
              />
              <TextField
                margin="dense"
                id="time-remaining"
                label="Time remaining"
                type="text"
                fullWidth
                variant="outlined"
                value={timeRemaining}
                onChange={(e) => setTimeRemaining(e.target.value)}
                placeholder="e.g. 2h"
              />
            </div>

            <Typography variant="caption" display="block" gutterBottom>
              Use the format: 2w 4d 6h 45m
              <ul>
                <li>w = weeks</li>
                <li>d = days</li>
                <li>h = hours</li>
                <li>m = minutes</li>
              </ul>
            </Typography>

            <TextField
              margin="dense"
              id="work-description"
              label="Work description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the work done..."
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleImproveInput} color="primary">
            Improve with OpenAI
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              addWorklog(parseTime(workedTime), description, task.key, email)
            }
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup de Comparación */}
      {comparisonOpen && improvedDescription && (
        <Dialog open={comparisonOpen} onClose={() => setComparisonOpen(false)}>
          <DialogTitle>Compare Descriptions</DialogTitle>
          <DialogContent>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              {/* Contenedor para la descripción original */}
              <div style={{ width: "48%" }}>
                <Typography variant="h6" gutterBottom>
                  Original Description
                </Typography>
                <div style={{ marginBottom: "20px", whiteSpace: "pre-wrap" }}>
                  {description}
                </div>
              </div>

              {/* Contenedor para la descripción mejorada */}
              <div style={{ width: "48%" }}>
                <Typography variant="h6" gutterBottom>
                  Improved Description
                </Typography>
                <div style={{ marginBottom: "20px", whiteSpace: "pre-wrap" }}>
                  {compareTexts(description, improvedDescription)}
                </div>
              </div>
            </div>

            {/* Área de edición para la descripción mejorada */}
            <TextField
              margin="dense"
              id="improved-description"
              label="Edit Improved Description"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={improvedDescription}
              onChange={(e) => setImprovedDescription(e.target.value)}
              placeholder="Edit the improved description here..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setComparisonOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUseImprovedDescription} color="primary">
              Use Improved Description
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default TaskPopup;
