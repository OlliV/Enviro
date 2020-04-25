import dynamic from 'next/dynamic';
import Router from 'next/router';
import isAuthenticated from '../lib/is-authenticated';

const Dashboard = dynamic(import('../components/dashboard'), { ssr: false });

export default function index() {
	if (isAuthenticated()) {
		return <Dashboard />;
	}
	return null;
}
