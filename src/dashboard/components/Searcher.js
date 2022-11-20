import { Search } from "@mui/icons-material";
import { IconButton, InputBase, Paper } from "@mui/material";

const Searcher = ({ searchString, setSearchString }) => {
  // Render the component
  return (
    <Paper
      className=" w-full md:w-1/2 rounded-16 flex items-center justify-between px-10"
      component="form"
      variant="outlined"
    >
      <InputBase
        data-cy="searchGatewayInput"
        data-testid="searchGatewayInput"
        value={searchString}
        placeholder="Search..."
        inputProps={{ "aria-label": "search file" }}
        onChange={(event) => setSearchString(event.target.value)}
        className=" w-full"
      />
      <IconButton type="submit" aria-label="search">
        <Search />
      </IconButton>
    </Paper>
  );
};

export default Searcher;
