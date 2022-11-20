import { Typography } from "@mui/material";

const Nav = () => {
  return (
    <div className="flex justify-start items-center bg-black w-full h-36 border-b-1 border-grey-400">
      <Typography
        data-cy="headerTitle"
        data-testid="headerTitle"
        className=" text-14 font-semibold text-gray-500 pl-10 "
      >
        Gateway Test
      </Typography>
    </div>
  );
};

export default Nav;
