import React from 'react';
import ReactDOM from 'react-dom/client';
import {
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
	Outlet,
} from '@tanstack/react-router';
import '@styles/globals.css';

import Nav from '@components/Nav';
import Footer from '@components/Footer';
import Home from './Home';

const rootRoute = createRootRoute({
	component: () => (
		<>
			<div className="main">
				<div className="gradient" />
			</div>
			<main className="app">
				<Nav />
				<Outlet />
				<Footer />
			</main>
		</>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: Home,
});

const router = createRouter({
	routeTree: rootRoute.addChildren([indexRoute]),
});

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
