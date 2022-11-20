import { AddCircle } from "@mui/icons-material";

const { Paper, Typography } = require("@mui/material");

const AddPeripheralButton = (props) => {
  const { handlerAddPeripheralButton } = props;
  return (
    <li>
      <Paper
        data-cy="addCircleIcon"
        data-testid="addCircleIcon"
        className="h-128 m-16 p-20 flex flex-col items-center justify-center rounded-16 shadow hover:shadow-lg outline-none"
        onClick={handlerAddPeripheralButton}
        role="button"
        tabIndex={0}
      >
        <AddCircle className="text-40" color="primary" />

        <Typography
          className="flex w-full h-full justify-center items-center text-12 font-semibold text-center text-gray-500"
          color="inherit"
        >
          Add Peripheral
        </Typography>
      </Paper>
    </li>
  );
};

export default AddPeripheralButton;
