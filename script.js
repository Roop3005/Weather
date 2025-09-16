async function getForecast() {
  const city = document.getElementById("cityInput").value.trim();
  const apiKey = "284533648e104c16b1b32653252108"; // Replace with your WeatherAPI key
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API request failed");

    const data = await response.json();
    const forecast = data.forecast.forecastday;

    let html = `<h2>${data.location.name}, ${data.location.country}</h2>`;
    html += `<div class="forecast-grid">`;

    forecast.forEach(day => {
      html += `
        <div class="forecast-card">
          <p><strong>${day.date}</strong></p>
          <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
          <p>${day.day.condition.text}</p>
          <p>🌡️ ${day.day.maxtemp_c}°C / ${day.day.mintemp_c}°C</p>
          <p>💧 ${day.day.daily_chance_of_rain}% chance of rain</p>
        </div>
      `;
    });

    html += `</div>`;
    document.getElementById("weatherResult").innerHTML = html;

    // Animate overlay based on today's weather
    updateOverlay(forecast[0].day.condition.text);

  } catch (error) {
    document.getElementById("weatherResult").innerHTML = `<p>City not found or API error.</p>`;
  }
}

function updateOverlay(weather) {
  const overlay = document.getElementById("weatherOverlay");
  overlay.innerHTML = "";

  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour <= 18;

  if (weather.includes("Clear")) {
    overlay.innerHTML = isDay
      ? `<svg width="100%" height="100%">
          <circle cx="50%" cy="30%" r="40" fill="gold" />
          <g>
            ${[...Array(12)].map((_, i) => {
              const angle = i * 30;
              const x1 = 50 + Math.cos(angle * Math.PI / 180) * 50;
              const y1 = 30 + Math.sin(angle * Math.PI / 180) * 50;
              const x2 = 50 + Math.cos(angle * Math.PI / 180) * 70;
              const y2 = 30 + Math.sin(angle * Math.PI / 180) * 70;
              return `<line x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%" stroke="gold" stroke-width="2">
                        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                      </line>`;
            }).join("")}
          </g>
        </svg>`
      : `<svg width="100%" height="100%">
          <circle cx="50%" cy="30%" r="30" fill="#fdf6e3">
            <animate attributeName="r" values="30;35;30" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.8;1;0.8" dur="3s" repeatCount="indefinite" />
          </circle>
        </svg>`;
  } else if (weather.includes("Cloud")) {
    overlay.innerHTML = `
      <svg width="100%" height="100%">
        <circle cx="0%" cy="30%" r="60" fill="#ccc">
          <animate attributeName="cx" values="0%;100%;0%" dur="12s" repeatCount="indefinite" />
        </circle>
        <circle cx="100%" cy="40%" r="40" fill="#bbb">
          <animate attributeName="cx" values="100%;0%;100%" dur="15s" repeatCount="indefinite" />
        </circle>
      </svg>`;
  } else if (weather.includes("Thunder")) {
    overlay.innerHTML = `
      <svg width="100%" height="100%">
        <polygon points="50,15 60,35 40,35 50,55" fill="yellow">
          <animate attributeName="opacity" values="1;0;1" dur="0.5s" repeatCount="indefinite" />
        </polygon>
      </svg>`;
  } else if (weather.includes("Snow")) {
    overlay.innerHTML = `
      <svg width="100%" height="100%">
        <circle cx="20%" cy="0" r="5" fill="white">
          <animate attributeName="cy" values="0;100%" dur="5s" repeatCount="indefinite" />
        </circle>
        <circle cx="50%" cy="0" r="5" fill="white">
          <animate attributeName="cy" values="0;100%" dur="6s" repeatCount="indefinite" />
        </circle>
        <circle cx="80%" cy="0" r="5" fill="white">
          <animate attributeName="cy" values="0;100%" dur="4s" repeatCount="indefinite" />
        </circle>
      </svg>`;
  }
}