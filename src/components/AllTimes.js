import React, { useState, useEffect } from 'react';

function AllTimes() {
	const [ allData, setAllData ] = useState([]);
	const listColors = [
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
	];

	useEffect(() => {
		fetch('https://tranquil-wildwood-15780.herokuapp.com/allStats/' + localStorage.getItem('userId'))
			.then(function(response) {
				return response.json();
			})
			.then(function(myJson) {
				return myJson.stats;
			})
			.then(function(stats) {
				stats = stats.map((item) => {
					item.date = new Date(item.date).toLocaleDateString('en-US');
					return item;
				});
				let sortedData = [];
				if (stats.length > 0) {
					sortedData.push({
						date: stats[0].date,
						urls: [ { url: stats[0].url, time: stats[0].time } ],
						total: stats[0].time
					});
				}
				let sortedIndex = 0;
				for (let i = 1; i < stats.length; i++) {
					if (stats[i].date == sortedData[sortedIndex].date) {
						sortedData[sortedIndex].urls.push({ url: stats[i].url, time: stats[i].time });
						sortedData[sortedIndex].total = sortedData[sortedIndex].total + stats[i].time;
					} else {
						sortedIndex++;
						sortedData.push({
							date: stats[i].date,
							urls: [ { url: stats[i].url, time: stats[i].time } ],
							total: stats[i].time
						});
					}
				}
				sortedData.reverse();
				console.log(sortedData);
				setAllData(sortedData);
			})
			.catch((e) => console.log('Error', e));
	}, []);

	return (
		<div className="history-container">
			{allData.map((item) => {
				let totalHour = Math.floor(item.total / 3600);
				if (totalHour < 10) {
					totalHour = '0' + totalHour;
				}
				let totalMinutes = Math.floor((item.total % 3600) / 60);
				if (totalMinutes < 10) {
					totalMinutes = '0' + totalMinutes;
				}
				let totalSeconds = item.total % 60;
				if (totalSeconds < 10) {
					totalSeconds = '0' + totalSeconds;
				}
				return (
					<div>
						<span className="header-container">
							<h2 className="date-header">
								{item.date} - {totalHour}h{totalMinutes}m{totalSeconds}s
							</h2>
						</span>
						<ul>
							{item.urls.map((url, index) => {
								let dotColor = '#bbbbbb';
								if (index < 10) {
									dotColor = listColors[index];
								}
								let urlHours = Math.floor(url.time / 3600);
								if (urlHours < 10) {
									urlHours = '0' + urlHours;
								}
								let urlMinutes = Math.floor((url.time % 3600) / 60);
								if (urlMinutes < 10) {
									urlMinutes = '0' + urlMinutes;
								}
								let urlSeconds = url.time % 60;
								if (urlSeconds < 10) {
									urlSeconds = '0' + urlSeconds;
								}
								let percentage = (url.time / item.total * 100).toFixed(2);
								if (percentage < 10) {
									percentage = '0' + percentage;
								}
								return (
									<li>
										<span
											style={{
												color: dotColor,
												borderRadius: '1em'
											}}
										>
											⬤{' '}
										</span>
										{url.url}{' '}
										<span
											style={{
												float: 'right'
											}}
										>
											{urlHours}h{urlMinutes}m{urlSeconds}s&nbsp;&nbsp;{percentage}%&emsp;&emsp;&ensp;
										</span>
									</li>
								);
							})}
						</ul>
					</div>
				);
			})}
		</div>
	);
}

export default AllTimes;
