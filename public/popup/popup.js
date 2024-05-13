$(document).ready(function() {
  getName();

  //   $("#reenterName").hide();
  chrome.identity.getProfileUserInfo(function(userInfo) {
    $("#userId").text(userInfo.id);
  });
  $("#checkPage").click(function() {
    // getName();
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        let username = $("#username")
          .val()
          .trim()
          .split(" ")[0];
        if (username === "") {
          $("#errorText").css("color", "red");
          $("#errorText").text("Please enter a valid name");
        } else {
          //   getName();
          $("#nameID").hide();
          $("#username").hide();
          $("#checkPage").hide();
          localStorage.setItem("name", username);
          localStorage.setItem("userId", userInfo.id.toString());
          $("#helloText").text(`Welcome, ${username}`);
          $.post("https://tranquil-wildwood-15780.herokuapp.com/createUser", {
            name: username,
            userId: userInfo.id.toString()
          })
            .done(function() {
              $("#errorText").css("color", "green");
              $("#errorText").text("Connected your account!");
            })
            .fail(function() {
              $("#errorText").css("color", "red");
              $("#errorText").text("Something went wrong");
            });
        }
      });
    });
  });
  $("#reenterName").click(function() {
    $("#nameID").show();
    $("#username").show();
    $("#checkPage").show();
    $("#helloText").hide();
    // getName();
    // let username = $("#username")
    //   .val()
    //   .trim()
    //   .split(" ")[0];
    // if (username === "") {
    //   $("#errorText").css("color", "red");
    //   $("#errorText").text("Please enter a valid name");
    // } else {
    //   //   getName();
    //   $("#nameID").hide();
    //   $("#username").hide();
    //   $("#checkPage").hide();
    //   localStorage.setItem("name", username);
    // }
  });
});

function getName() {
  if (localStorage.getItem("name") && localStorage.getItem("name").length !== 0) {
    $("#helloText").text(`Welcome, ${localStorage.getItem("name")}`);
    $("#nameID").hide();
    $("#username").hide();
    $("#checkPage").hide();

    // $("#reenterName").toggle();
  } else {
    $("#helloText").text(`Welcome!`);
    $("#nameID").show();
    $("#username").show();
    $("#checkPage").show();
  }
}
