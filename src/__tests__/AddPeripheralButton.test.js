const { render, screen } = require("@testing-library/react");
const {
  default: AddPeripheralButton,
} = require("pages/detailsGateway/components/AddPeripheralButton");

describe("<AddPeripheralButton />", () => {
  test("renders AddPeripheralButton", () => {
    const { getByText } = render(<AddPeripheralButton />);
    getByText("Add Peripheral");
    
    const addCircleIcon = screen.getByTestId("addCircleIcon");
    expect(addCircleIcon).toBeInTheDocument();
  });
});
