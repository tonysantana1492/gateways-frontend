import { CircularProgress, Typography } from '@mui/material';



const Loading = () => {
	return (

		<div data-cy='loading-component' className=" h-200 w-full flex flex-col items-center justify-center">
			<Typography className="text-13 sm:text-20 mb-16" color="textSecondary">
				Loading...
			</Typography>			
			<CircularProgress className=' text-blue' />
		</div>
	);
};

export default Loading;
