document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "WVBBBUZG6Z3KAL8TFGSR35A4B"; // Your Visual Crossing API key
  const weatherBox = document.getElementById("weatherBox");
  const searchBtn = document.getElementById("searchBtn");
  const cityInput = document.getElementById("cityInput");

  // Auto fetch with geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latlon = `${position.coords.latitude},${position.coords.longitude}`;
        getWeatherByLocation(latlon);
      },
      () => {
        weatherBox.innerHTML = "<p>Location access denied. Please search manually.</p>";
      }
    );
  }

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city === "") {
      alert("Please enter a city name.");
      return;
    }
    getWeatherByLocation(city);
  });

  cityInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });

  function getWeatherByLocation(location) {
    weatherBox.innerHTML = "<p>Loading weather data...</p>";
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=metric&key=${apiKey}&include=current`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const current = data.currentConditions;
        const condition = current.conditions.toLowerCase();

        setBackground(condition); // 🌈 Set background dynamically

        weatherBox.innerHTML = `
          <h2>${data.resolvedAddress}</h2>
          <p><strong>${current.conditions}</strong></p>
          <p>🌡️ Temp: ${current.temp}°C</p>
          <p>💧 Humidity: ${current.humidity}%</p>
          <p>💨 Wind: ${current.windspeed} km/h</p>
        `;
      })
      .catch(err => {
        console.error(err);
        weatherBox.innerHTML = `<p>Error: Couldn't fetch weather data.</p>`;
      });
  }

  function setBackground(condition) {
    const body = document.body;

    if (condition.includes("clear")) {
      body.style.background = "linear-gradient(to right, #56ccf2, #2f80ed)";
    } else if (condition.includes("cloud")) {
      body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
      body.style.background = "linear-gradient(to right, #4e54c8, #8f94fb)";
    } else if (condition.includes("thunder")) {
      body.style.background = "linear-gradient(to right, #373B44, #4286f4)";
    } else if (condition.includes("snow")) {
      body.style.background = "linear-gradient(to right, #83a4d4, #b6fbff)";
    } else if (condition.includes("fog") || condition.includes("mist") || condition.includes("haze")) {
      body.style.background = "linear-gradient(to right, #757F9A, #D7DDE8)";
    } else {
      body.style.background = "linear-gradient(to right, #74ebd5, #9face6)";
    }
  }
});
