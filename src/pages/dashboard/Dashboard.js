import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import useHttp from "utils/hooks/useHttp";
import Loading from "pages/loading/Loading";
import Searcher from "./components/Searcher";
import Gateway from "./components/GatewayItem";
import AddGatewayButton from "./components/AddGatewayButton";

const Dashboard = () => {
  const navigate = useNavigate();

  // Load gateways
  const {
    isLoading: isLoadingGateways,
    sendRequest: gatewaysRequest,
    data: gateways = [],
  } = useHttp();

  // Delete a gateway
  const {
    isLoading: isLoadingDeleteGateway,
    sendRequest: deleteGatewayRequest,
  } = useHttp();

  // States for handler search field
  const [searchString, setSearchString] = useState("");
  const filteredGateways = gateways
    ? gateways.filter(
        (s) =>
          s.name.toLowerCase().startsWith(searchString.toLowerCase()) ||
          s.serial.toLowerCase().startsWith(searchString.toLowerCase()) ||
          s.ipv4.toLowerCase().startsWith(searchString.toLowerCase())
      )
    : [];

  // Get from de server all Gateways
  const getAllGateways = useCallback(() => {
    gatewaysRequest(`api/gateways`, "GET");
  }, [gatewaysRequest]);

  // Execute when the page is reload or load
  useEffect(() => {
    getAllGateways();
  }, [getAllGateways]);

  // Handler Show Details of a Gateway
  const handlerClickListItem = (id) => {
    navigate(`/gateways/details/${id}`);
  };

  // Handler Delete a Gateway
  const handlerDeleteGateway = async (id) => {
    await deleteGatewayRequest(`api/gateways/${id}`, "DELETE");
    getAllGateways();
  };

  // Handler Add a Gateway
  const handlerAddGatewayButton = () => {
    navigate("/gateways/new");
  };

  // Return loading
  if (isLoadingGateways || isLoadingDeleteGateway) {
    return <Loading />;
  }

  // Render the component
  return (
    <div className="w-full p-10 flex flex-col justify-center items-center">
      <Searcher
        searchString={searchString}
        setSearchString={setSearchString}
      ></Searcher>

      <ul className="grid grid-cols-1 md:grid-cols-4 items-center gap-4 w-full mt-10">
        <AddGatewayButton handlerAddGatewayButton={handlerAddGatewayButton} />
        {filteredGateways.map((item) => {
          return (
            <Gateway
              key={item.id}
              handlerClickListItem={handlerClickListItem}
              handlerDeleteGateway={handlerDeleteGateway}
              gateway={item}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Dashboard;
