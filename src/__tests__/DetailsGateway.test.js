import { render, act, screen } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";
import DetailsGateway from "pages/detailsGateway/DetailsGateway";

// Test Data
const gateways = {
  id: "6377bf781a5e3d5be0a91b124",
  serial: "M5-testing",
  name: "Gateway test",
  ipv4: "127.0.0.1",
  peripherals: [
    {
      uid: 1234,
      vendor: "Peripheral test",
      status: "offline",
      _id: "6377bf781a5e3d5be0a91b19",
      date: "2022-11-18T17:23:04.696+00:00",
    },
  ],
};

describe("<DetailsGateway />", () => {
  beforeEach(async () => {
    // Mock the Fetch
    window.fetch = jest.fn();

    fetch.mockResolvedValueOnce(
      Promise.resolve({
        json: () => Promise.resolve(gateways),
        ok: true,
      })
    );
    // Render Dashboard
    await act(() => {
      render(
        <Router>
          <DetailsGateway />
        </Router>
      );
    });
  });

  test("should render form OK", async () => {
    // Form new gateway is render
    const form = screen.getByTestId("form");
    expect(form).toBeInTheDocument();

    // Form title new gateway is New Gateway
    const title = screen.getByTestId("title");
    expect(title).toBeInTheDocument();
    expect(title.textContent).toBe("Gateway Details");

    const addCircleIcon = screen.getByTestId("addCircleIcon");
    expect(addCircleIcon).toBeInTheDocument();

  });

  test("should render DetailsPeripheral OK", async () => {
    
    const deleteBtn = screen.getByTestId("deleteBtn");
    expect(deleteBtn).toBeInTheDocument();

    const uid = screen.getByTestId("uid");
    expect(uid).toBeInTheDocument();
    expect(screen.getByText(gateways.peripherals[0].uid)).toBeInTheDocument();

    const vendor = screen.getByTestId("vendor");
    expect(vendor).toBeInTheDocument();
    expect(screen.getByText(gateways.peripherals[0].vendor)).toBeInTheDocument();

    const status = screen.getByTestId("status");
    expect(status).toBeInTheDocument();
    
    const dateCreated = screen.getByTestId("dateCreated");
    expect(dateCreated).toBeInTheDocument();
  });
});
