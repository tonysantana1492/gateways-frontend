import React, { useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import useHttp from "utils/hooks/useHttp";
import { useNavigate } from "react-router-dom";

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

const NewGateway = () => {
  const navigate = useNavigate();

  // Custom hook useHttp
  const {
    isLoading: isLoadingNewGateway,
    sendRequest: newGatewayRequest,
    error: errorNewGateway,
  } = useHttp();

  const { control, formState, handleSubmit, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const handleNewGateway = async (model) => {
    // Send request for create a new gateway

    try {
      const createdGateway = await newGatewayRequest(
        "api/gateways",
        "POST",
        model
      );

      // ID of de new gateway
      const idCreatedGateway = createdGateway.id;

      // If response is succesfully redirect to this gateway details.
      if (createdGateway) {
        navigate(`/gateways/details/${idCreatedGateway}`, { replace: true });
      }
    } catch (err) {}
  };

  // Execute when error change
  useEffect(() => {
    if (errorNewGateway) {
      const fields = errorNewGateway.fields;

      // Set Errors in the form
      Object.entries(fields).forEach(([key, value]) => {
        setError(key, {
          type: "manual",
          message: value,
        });
      });
    }
    // eslint-disable-next-line
  }, [errorNewGateway, setError]);

  // Return the form
  return (
    <Paper className="flex flex-col items-center justify-center p-20 w-full max-w-screen-sm rounded-16 shadow-lg outline-none">
      <Typography
        data-cy="newGatewayFormTitle"
        data-testid="newGatewayFormTitle"
        className="w-full text-left text-15 text-blue-800 font-normal mb-20"
      >
        New Gateway
      </Typography>
      <form
        data-cy="newGatewayForm"
        data-testid="newGatewayForm"
        className="flex gap-9 flex-col justify-center w-full"
        onSubmit={handleSubmit(handleNewGateway)}
      >
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

        <div className="flex justify-end w-full mt-20">
          <Button
            type="submit"
            className="w-20 disabled:bg-gray-200 bg-blue hover:bg-blue text-gray-50"
            data-cy="saveBtn"
            data-testid="saveBtn"
            aria-label="SAVE"
            disabled={
              dirtyFields.length === 0 || !isValid || isLoadingNewGateway
            }
            value="saveBtn"
          >
            {isLoadingNewGateway ? "Loading..." : "Save"}
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default NewGateway;
