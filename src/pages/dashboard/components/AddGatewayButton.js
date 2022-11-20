import { AddCircle } from "@mui/icons-material";
const { Paper, Typography } = require("@mui/material");

const AddGatewayButton = (props) => {

  // Define the variables
  const { handlerAddGatewayButton } = props;

  // Render the component
  return (
    <li>
      <Paper
      data-cy="newGatewayBtn"
      data-testid="newGatewayBtn"
      className= "h-96 m-16 p-20 flex flex-col items-center justify-center rounded-16 shadow hover:shadow-lg outline-none"
      onClick={handlerAddGatewayButton}
      role="button"
      tabIndex={0}
    >
      <AddCircle        
        className="text-40"
        color="primary"
      />

      <Typography
        className="flex w-full h-full justify-center items-center text-12 font-semibold text-center text-gray-500"
        color="inherit"
      >
        New Gateway
      </Typography>
    </Paper>
    </li>
  );
};

export default AddGatewayButton;
