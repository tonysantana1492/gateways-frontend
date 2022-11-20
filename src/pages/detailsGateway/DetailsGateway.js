import React, { useCallback, useEffect, useState } from "react";
import { TextField, Button, Typography, CircularProgress } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import useHttp from "utils/hooks/useHttp";
import { useParams } from "react-router-dom";
import Loading from "pages/loading/Loading";
import NotFound from "pages/notFound/NotFound";
import AddPeripheralForm from "./components/AddPeripheralForm";
import AddPeripheralButton from "./components/AddPeripheralButton";
import DetailsPeripheral from "./components/PeripheralItem";

const schema = yup.object().shape({
  serial: yup
    .string()
    .required("You must enter a serial.")
    .max(40, "Should be 40 chars maximum."),
  name: yup
    .string()
    .required("You must enter a name.")
    .max(40, "Should be 40 chars maximum."),
  ipv4: yup
    .string()
    .required("Please enter an IP.")
    .matches(/^(\d{1,3}\.){3}\d{1,3}$/, "You must enter a v4 valid IP."),
});

const defaultValues = {
  serial: "",
  name: "",
  ipv4: "",
};

const DetailsGateway = () => {
  // Defines variables
  const params = useParams();
  const idGateway = params.id;

  // Define state variables
  const [showAddGatewayButton, setShowAddGatewayButton] = useState(true);

  // Form variables
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  // Edit gateway
  const {
    isLoading: isLoadingEditGateway,
    sendRequest: editGatewayRequest,
    error: errorEditGateway,
  } = useHttp();

  // Load gateway details
  const {
    isLoading: isLoadingDetailsGateway,
    sendRequest: detailsGatewayRequest,
    data: detailsGateway,
  } = useHttp();

  // Is executed when the form submit
  const handleEditGateway = async (model) => {
    await editGatewayRequest(`api/gateways/${idGateway}`, "PUT", model);
  };

  // Hide AddGatewayButton and Show the AddGatewayForm
  const handlerAddPeripheralButton = () => {
    setShowAddGatewayButton(false);
  };

  // Show AddGatewayButton and Hide the AddGatewayForm
  const handlerCancelAddPeripheral = () => {
    setShowAddGatewayButton(true);
  };

  // Get fromn the server gateway detail and all its peripheral
  const getGateway = useCallback(() => {
    detailsGatewayRequest(`api/gateways/${idGateway}/peripherals`, "GET").then(
      (response) => {
        // Load the values on the form by default
        if (response) {
          setValue("serial", response.serial, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("name", response.name, {
            shouldDirty: true,
            shouldValidate: true,
          });
          setValue("ipv4", response.ipv4, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      }
    );
  }, [detailsGatewayRequest, idGateway, setValue]);

  // Execute when error change at edit a gateway
  useEffect(() => {
    if (errorEditGateway) {
      const fields = errorEditGateway.fields;

      // Set Errors in the form
      Object.entries(fields).forEach(([key, value]) => {
        setError(key, {
          type: "manual",
          message: value,
        });
      });
    }
  }, [errorEditGateway, setError]);

  // Execute when the page is reload or load
  useEffect(() => {
    getGateway();
  }, [getGateway]);

  // Return loading
  if (isLoadingDetailsGateway) {
    return <Loading />;
  }

  // No found the gateway by id
  if (!isLoadingDetailsGateway && !detailsGateway) {
    return <NotFound />;
  }

  // Render the component
  return (
    <div className="flex flex-col gap-9 justify-center items-center">
      <div className="flex flex-col items-center p-20 justify-center border-b-1 w-full border-grey-400">
        <div className="flex justify-between items-center w-full mb-10">
          <Typography
            data-cy="title"
            data-testid="title"
            className="w-full text-left text-15 text-blue-800 font-normal"
          >
            Gateway Details
          </Typography>
          <Typography className="w-full text-right text-10 text-gray font-semibold">
            {`${detailsGateway.peripherals.length ?? "0"} of 10 peripherals`}
          </Typography>
        </div>
        <form
          data-cy="form"
          data-testid="form"
          className="flex gap-9 flex-col justify-center w-full"
          onSubmit={handleSubmit(handleEditGateway)}
        >
          <div className="flex gap-9 flex-col md:flex-row justify-center w-full">
            <Controller
              name="serial"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete="serial"
                  data-cy="serial"
                  data-testid="serial"
                  type="text"
                  label="Serial"
                  error={!!errors.serial}
                  helperText={errors?.serial?.message}
                  variant="outlined"
                  required
                />
              )}
            />

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete="name"
                  data-cy="name"
                  data-testid="name"
                  type="name"
                  label="Name"
                  error={!!errors.name}
                  helperText={errors?.name?.message}
                  variant="outlined"
                  required
                />
              )}
            />

            <Controller
              name="ipv4"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoComplete="ipv4"
                  data-cy="ipv4"
                  data-testid="ipv4"
                  type="ipv4"
                  label="IP"
                  placeholder="xxx.xxx.xxx.xxx"
                  error={!!errors.ipv4}
                  helperText={errors?.ipv4?.message}
                  variant="outlined"
                  required
                />
              )}
            />
          </div>
          <div className="flex justify-end w-full">
            <Button
              type="submit"
              className="h-28 disabled:bg-gray-200 bg-blue hover:bg-blue text-gray-50"
              data-cy="saveBtn"
              data-testid="saveBtn"
              aria-label="SAVE"
              disabled={
                dirtyFields.length === 0 || !isValid || isLoadingEditGateway
              }
              value="saveBtn"
            >
              {isLoadingEditGateway ? <CircularProgress size={24} className='w-10 text-blue' /> : "Save"}
            </Button>
          </div>
        </form>
      </div>
      {!showAddGatewayButton && detailsGateway.peripherals.length < 10 && (
        <AddPeripheralForm
          getGateway={getGateway}
          handlerCancelAddPeripheral={handlerCancelAddPeripheral}
        />
      )}

      <ul className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 w-full">
        {showAddGatewayButton && detailsGateway.peripherals.length < 10 && (
          <AddPeripheralButton
            handlerAddPeripheralButton={handlerAddPeripheralButton}
          />
        )}
        {detailsGateway.peripherals.map((item) => {
          return (
            <DetailsPeripheral
              key={item._id}
              peripheral={item}
              getGateway={getGateway}
              handlerCancelAddPeripheral={handlerCancelAddPeripheral}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default DetailsGateway;
