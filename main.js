const express = require("express");
const https = require("https");
const app = express();

const bodyParser = require("body-parser");

// function calculateScore(easy, med, hard) {
//   const score = 0.75 * easy + 1.25 * med + 2 * hard;
//   return score;
// }
app.set("view engine", "ejs");
var dict = {};

const url = "https://leetcode-stats-api.herokuapp.com/";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  // res.render("index", { winner: "" });
  res.send("HI");
});

app.post("/", function (req, res) {
  console.log("post req rcvd");

  let u1 = req.body.user1;
  let u2 = req.body.user2;

  let usernames = [u1, u2];
  //   console.log(usernames[0]);
  //   console.log(usernames[1]);

  let urls = [url + u1, url + u2];
  const fetchData = async () => {
    for (let i = 0; i < 2; i++) {
      let fetchUrl = urls[i];
      https.get(fetchUrl, function (res) {
        res.on("data", function (data) {
          let json = JSON.parse(data);
          let easy = json.easySolved;
          let med = json.mediumSolved;
          let hard = json.hardSolved;
          // console.log(easy, med, hard);
          let scorePush = 0.75 * easy + 1.25 * med + 2 * hard;
          console.log(fetchUrl);
          console.log(scorePush);
          dict[usernames[i]] = scorePush;
        });
      });
    }
    console.log("all data fetched");

    // await printData();
  };

  fetchData();

  function printData() {
    // console.log(dict[usernames[0]], dict[usernames[1]]);
    let winnerScore = dict[usernames[0]] > dict[usernames[1]] ? 0 : 1;
    let loserScore = dict[usernames[0]] > dict[usernames[1]] ? 1 : 0;
    // console.log(winnerScore);

    res.render("index", { winner: winnerScore });
  }
  setTimeout(printData, 4000);
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000.");
});
