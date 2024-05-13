import React, { useEffect, useState } from 'react';
import psl from 'psl';
import { Bar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChalkboard, faCalendarDay, faCalendarWeek, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

function Dashboard() {
	const [ allData, setAllData ] = useState([]);
	const [ day, setDay ] = useState(new Date());
	const [ timeInterval, setTimeInterval ] = useState('daily');
	const [ intervalData, setIntervalData ] = useState([]);
	const [ intervalLabels, setIntervalLabels ] = useState([]);
	const [ activeButtons, setActiveButtons ] = useState([ true, false, false ]);

	useEffect(() => {
		fetch('https://tranquil-wildwood-15780.herokuapp.com/allStats/' + localStorage.getItem('userId'))
			.then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				return myJson.stats;
			})
			.then(function(stats) {
				console.log(stats);
				stats = stats.map((item) => {
					let url = item.url.split('/')[2];
					let parsed = psl.parse(url);
					if  (parsed.subdomain && parsed.subdomain !== 'www') {
						item.url = parsed.subdomain + '.' + parsed.sld;
					} else {
						item.url = parsed.sld;
					}
					for (let i = 0; i < url.length; i++) {
						if (url[i] === ':') {
							item.url = url;
						}
					}
					if (!item.url)
						item.url = 'file';
					return item;
				});
				setAllData(stats);
				let dayArr = stats.filter((item) => item.date == new Date(new Date().toLocaleDateString()));
				setIntervalData(dayArr.map((item) => Math.ceil(item.time / 60)).slice(0, 10));
				setIntervalLabels(dayArr.map((item) => item.url).slice(0, 10));
			})
			.catch((e) => console.log('Error', e));
	}, []);

	return (
		<div className="piechart-container">
			<div className="time-buttons">
				<button
					className="day"
					style={
						activeButtons[0] ? (
							{
								backgroundColor: '#f2f2f2'
							}
						) : (
							{}
						)
					}
					onClick={() => {
						setActiveButtons([ true, false, false ]);
						setTimeInterval('daily');
						let d = new Date(day);
						let dayArr = allData.filter((item) => item.date == new Date(d.toLocaleDateString()));
						setIntervalData(dayArr.map((item) => Math.ceil(item.time / 60)).slice(0, 10));
						setIntervalLabels(dayArr.map((item) => item.url).slice(0, 10));
					}}
				>
					<FontAwesomeIcon icon={faCalendarDay} /> Today
				</button>
				<button
					className="month"
					style={
						activeButtons[1] ? (
							{
								backgroundColor: '#f2f2f2'
							}
						) : (
							{}
						)
					}
					onClick={() => {
						setActiveButtons([ false, true, false ]);
						setTimeInterval('weekly');
						let d = new Date(day);
						let copyArr = generateWeek(d, allData);
						let dayArr = mergeData(copyArr);
						setIntervalData(dayArr.map((item) => Math.ceil(item.time / 60)).slice(0, 10));
						setIntervalLabels(dayArr.map((item) => item.url).slice(0, 10));
					}}
				>
					<FontAwesomeIcon icon={faCalendarWeek} /> Last 7 Days
				</button>
				<button
					className="all-time"
					style={
						activeButtons[2] ? (
							{
								backgroundColor: '#f2f2f2'
							}
						) : (
							{}
						)
					}
					onClick={() => {
						setActiveButtons([ false, false, true ]);
						setTimeInterval('allTime');
						let dayArr = mergeData(allData);
						setIntervalData(dayArr.map((item) => Math.ceil(item.time / 60)).slice(0, 10));
						setIntervalLabels(dayArr.map((item) => item.url).slice(0, 10));
					}}
				>
					<FontAwesomeIcon icon={faCalendarAlt} /> All-Time
				</button>
			</div>
			<Bar
				data={{
					datasets: [
						{
							data: [ ...intervalData, 0 ],
							backgroundColor: [
								'#ff6363',
								'#ffa463',
								'#fff763',
								'#9fff63',
								'#63ff75',
								'#63ffea',
								'#63a1ff',
								'#7a63ff',
								'#a763ff',
								'#f763ff'
							]
						}
					],
					labels: intervalLabels
				}}
				options={{
					legend: {
						display: false
					},
					scales: {
						yAxes: [
							{
								scaleLabel: {
									display: true,
									labelString: 'Minutes'
								}
							}
						]
					}
				}}
			/>
			<div className="day-buttons">
				<button
					className="left"
					onClick={() => {
						let d = new Date(day);
						let dayArr;
						if (timeInterval === 'daily') {
							d.setDate(d.getDate() - 1);
							setDay(d);
							dayArr = allData.filter((item) => item.date == new Date(d.toLocaleDateString()));
						} else if (timeInterval === 'weekly') {
							d.setDate(d.getDate() - 7);
							setDay(d);
							let copyArr = generateWeek(d, allData);
							dayArr = mergeData(copyArr);
						} else {
							dayArr = mergeData(allData);
						}
						setIntervalData(dayArr.map((item) => Math.ceil(item.time / 60)).slice(0, 10));
						setIntervalLabels(dayArr.map((item) => item.url).slice(0, 10));
					}}
				>
					<strong>&lt;</strong>
				</button>
				<button className="middle">
					<FontAwesomeIcon icon={faChalkboard} /> {day.toLocaleDateString('en-US')}
				</button>
				<button
					className="right"
					onClick={() => {
						if (day.toLocaleDateString('en-US') != new Date().toLocaleDateString('en-US')) {
							let d = new Date(day);
							let dayArr;
							if (timeInterval === 'daily') {
								d.setDate(d.getDate() + 1);
								setDay(d);
								dayArr = allData.filter((item) => item.date == new Date(d.toLocaleDateString()));
							} else if (timeInterval === 'weekly') {
								let today = new Date(new Date());
								let newDate = new Date(new Date());
								newDate.setDate(d.getDate() + 7);
								if (newDate > today) {
									d.setDate(today.getDate());
								} else {
									d.setDate(d.getDate() + 7);
								}
								setDay(d);
								let copyArr = generateWeek(d, allData);
								dayArr = mergeData(copyArr);
							} else {
								dayArr = mergeData(allData);
							}
							setIntervalData(dayArr.map((item) => Math.ceil(item.time / 60)).slice(0, 10));
							setIntervalLabels(dayArr.map((item) => item.url).slice(0, 10));
						}
					}}
				>
					<strong>&gt;</strong>
				</button>
			</div>
		</div>
	);
}

