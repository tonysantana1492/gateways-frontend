const { render } = require("@testing-library/react");
const { default: NotFound } = require("pages/notFound/NotFound");
describe('<NotFound />', () => {
	
	test('renders Not Found', () => {
		const { getByText } = render(<NotFound />);
		getByText('Not Found');
	});

});