const { render } = require("@testing-library/react");
const { default: Loading } = require("pages/loading/Loading");

describe('<Loading />', () => {
	test('renders Loading', () => {
		const { getByText } = render(<Loading />);
		getByText('Loading...');
	});

});