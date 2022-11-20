import useHttp from "utils/hooks/useHttp";
import { Delete } from "@mui/icons-material";
import { useParams } from "react-router-dom";
const { Paper, Typography, Tooltip, IconButton } = require("@mui/material");

const PeripheralItem = (props) => {
  // Define variables
  const { sendRequest } = useHttp();
  const params = useParams();
  const { id: idGateway } = params;
  const { status, _id: idPeripheral, vendor, date, uid } = props.peripheral;
  const getGateway = props.getGateway;

  const deletePeripheral = async () => {
    // Send delete periheral request
    await sendRequest(
      `api/gateways/${idGateway}/peripherals/${idPeripheral}`,
      "DELETE"
    );

    // Send get gateway details and all its peripherals
    getGateway();
  };

  return (
    <li>
      <Paper
        data-cy={idPeripheral}
        data-testid={idPeripheral}
        className="w-100 h-128 m-16 rounded-20 shadow flex flex-col justify-between"
      >
        <div className="flex items-center justify-between px-4 pt-8">
          <div
            data-cy="status"
            data-testid="status"
            className="flex justify-center items-center"
          >
            <i
              className={`inline-block w-8 h-8 rounded mx-8 ${
                status === "online" ? "bg-green" : "bg-red"
              }`}
            />
            <p>{status}</p>
          </div>
          <Tooltip title="Delete Peripheral" placement="bottom">
            <IconButton
              data-cy="deleteBtn"
              data-testid="deleteBtn"
              
              onClick={deletePeripheral}
            >
              <Delete className="text-15" color="grey" />
            </IconButton>
          </Tooltip>
        </div>

        <Typography
          className="pl-20 pt-20 flex justify-start items-end text-10 font-medium"
          color="textSecondary"
          data-cy="uid"
          data-testid="uid"
        >
          <span className="truncate text-black font-semibold">UID</span>:
          <span className="px-8 ">{uid}</span>
        </Typography>
        <Typography
          className="pl-20 flex justify-start items-end text-10 font-medium"
          color="textSecondary"
          data-cy="vendor"
          data-testid="vendor"
        >
          <span className="truncate text-black font-semibold">Vendor</span>:
          <span className="px-8">{vendor}</span>
        </Typography>

        <Typography
          className="pl-20 pb-20 flex justify-start items-end text-10 font-medium"
          color="textSecondary"
          data-cy="dateCreated"
          data-testid="dateCreated"
        >
          <span className="truncate  text-black font-semibold">Created</span>:
          <span className="px-8">
            {new Date(date).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </Typography>
      </Paper>
    </li>
  );
};

export default PeripheralItem;
