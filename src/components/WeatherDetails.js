import React, { useEffect, useState } from "react";

function WeatherDetails({
  weatherInfo: {
    temp,
    humidity,
    pressure,
    weatherType,
    lon,
    lat,
    name,
    speed,
    country,
    sunset,
  },
  isMetric,
}) {
  const [weatherState, setWeatherState] = useState("");
  const [currentTime, setCurrentTime] = useState("1/1/1970, 12:00 AM");
  const [areaSunsetTime, setAreaSunsetTime] = useState("1/1/1970, 12:00 AM");

  useEffect(() => {
    // Identify the timezone and set the current time accordingly.
    async function updateAreaInformation() {
      try {
        let url = `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.REACT_APP_TZDBAPIKEY}&format=json&by=position&lat=${lat}&lng=${lon}`;
        let result = await fetch(url);
        let data = await result.json();

        // Set the current time.
        let currentUnix = new Date();
        let convertedTime = currentUnix.toLocaleString("en-US", {
          timeZone: data.zoneName,
        });
        setCurrentTime(convertedTime);

        // Set the sunset time.
        let sunsetUnix = new Date(sunset * 1000);
        let convertedSunsetTime = sunsetUnix.toLocaleString("en-US", {
          timeZone: data.zoneName,
        });
        const { 1: sunsetTime, 2: sunsetMeridiem } =
          convertedSunsetTime.split(" ");
        const [sunsetHour, sunsetMinute] = sunsetTime.split(":");
        let thisString = `${sunsetHour}:${sunsetMinute} ${sunsetMeridiem}`;
        setAreaSunsetTime(thisString);

        // Set the weather type icon
        if (weatherType) {
          let { 1: time, 2: meridiem } = convertedTime.split(" ");
          let hour = time.split(":")[0];

          // If it's between 6 PM and 5 AM, nighttime, otherwise it is daytime
          if (
            (meridiem === "PM" && hour >= 6) ||
            (meridiem === "AM" && (hour === 12 || hour < 6))
          ) {
            switch (weatherType) {
              case "Clear":
                setWeatherState("wi-night-clear");
                break;
              case "Clouds":
                setWeatherState("wi-night-alt-cloudy");
                break;
              case "Haze":
                setWeatherState("wi-night-fog");
                break;
              case "Mist":
                setWeatherState("wi-night-fog");
                break;
              case "Drizzle":
                setWeatherState("wi-night-alt-showers");
                break;
              case "Rain":
                setWeatherState("wi-night-alt-rain");
                break;
              case "Thunderstorm":
                setWeatherState("wi-night-alt-thunderstorm");
                break;
              case "Snow":
                setWeatherState("wi-night-alt-snow");
                break;
              case "Smoke":
                setWeatherState("wi-smoke");
                break;
              case "Dust":
                setWeatherState("wi-dust");
                break;
              case "Fog":
                setWeatherState("wi-night-fog");
                break;
              case "Sand":
                setWeatherState("wi-sandstorm");
                break;
              case "Ash":
                setWeatherState("wi-sandstorm");
                break;
              case "Tornado":
                setWeatherState("wi-tornado");
                break;
              default:
                setWeatherState("wi-night-clear");
                break;
            }
          } else {
            switch (weatherType) {
              case "Clear":
                setWeatherState("wi-day-sunny");
                break;
              case "Clouds":
                setWeatherState("wi-day-cloudy");
                break;
              case "Haze":
                setWeatherState("wi-day-haze");
                break;
              case "Mist":
                setWeatherState("wi-day-haze");
                break;
              case "Drizzle":
                setWeatherState("wi-day-showers");
                break;
              case "Rain":
                setWeatherState("wi-day-rain");
                break;
              case "Thunderstorm":
                setWeatherState("wi-day-thunderstorm");
                break;
              case "Snow":
                setWeatherState("wi-day-snow");
                break;
              case "Smoke":
                setWeatherState("wi-smoke");
                break;
              case "Dust":
                setWeatherState("wi-dust");
                break;
              case "Fog":
                setWeatherState("wi-day-fog");
                break;
              case "Sand":
                setWeatherState("wi-sandstorm");
                break;
              case "Ash":
                setWeatherState("wi-sandstorm");
                break;
              case "Tornado":
                setWeatherState("wi-tornado");
                break;
              default:
                setWeatherState("wi-day-sunny");
                break;
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    updateAreaInformation();
  }, [weatherType, lat, lon, sunset]);

  return (
    <>
      <article className="widget">
        <div className="weatherIcon">
          <i className={`wi ${weatherState}`}></i>
        </div>
        <div className="weatherInfo">
          <div className="temperature">
            <span>
              {temp && (isMetric ? temp : temp * 1.8 + 32).toFixed(0)}&deg;
              {isMetric ? "C" : "F"}
            </span>
          </div>
          <div className="description">
            <div className="weatherCondition">{weatherType}</div>
            <div className="place">
              {name}, {country}
            </div>
          </div>
          <div className="date">{currentTime}</div>
        </div>

        <div className="extra-temp">
          <div className="temp-info-minmax">
            <div className="two-sided-section">
              <p>
                <i className="wi wi-sunset"></i>
              </p>
              <p className="extra-info-leftside">
                {areaSunsetTime} <br />
                Sunset
              </p>
            </div>
            <div className="two-sided-section">
              <p>
                <i className="wi wi-humidity"></i>
              </p>
              <p className="extra-info-leftside">
                {humidity}% <br />
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
                {pressure} hPa <br />
                Pressure
              </p>
            </div>
            <div className="two-sided-section">
              <p>
                <i className="wi wi-strong-wind"></i>
              </p>
              <p className="extra-info-leftside">
                {temp && (isMetric ? speed * 3.6 : speed * 2.23694).toFixed(2)}{" "}
                {isMetric ? "km/h" : "m/h"}
                <br />
              </p>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

export default WeatherDetails;
