const { render, screen, act } = require("@testing-library/react");
const { default: Dashboard } = require("pages/dashboard/Dashboard");
import { BrowserRouter as Router } from "react-router-dom";
import "@testing-library/jest-dom";

describe("<Dashboard /> Load the Dashboard component and make sure everything is correct", () => {
  test("renders Button", async () => {
    // Test Data
    const gateways = [
      {
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
      },
    ];

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
          <Dashboard />
        </Router>
      );
    });

    // Button new gateway is render
    const newGatewayBtn = screen.getByTestId("newGatewayBtn");
    expect(newGatewayBtn).toBeInTheDocument();

    // Input search gateway is render
    const searchGatewayInput = screen.getByTestId("searchGatewayInput");
    expect(searchGatewayInput).toBeInTheDocument();

    // Gateway with id: 6377bf781a5e3d5be0a91b124 is render
    const itemGateway = screen.getByTestId("6377bf781a5e3d5be0a91b124");
    expect(itemGateway).toBeInTheDocument();
    expect(screen.getByText(/M5-testing/i)).toBeInTheDocument();
    expect(screen.getByText(/Gateway test/i)).toBeInTheDocument();
    expect(screen.getByText(/127.0.0.1/i)).toBeInTheDocument();
  });
});
