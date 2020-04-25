import { useSelector } from 'react-redux';

export default function isAuthenticated() {
	return useSelector(
		({ state }) => state === 'Authenticated'
	);
}
