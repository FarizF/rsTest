import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Playlists from './components/Playlists';
import Artists from './components/Artists';

function App() {
	return (
		<>
			<Navbar />
			<main>
				<Router>
					<Switch>
						<Route exact path="/artists/:name">
							<Artists/>
						</Route>
						<Route path="/artists">
							<Artists/>
						</Route>
					</Switch>
				</Router>
			</main>
		</>
	);
}

export default App;
