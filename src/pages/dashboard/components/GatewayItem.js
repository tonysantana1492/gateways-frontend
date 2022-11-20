import { Delete } from "@mui/icons-material";
import { IconButton, Paper, Tooltip, Typography } from "@mui/material";

const GatewayItem = (props) => {
  // Define the variables
  const { serial, name, ipv4, id } = props.gateway;
  const handlerClickListItem = props.handlerClickListItem;
  const handlerDeleteGateway = props.handlerDeleteGateway;

  // Render the component
  return (
    <Paper
      className="flex flex-col items-center justify-center border-t-2 border-blue-300 min-w-160 h-96 rounded-12 m-10 shadow hover:shadow-lg outline-none"
      data-cy={id}
      data-testid={id}
      onClick={handlerClickListItem.bind(null, id)}
      role="button"
    >
      <div className="pt-5 px-10 flex justify-between items-center w-full">
        <Typography className=" text-10 font-medium" color="textSecondary">
          <span className="truncate text-blue font-semibold">{ipv4}</span>
        </Typography>
        <Tooltip title="Delete Gateway" placement="bottom">
          <IconButton
            className=" z-9999"
            data-cy="deleteBtn"
            data-testid="deleteBtn"
            onClick={(ev) => {
              ev.stopPropagation();
              handlerDeleteGateway(id);
            }}
          >
            <Delete className="text-15" color="grey" />
          </IconButton>
        </Tooltip>
      </div>
      <div className="flex flex-col p-10">
        <Typography className=" text-10 font-medium" color="textSecondary">
          <span className="truncate  text-black font-semibold">Serial</span>:
          <span className="px-8 ">{serial}</span>
        </Typography>
        <Typography className="text-10 font-medium" color="textSecondary">
          <span className="truncate text-black font-semibold">Name</span>:
          <span className="px-8">{name}</span>
        </Typography>

        <div className="w-full flex justify-end items-center border-t-1 border-grey-300 pt-5">
          <Typography className="w-full text-right text-10 text-gray font-semibold">
            {`${props.gateway.peripherals.length ?? "0"} of 10 peripherals`}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

export default GatewayItem;
