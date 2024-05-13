import React, { useEffect, useState } from "react";
import psl from "psl";
import { Radar } from "react-chartjs-2";

function Insights() {
  const [today, setToday] = useState(new Date());
  const [yesterday, setYesterday] = useState(new Date());
  const [todayArr, setTodayArr] = useState([]);
  const [yesterdayArr, setYesterdayArr] = useState([]);

  useEffect(() => {
    fetch(
      "https://tranquil-wildwood-15780.herokuapp.com/allStats/" +
        localStorage.getItem("userId")
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        return myJson.stats;
      })
      .then(function(stats) {
        stats = stats.map(item => {
          let url = item.url.split("/")[2];
          item.url = psl.parse(url).sld;
          for (let i = 0; i < url.length; i++) {
            if (url[i] === ":") {
              item.url = url;
            }
          }
          return item;
        });
        setTodayArr(
          stats.filter(item => item.date == new Date(today.toLocaleDateString()))
        );
        setYesterday(yesterday.setDate(today.getDate() - 1));
        setYesterdayArr(
          stats.filter(item => item.date == new Date(yesterday.toLocaleDateString()))
        );
      })
      .catch(e => console.log("Error", e));
  }, []);
  
	function percentChange (today, yesterday){
		let todayTime = today.reduce((accum, curr)=> accum += curr.time,0)
		let yesterdayTime = yesterday.reduce((accum, curr)=> accum += curr.time,0)
		return ((todayTime - yesterdayTime)/(yesterdayTime))*100
	} 
	function minuteChange (today, yesterday){
		let todayTime = today.reduce((accum, curr)=> accum += curr.time,0)
		let yesterdayTime = yesterday.reduce((accum, curr)=> accum += curr.time,0)
		return Math.ceil((todayTime - yesterdayTime)/60)
	} 
	function mostUsed (today, yesterday){
		let top3 = yesterday.slice(0,3)
		let top3Url = top3.map((item)=> item.url)
		const web1 = today.filter((item)=> item.url === top3Url[0])
		const web2 = today.filter((item)=> item.url === top3Url[1])
		const web3 = today.filter((item)=> item.url === top3Url[2])
		let time1;
		let time2;
		let time3;
		console.log(web1,web2,web3, top3)
		if (web1 && web1.length > 0){
			time1 = Math.floor((web1[0].time - top3[0].time)/60)
		} else {
			time1 = 0
		}
		if (web2 && web2.length > 0){
			time2 = Math.floor((web2[0].time - top3[1].time)/60)
		} else {
			time2 = 0
		}
		if (web3 && web3.length > 0){
			time3 =  Math.floor((web3[0].time - top3[2].time)/60)
		} else {
			time3 = 0
		}
		if (top3.length > 0){
			return [
				[{time: time1, url: top3[0].url},{time: time2, url: top3[1].url}, {time: time3, url: top3[2].url}],
				top3Url, 
				[Math.ceil(top3[0].time/60),Math.ceil(top3[1].time/60), Math.ceil(top3[2].time/60)], 
				[web1[0] ? Math.ceil(web1[0].time/60) : 0, web2[0] ? Math.ceil(web2[0].time/60) : 0, web3[0] ? Math.ceil(web3[0].time/60) : 0]
			]
		}	
	}

  return yesterdayArr.length !== 0 ? (
    <div className="insight-container">
      <div className="info-container">
        <p>
          Your usage{" "}
          {percentChange(todayArr, yesterdayArr) > 0 ? (
            <strong style={{ color: "green" }}>increased</strong>
          ) : (
            <strong style={{ color: "red" }}>decreased</strong>
          )}{" "}
          by {Math.abs(Math.floor(percentChange(todayArr, yesterdayArr)))}%!
        </p>
        <p>
          Your usage{" "}
          {minuteChange(todayArr, yesterdayArr) > 0 ? (
            <strong style={{ color: "green" }}>increased</strong>
          ) : (
            <strong style={{ color: "red" }}>decreased</strong>
          )}{" "}
          by {Math.abs(minuteChange(todayArr, yesterdayArr))} minutes!
        </p>
        <p className="topSitesTxt">Your top 3 sites Today vs Yesterday</p>
        <ul>
          {mostUsed(todayArr, yesterdayArr) ? (
            mostUsed(todayArr, yesterdayArr)[0].map(item => (
              <li>
                <p>
                  <strong>{item.url}</strong>: {Math.abs(item.time)} minute{" "}
                  {item.time > 0 ? (
                    <strong style={{ color: "green" }}>increase</strong>
                  ) : (
                    <strong style={{ color: "red" }}>decrease</strong>
                  )}
                </p>
              </li>
            ))
          ) : (
            <p>Loading</p>
          )}
        </ul>
      </div>
      <div className="radar-container">
        <Radar
          data={{
            datasets: [
              {
                label: "Yesterday",
                data: mostUsed(todayArr, yesterdayArr)
                  ? mostUsed(todayArr, yesterdayArr)[2]
                  : null,
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                borderColor: "rgb(255, 99, 132)",
                pointBackgroundColor: "rgb(255, 99, 132)"
              },
              {
                label: "Today",
                data: mostUsed(todayArr, yesterdayArr)
                  ? mostUsed(todayArr, yesterdayArr)[3]
                  : null,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                pointBackgroundColor: "rgb(54, 162, 235)"
              }
            ],
            labels: mostUsed(todayArr, yesterdayArr)
              ? mostUsed(todayArr, yesterdayArr)[1]
              : null
		  }}
		  options={{
			scale: {
				ticks: {
				  beginAtZero: true
				}
			  }
		  }}
        />
      </div>
    </div>
  ) : (
    <div className="noPrevContainer">
      <div className="noPrevDataTxt">No previous data!</div>
      <div className="noPrevDataSm">
        Insights will be displayed tomorrow. Don't worry!
      </div>
    </div>
  );
}

export default Insights;
