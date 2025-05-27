const BASE_URL = "https://api.openweathermap.org/data/2.5/";
const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

export const fetchWeatherByCity = async (cityName) => {
  try {
    const response = await fetch(
      `${BASE_URL}weather?q=${cityName}&appid=${API_KEY}&units=metric`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export const fetchWeatherByCoords = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

export const fetchNearbyCities = async (lat, lon) => {
  try {
    const response = await fetch(
      `${BASE_URL}find?lat=${lat}&lon=${lon}&cnt=4&appid=${API_KEY}&units=metric`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching nearby cities:", error);
  }
};
