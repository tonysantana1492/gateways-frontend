import { Typography } from "@mui/material";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-96">
      <Typography data-cy='notFoundText' data-testid='notFoundText' variant="5">
        Not Found
      </Typography>
    </div>
  );
};

export default NotFound;
