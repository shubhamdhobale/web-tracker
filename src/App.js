import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import AllTimes from './components/AllTimes';
import Insights from './components/Insights';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faHistory, faChartLine, faPaw } from '@fortawesome/free-solid-svg-icons';

function App() {
	const id = localStorage.getItem('userId');
	const [ currentPage, setCurrentPage ] = useState(<Dashboard />);
	const [ activePage, setActivePage ] = useState([ true, false, false ]);
	return (
		<div className="container-main">
			<header className="container-header">
				<button
					className="logo"
					onClick={() => {
						setActivePage([true, false, false])
						setCurrentPage(<Dashboard />);
					}}
				>
					Trackr
				</button>
				<button
					className="active"
					style={
						activePage[0] ? (
							{
								borderRadius: '7px',
								color: 'white',
								background: '#494949'
							}
						) : (
							{}
						)
					}
					onClick={() => {
						setCurrentPage(<Dashboard />);
						setActivePage([true, false, false])
					}}
				>
					<FontAwesomeIcon icon={faChartBar} /> Dashboard
				</button>
				<div />
				<button
				style={
					activePage[1] ? (
						{
							borderRadius: '7px',
							color: 'white',
							background: '#494949'
						}
					) : (
						{}
					)
				}
					onClick={() => {
						setActivePage([false, true, false])
						setCurrentPage(<AllTimes />);
					}}
				>
					<FontAwesomeIcon icon={faHistory} /> History
				</button>
				<div />
				<button
				style={
					activePage[2] ? (
						{
							borderRadius: '7px',
							color: 'white',
							background: '#494949'
						}
					) : (
						{}
					)
				}
					onClick={() => {
						setActivePage([false, false, true])
						setCurrentPage(<Insights />);
					}}
				>
					<FontAwesomeIcon icon={faChartLine} /> Insights
				</button>
			</header>
			{currentPage}
		</div>
	);
}

export default App;
