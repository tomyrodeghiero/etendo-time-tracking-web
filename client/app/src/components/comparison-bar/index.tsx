import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { parseTime } from "../../utils/functions";

// No se limita el progreso al 100%
const calculateProgress = (logged: string, estimated: string) => {
  // Convertir todo a minutos para un cálculo más sencillo
  const totalLogged = parseTime(logged);
  const totalEstimated = parseTime(estimated);

  // Calcular porcentaje
  const progress = (totalLogged / totalEstimated) * 100;
  return progress; // Ahora puede ser mayor que 100
};

const ComparisonBar = ({ logged, estimated }: any) => {
  const progress = calculateProgress(logged, estimated);

  // Cambiar el color de la barra si el progreso es mayor que 100
  const barColor = progress <= 100 ? "primary" : "secondary";

  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <Tooltip title={`${logged} / ${estimated} estimated`} arrow>
          <LinearProgress
            variant="determinate"
            value={progress <= 100 ? progress : 100}
            color={barColor}
          />
        </Tooltip>
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          progress
        )}%`}</Typography>
      </Box>
    </Box>
  );
};

export default ComparisonBar;
