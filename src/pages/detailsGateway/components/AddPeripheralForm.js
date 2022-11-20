import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Typography,
  Switch,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import useHttp from "utils/hooks/useHttp";
import { useParams } from "react-router-dom";

const schema = yup.object().shape({
  uid: yup
    .string()
    .max(20, "Should be 20 chars maximum.")
    .required("You must enter a UID."),
  vendor: yup
    .string()
    .required("You must enter a vendor.")
    .max(20, "Should be 20 chars maximum."),
});

const defaultValues = {
  uid: "",
  vendor: "",
  status: "",
};

const AddPeripheralForm = (props) => {
  // Define variables
  const params = useParams();
  const idGateway = params.id;
  const getGateway = props.getGateway;
  const handlerCancelAddPeripheral = props.handlerCancelAddPeripheral;

  // Custom hook useHttp
  const {
    isLoading: isLoadingNewPeripheral,
    sendRequest: newPeripheralRequest,
    error: errorNewPeripheral,
  } = useHttp();

  // Variables of the form
  const { control, formState, handleSubmit, setError } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  // Handle a new peripheral
  const handleNewPeripheral = async (model) => {
    // Send request for create a new Peripheral
    await newPeripheralRequest(
      `api/gateways/${idGateway}/peripherals`,
      "POST",
      model
    );

    getGateway();
  };

  // Execute when error change
  useEffect(() => {
    if (errorNewPeripheral) {
      const fields = errorNewPeripheral.fields;

      // Set Errors in the form
      Object.entries(fields).forEach(([key, value]) => {
        setError(key, {
          type: "manual",
          message: value,
        });
      });
    }
  }, [errorNewPeripheral, setError]);

  // Return the form
  return (
    <div className="flex items-center my-30 p-20 justify-center border-b-1 w-full border-grey-400">
      <form
        data-cy="addPeripheralForm"
        data-testid="addPeripheralForm"
        className="flex flex-col gap-9 justify-center w-full"
        onSubmit={handleSubmit(handleNewPeripheral)}
      >
        <div className="flex justify-between items-center">
          <Typography
            data-cy="addPeripheralFormTitle"
            data-testid="addPeripheralFormTitle"
            className="text-left text-15 text-blue-800 font-normal"
          >
            Add Peripheral
          </Typography>
          <div className="flex flex-col md:flex-row gap-9 justify-end items-center">
            <Button
              type="button"
              data-cy="cancelBtn"
              data-testid="cancelBtn"
              color="primary"
              aria-label="Cancel"
              value="cancelBtn"
              onClick={handlerCancelAddPeripheral}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-cy="addpPeripheralFormBtn"
              data-testid="addpPeripheralFormBtn"
              className="w-20 disabled:bg-gray-200 bg-blue hover:bg-blue text-gray-50"
              aria-label="SAVE"
              disabled={
                dirtyFields.length === 0 || !isValid || isLoadingNewPeripheral
              }
              value="addpPeripheralBtn"
            >
              {isLoadingNewPeripheral ? "Loading..." : "Save"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-9 justify-center">
          <Controller
            name="uid"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoComplete="uid"
                data-cy="uidAdd"
                data-testid="uidAdd"
                type="number"
                label="UID"
                error={!!errors.uid}
                helperText={errors?.uid?.message}
                variant="outlined"
                required
              />
            )}
          />
          <Controller
            name="vendor"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                autoComplete="vendor"
                data-cy="vendorAdd"
                data-testid="vendorAdd"
                type="text"
                label="Vendor"
                error={!!errors.vendor}
                helperText={errors?.vendor?.message}
                variant="outlined"
                required
              />
            )}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography>Offline</Typography>
                <Switch
                  {...field}
                  data-cy="statusSwitch"
                />
                <Typography>Online</Typography>
              </Stack>
            )}
          />
        </div>
      </form>
    </div>
  );
};

export default AddPeripheralForm;
