import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import Dashboard from "pages/dashboard/Dashboard";
import NewGateway from "pages/newGateway/NewGateway";
import DetailsGateway from "pages/detailsGateway/DetailsGateway";
import Nav from "components/Nav";

const App = () => {
  return (
    <StyledEngineProvider injectFirst>
      <BrowserRouter>
        <CssBaseline />
        <Nav />
        <main className="w-full flex flex-col justify-center items-center">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/gateways/new" element={<NewGateway />} />
            <Route path="/gateways/details/:id" element={<DetailsGateway />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </BrowserRouter>
    </StyledEngineProvider>
  );
};

export default App;
