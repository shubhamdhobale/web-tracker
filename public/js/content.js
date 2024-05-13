// Receives messages from background and interacts with webpage
let activeUrl = null;
let prevUrl = null;
let currInterval;
let userId;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // TAB CHANGE ACTION (after data is sent)
  if (request.message === "changeTab") {
    userId = request.userId;
    activeUrl = window.location.origin.toString();
    // Start timer
    currInterval = setInterval(() => {
      if (activeUrl.length) {
        console.log(`Data to save: user: ${userId} time: 5 url: ${activeUrl}`);
        $.post("https://tranquil-wildwood-15780.herokuapp.com/updateStats", {
          userId: userId,
          time: 5,
          url: activeUrl,
          date: new Date(new Date().toLocaleDateString())
        })
          .done(function(res) {
            console.log("success");
          })
          .fail(function(res) {
            console.log("fail");
          });
      }
    }, 5000);
  }

  // URL CHANGE ACTION (after data is sent)
  if (request.message === "changeUrl") {
    userId = request.userId;
    activeUrl = window.location.origin.toString();
    // Start timer
    currInterval = setInterval(() => {
      if (activeUrl.length) {
        console.log(`Data to save: user: ${userId} time: 5 url: ${activeUrl}`);
        $.post("https://tranquil-wildwood-15780.herokuapp.com/updateStats", {
          userId: userId,
          time: 5,
          url: activeUrl,
          date: new Date(new Date().toLocaleDateString())
        })
          .done(function(res) {
            console.log("success");
          })
          .fail(function(res) {
            console.log("fail");
          });
      }
    }, 5000);
    // Updates url and references past url for sending data
  }

  // Clear interval on tab/url changes
  if (request.message === "clearInterval") {
    // Stop timer on the tab indicated by message
    clearInterval(currInterval);
  }
});
