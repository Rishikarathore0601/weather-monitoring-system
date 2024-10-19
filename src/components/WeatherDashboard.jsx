import React, { useEffect, useState } from "react";
import axios from "axios";
import "./weatherDashboard.css"; // Import the updated CSS styles

const cities = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bangalore",
  "Kolkata",
  "Hyderabad",
];

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // State for dark theme

  const fetchWeatherData = async () => {
    try {
      const weatherData = await Promise.all(
        cities.map((city) =>
          axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=e16f2ee96d4b80162cfcf29eefc61609`
          )
        )
      );

      const processedData = weatherData.map((response) => {
        const data = response.data;
        const tempC = data.main.temp - 273.15;
        const feelsLikeC = data.main.feels_like - 273.15;
        const mainCondition = data.weather[0].main;

        return {
          city: data.name,
          main: mainCondition,
          temp: tempC,
          feels_like: feelsLikeC,
          dt: new Date(data.dt * 1000),
        };
      });

      setWeatherData(processedData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      // Handle the error as needed
    }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(() => {
      fetchWeatherData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // Function to get emoji based on the temperature
  const getTemperatureEmoji = (temp) => {
    if (temp > 30) return "☀️"; // Hot
    if (temp > 20) return "🌤️"; // Warm
    return "❄️"; // Cold
  };

  // Function to get emoji based on feels like temperature
  const getFeelsLikeEmoji = (feelsLike) => {
    if (feelsLike > 30) return "☀️"; // Hot
    if (feelsLike > 20) return "🌤️"; // Warm
    return "❄️"; // Cold
  };

  // Function to get emoji based on time of day
  const getTimeEmoji = (date) => {
    const hour = date.getHours();
    return hour >= 6 && hour < 18 ? "☀️" : "🌙"; // Sun for daytime, moon for night
  };
  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
    document.body.classList.toggle("dark-theme");
  };

  return (
    <div>
      <button className="toggle-button" onClick={toggleTheme}>
        {isDarkTheme ? "🌙" : "☀️"}
      </button>
      <h1>Weather Monitoring System</h1>
      <div className="card-container">
        {weatherData?.map((data, index) => (
          <div className="weather-card" key={index}>
            <h2>
              {data.city} {getTimeEmoji(data.dt)} {/* Time-based emoji */}
            </h2>
            <p>
              {getTemperatureEmoji(data.temp)} Temperature:{" "}
              {data.temp.toFixed(2)} °C
            </p>
            <p>
              {getFeelsLikeEmoji(data.feels_like)} Feels Like:{" "}
              {data.feels_like.toFixed(2)} °C
            </p>
            <p>📅 Date & Time: {data.dt.toString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDashboard;
