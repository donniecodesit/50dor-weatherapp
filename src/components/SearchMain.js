import React, { useEffect, useState } from "react";
import WeatherDetails from "./WeatherDetails";
import "./searchStyles.css";

let apiKey = process.env.REACT_APP_OWMAPIKEY;

function SearchMain() {
  const [searchTerm, setSearchTerm] = useState("new york city");
  const [weatherInfo, setWeatherInfo] = useState({});
  const [isMetric, setIsMetric] = useState(true);

  const getWeatherInfo = async () => {
    try {
      let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchTerm}&units=metric&appid=${apiKey}`;
      let result = await fetch(url);
      let data = await result.json();

      const { temp, humidity, pressure } = data.main;
      const { main: weatherType } = data.weather[0];
      const { lon, lat } = data.coord;
      const { name, timezone: timezoneOffset } = data;
      const { speed } = data.wind;
      const { country, sunset } = data.sys;

      const newWeatherInfo = {
        temp,
        humidity,
        pressure,
        weatherType,
        lon,
        lat,
        name,
        timezoneOffset,
        speed,
        country,
        sunset,
      };

      setWeatherInfo(newWeatherInfo);
    } catch (error) {
      setWeatherInfo(null);
    }
  };

  useEffect(() => {
    getWeatherInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="searchBar">
        <div className="search">
          <input
            type="search"
            placeholder="Type a city name."
            className="searchTerm"
            id="search"
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                getWeatherInfo();
              }
            }}
          />
          <button className="searchButton" onClick={getWeatherInfo}>
            Find
          </button>
          <button
            className="metricButton"
            onClick={() => setIsMetric(!isMetric)}
          >
            {isMetric ? "Metric" : "Imperial"}
          </button>
        </div>
      </div>
      {weatherInfo ? (
        <WeatherDetails weatherInfo={weatherInfo} isMetric={isMetric} />
      ) : (
        <>
          <article className="widget">
            <div className="weatherIcon">
              <p style={{ fontSize: "1rem" }}>
                Invalid city, please retry or retype your search input.
              </p>
            </div>
            <div className="weatherInfo">
              <div className="temperature">
                <span>
                  <i className={`wi wi-na`}></i>
                </span>
              </div>
              <div className="description">
                <div className="weatherCondition">
                  <i className={`wi wi-na`}></i>
                </div>
              </div>
              <div className="date">
                <i className={`wi wi-na`}></i>
              </div>
            </div>

            <div className="extra-temp">
              <div className="temp-info-minmax">
                <div className="two-sided-section">
                  <p>
                    <i className="wi wi-sunset"></i>
                  </p>
                  <p className="extra-info-leftside">
                    ??? <br />
                    Sunset
                  </p>
                </div>
                <div className="two-sided-section">
                  <p>
                    <i className="wi wi-humidity"></i>
                  </p>
                  <p className="extra-info-leftside">
                    ???% <br />
                    Humidity
                  </p>
                </div>
              </div>
              <div className="temp-info-minmax">
                <div className="two-sided-section">
                  <p>
                    <i className="wi wi-rain"></i>
                  </p>
                  <p className="extra-info-leftside">
                    ??? hPa <br />
                    Pressure
                  </p>
                </div>
                <div className="two-sided-section">
                  <p>
                    <i className="wi wi-strong-wind"></i>
                  </p>
                  <p className="extra-info-leftside">
                    ???
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default SearchMain;
