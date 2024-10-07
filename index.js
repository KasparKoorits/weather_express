const express = require("express");
const app = express();
const path = require("path");
const fetch = require("node-fetch");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const key = "915a43cf30d0af54c789b4d20dc67f9c";

const getWeatherDataPromise = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        let description = data.weather[0].description;
        let city = data.name;
        let temp = Math.round(parseFloat(data.main.temp) - 273.15);
        let result = {
          description: description,
          city: city,
          temp: temp,
          error: null,
        };
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

app.all("/", function (req, res) {
  let city;
  if (req.method == "GET") {
    city = "Tartu";
  }
  if (req.method == "POST") {
    city = req.body.cityname;
  }
  let url = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={key}`;
  getWeatherDataPromise(url)
    .then((data) => {
      res.render("index", data);
    })
    .catch((error) => {
      res.render("index", { error: "Problem with getting data, try again" });
    });
});

app.listen(3000);
