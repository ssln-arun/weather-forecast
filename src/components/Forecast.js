import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        const dailyData = response.data.list.filter(reading => reading.dt_txt.includes("12:00:00"));
        setForecastData(dailyData);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data.name]);

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToFahrenheit = (temperature) => {
    return Math.round((temperature * 9) / 5 + 32);
  };

  const renderTemperature = (temperature) => {
    return isCelsius ? Math.round(temperature) : convertToFahrenheit(temperature);
  };

  const formatDay = (dateString) => {
    const options = { weekday: "short" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <div>
      <div className="city-name">
        <h2>{data.name}, <span>{data.sys.country}</span></h2>
      </div>
      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>
      <div className="temp">
        <img
          src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
          alt={data.weather[0].description}
          className="temp-icon"
        />
        {renderTemperature(data.main.temp)}
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
      </div>
      <p className="weather-des">{data.weather[0].description}</p>
      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size="40" />
          <div>
            <p className="wind">{data.wind.speed} m/s</p>
            <p>Wind speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size="40" />
          <div>
            <p className="humidity">{data.main.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>
      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">
          {forecastData.slice(0, 5).map((day) => (
            <div className="day" key={day.dt}>
              <p className="day-name">{formatDay(day.dt_txt)}</p>
              <img
                className="day-icon"
                src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                alt={day.weather[0].description}
              />
              <p className="day-temperature">
                {Math.round(day.main.temp_min)}° / <span>{Math.round(day.main.temp_max)}°</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Forecast;