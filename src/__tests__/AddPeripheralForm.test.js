const { render, screen, act } = require("@testing-library/react");
import { BrowserRouter as Router } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import AddPeripheralForm from "pages/detailsGateway/components/AddPeripheralForm";

describe("<NewGateway /> Load the NewGateway component and make sure everything is correct", () => {
  const mockLogin = jest.fn();

  const formData = [
    {
      uid: '1234',
      vendor: "Peripheral test",
      status: true
    }
  ];

  beforeEach(async () => {
    await act(async () =>
      render(
        <Router>
          <AddPeripheralForm
            onSubmit={mockLogin(formData[0].uid, formData[0].vendor, formData[0].status)}
          />
        </Router>
      )
    );
  });

  test("should render form OK", async () => {
    // Form new gateway is render
    const addPeripheralForm = screen.getByTestId("addPeripheralForm");
    expect(addPeripheralForm).toBeInTheDocument();

    // Form title new gateway is New Gateway
    const addPeripheralFormTitle = screen.getByTestId("addPeripheralFormTitle");
    expect(addPeripheralFormTitle).toBeInTheDocument();
    expect(addPeripheralFormTitle.textContent).toBe("Add Peripheral");
  });

  test("displays uid validation errors", async () => {
    const uid = screen.getByLabelText(/UID/i);
    await act(() => {
      userEvent.type(
        uid,
        '11111111111111111111111111111111111111111111111111'
      );
    });

    expect(
      screen.queryByText(/Should be 20 chars maximum./i)
    ).toBeInTheDocument();

    await act(() => {
      userEvent.clear(uid);
    });

    expect(screen.queryByText(/You must enter a UID./i)).toBeInTheDocument();
  });

  test("displays vendor validation errors", async () => {
    // const serial = screen.getByTestId("serial");
    const vendor = screen.getByLabelText(/vendor/i);
    await act(() => {
      userEvent.type(
        vendor,
        "this@wontgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfg"
      );
    });
    expect(
      screen.queryByText(/Should be 20 chars maximum./i)
    ).toBeInTheDocument();
    await act(() => {
      userEvent.clear(vendor);
    });
    expect(screen.queryByText(/You must enter a vendor./i)).toBeInTheDocument();
  });


  test("button disabled", async () => {
    const buttonSubmit = screen.getByTestId("addpPeripheralFormBtn");
    expect(buttonSubmit).toHaveAttribute("disabled");
  });

  test("form ok, button login enable?", async () => {
    const buttonSubmit = screen.getByTestId("addpPeripheralFormBtn");
    const uid = screen.getByLabelText(/uid/i);
    const vendor = screen.getByLabelText(/vendor/i);

    await act(() => {
      userEvent.type(uid, formData[0].uid);
    });
    await act(() => {
      userEvent.type(vendor, formData[0].vendor);
    });
    expect(buttonSubmit).not.toHaveAttribute("disabled");
  });
});
