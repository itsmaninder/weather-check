import React, { useState, useEffect } from "react";
import "./Weather.css";

const Weather = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [nearbyCities, setNearbyCities] = useState([]);
  const API_KEY = "12a910a6216ab6dcd12568e63c6a5345"; // Replace with your OpenWeather API key

  // Fetch weather by city name
  const fetchWeatherByCity = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        fetchNearbyCities(data.coord.lat, data.coord.lon);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Fetch weather by coordinates (latitude & longitude)
  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod === 200) {
        setWeather(data);
        fetchNearbyCities(lat, lon);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  // Fetch nearby cities weather
  const fetchNearbyCities = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/find?lat=${lat}&lon=${lon}&cnt=5&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setNearbyCities(data.list);
    } catch (error) {
      console.error("Error fetching nearby cities:", error);
    }
  };

  // Get user's current location when the component mounts
  useEffect(() => {
    let isMounted = true;

    if (navigator.geolocation && isMounted) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (isMounted) {
            const { latitude, longitude } = position.coords;
            fetchWeatherByCoords(latitude, longitude);
          }
        },
        (error) => {
          if (isMounted) {
            console.error("Geolocation error:", error);
            alert("Location access denied. Please enter a city manually.");
          }
        }
      );
    } else {
      if (isMounted) alert("Geolocation is not supported by your browser.");
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="weather-container">
      <h1 className="title">🌤 Weather App</h1>
      <div className="search-area">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search for location"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={() => fetchWeatherByCity(city)}>Get Weather</button>
        </div>
      </div>

      {weather && (
        <div className="city-weather">
          <h4 className="city-name">
            {weather.name}, {weather.sys.country}
          </h4>
          <div className="city-temp">
            <h2>{weather.main.temp}°C</h2>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <div className="temp-detail">
              <h3>{weather.weather[0].description}</h3>
              <p>Feels like {weather.main.feels_like}°C</p>
            </div>
          </div>
          <div className="info-wrap">
            <div className="info">
              <div className="info-lbl">Wind</div>
              <div className="info-name">{weather.wind.speed} m/s</div>
            </div>
            <div className="info">
              <div className="info-lbl">Pressure</div>
              <div className="info-name">{weather.main.pressure} hPa</div>
            </div>
            <div className="info">
              <div className="info-lbl">Humidity</div>
              <div className="info-name">{weather.main.humidity}%</div>
            </div>
            <div className="info">
              <div className="info-lbl">Min. Temp</div>
              <div className="info-name">{weather.main.temp_min}°C</div>
            </div>
            <div className="info">
              <div className="info-lbl">Max. Temp</div>
              <div className="info-name">{weather.main.temp_max}°C</div>
            </div>
          </div>
        </div>
      )}

      {nearbyCities.length > 0 && (
        <div className="nearby-cities">
          <h3>Nearby Locations</h3>
          <div className="cities-list">
            {nearbyCities.map((city) => (
              <div key={city.id} className="city-card">
                <h4 className="city-name">{city.name}</h4>
                <div className="details">
                  <img
                    src={`https://openweathermap.org/img/wn/${city.weather[0].icon}@2x.png`}
                    alt={city.weather[0].description}
                  />
                  <div className="city-details">
                    <h3>{city.main.temp}°C</h3>
                    <p>{city.weather[0].description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather;
