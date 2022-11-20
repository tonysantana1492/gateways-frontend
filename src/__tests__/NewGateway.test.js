const { render, screen, act } = require("@testing-library/react");
import { BrowserRouter as Router } from "react-router-dom";
import NewGateway from "pages/newGateway/NewGateway";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

describe("<NewGateway /> Load the NewGateway component and make sure everything is correct", () => {
  const mockLogin = jest.fn();

  const formData = [
    {
      serial: "M5-testing",
      name: "Gateway test",
      ipv4: "127.0.0.1",
    },
  ];

  beforeEach(async () => {
    await act(async () =>
      render(
        <Router>
          <NewGateway
            onSubmit={mockLogin(
              formData[0].serial,
              formData[0].name,
              formData[0].ipv4
            )}
          />
        </Router>
      )
    );
  });

  test("should render form OK", async () => {
    // Form new gateway is render
    const newGatewayForm = screen.getByTestId("newGatewayForm");
    expect(newGatewayForm).toBeInTheDocument();

    // Form title new gateway is New Gateway
    const newGatewayFormTitle = screen.getByTestId("newGatewayFormTitle");
    expect(newGatewayFormTitle).toBeInTheDocument();
    expect(newGatewayFormTitle.textContent).toBe("New Gateway");
  });

  test("displays serial validation errors", async () => {
    // const serial = screen.getByTestId("serial");
    const serial = screen.getByLabelText(/serial/i);
    await act(() => {
      userEvent.type(
        serial,
        "this@wontgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfg"
      );
    });
    expect(
      screen.queryByText(/Should be 40 chars maximum./i)
    ).toBeInTheDocument();
    await act(() => {
      userEvent.clear(serial);
    });
    expect(screen.queryByText(/You must enter a serial./i)).toBeInTheDocument();
  });

  test("displays name validation errors", async () => {
    // const serial = screen.getByTestId("serial");
    const name = screen.getByLabelText(/name/i);
    await act(() => {
      userEvent.type(
        name,
        "this@wontgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfgfg"
      );
    });
    expect(
      screen.queryByText(/Should be 40 chars maximum./i)
    ).toBeInTheDocument();
    await act(() => {
      userEvent.clear(name);
    });
    expect(screen.queryByText(/You must enter a name./i)).toBeInTheDocument();
  });

  test("displays ipv4 validation errors", async () => {
    // const serial = screen.getByTestId("serial");
    const ipv4 = screen.getByLabelText(/IP/i);
    await act(() => {
      userEvent.type(ipv4, "not valid");
    });
    expect(
      screen.queryByText(/You must enter a v4 valid IP./i)
    ).toBeInTheDocument();
    await act(() => {
      userEvent.clear(ipv4);
    });
    expect(screen.queryByText(/Please enter an IP./i)).toBeInTheDocument();
  });

  test("button disabled", async () => {
    const buttonSubmit = screen.getByTestId("saveBtn");
    expect(buttonSubmit).toHaveAttribute("disabled");
  });

  test("form ok, button login enable?", async () => {
    const buttonSubmit = screen.getByRole("button");
    const serial = screen.getByLabelText(/serial/i);
    const name = screen.getByLabelText(/name/i);
    const ipv4 = screen.getByLabelText(/ip/i);

    await act(() => {
      userEvent.type(serial, formData[0].serial);
    });
    await act(() => {
      userEvent.type(name, formData[0].name);
    });
    await act(() => {
      userEvent.type(ipv4, formData[0].ipv4);
    });
    expect(buttonSubmit).not.toHaveAttribute("disabled");
  });
});