const mergeData = (allData) => {
	let copyArr = allData.slice(0);
	let dayArr = [];
	for (let i = 0; i < copyArr.length; i++) {
		let found = false;
		for (let j = 0; j < dayArr.length; j++) {
			if (dayArr[j].url == copyArr[i].url) {
				found = true;
				dayArr[j].time = dayArr[j].time + copyArr[i].time;
				break;
			}
		}
		if (!found) {
			dayArr.push(Object.assign({}, copyArr[i]));
		}
	}
	dayArr = dayArr.sort((a, b) => b.time - a.time);
	return dayArr;
};

const generateWeek = (d, allData) => {
	let startIndex = 0;
	let endIndex;
	let startDate = new Date(d);
	startDate.setDate(startDate.getDate() - 7);
	let endDate = new Date(d);
	let timeData = allData.sort((a, b) => new Date(a.date) - new Date(b.date));
	for (let i = 0; i < timeData.length; i++) {
		let newDate = new Date(timeData[i].date);
		if (newDate >= startDate) {
			startIndex = i;
			break;
		}
	}
	for (let i = timeData.length - 1; i >= 0; i--) {
		let newDate = new Date(timeData[i].date);
		if (newDate <= endDate) {
			endIndex = i + 1;
			break;
		}
	}
	let copyArr = [];
	if (endIndex) {
		copyArr = timeData.slice(startIndex, endIndex);
	}
	return copyArr;
};

export default Dashboard;
