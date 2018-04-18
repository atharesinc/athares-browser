const ErrorSwap = ({ condition, normal, error }) => {
	if (condition) {
		return normal;
	} else {
		return error;
	}
};

export default ErrorSwap;
