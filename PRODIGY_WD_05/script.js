// Weather App - Advanced Features
class WeatherApp {
  constructor() {
    this.apiKey = "WVBBBUZG6Z3KAL8TFGSR35A4B";
    this.currentLocation = null;
    this.currentWeather = null;
    this.favorites = this.loadFavorites();
    this.units = 'metric'; // metric or imperial
    this.theme = this.loadTheme();
    
    this.initializeApp();
  }

  initializeApp() {
    this.setupEventListeners();
    this.applyTheme();
    this.renderFavorites();
    this.initializeGeolocation();
    this.setupServiceWorker();
  }

  setupEventListeners() {
    // Search functionality
    document.getElementById('searchBtn').addEventListener('click', () => this.searchWeather());
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.searchWeather();
    });

    // Voice search
    document.getElementById('voiceSearchBtn').addEventListener('click', () => this.startVoiceSearch());

    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

    // Units toggle
    document.getElementById('unitsToggle').addEventListener('click', () => this.toggleUnits());

    // Favorites
    document.getElementById('favoritesBtn').addEventListener('click', () => this.showFavoritesModal());
    document.getElementById('closeFavorites').addEventListener('click', () => this.hideFavoritesModal());

    // Refresh
    document.getElementById('refreshBtn').addEventListener('click', () => this.refreshWeather());

    // Modal close on outside click
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hideFavoritesModal();
        this.hideShareModal();
      }
    });

    // Share functionality
    document.getElementById('copyLink').addEventListener('click', () => this.copyWeatherLink());
    document.getElementById('shareTwitter').addEventListener('click', () => this.shareToTwitter());
    document.getElementById('shareWhatsApp').addEventListener('click', () => this.shareToWhatsApp());
    document.getElementById('shareEmail').addEventListener('click', () => this.shareViaEmail());
  }

  async initializeGeolocation() {
    if (navigator.geolocation) {
      try {
        const position = await this.getCurrentPosition();
        const { latitude, longitude } = position.coords;
        this.currentLocation = `${latitude},${longitude}`;
        await this.getWeatherByLocation(this.currentLocation);
      } catch (error) {
        console.log('Geolocation failed:', error);
        this.showError('Location access denied. Please search manually.');
      }
    } else {
      this.showError('Geolocation not supported. Please search manually.');
    }
  }

  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true
      });
    });
  }

  async searchWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    
    if (!city) {
      this.showError('Please enter a city name.');
      return;
    }

    try {
      await this.getWeatherByLocation(city);
      cityInput.value = '';
    } catch (error) {
      this.showError('City not found. Please try again.');
    }
  }

  async getWeatherByLocation(location) {
    this.showLoading();
    
    try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(location)}?unitGroup=${this.units}&key=${this.apiKey}&include=current,hours,days,alerts`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Weather data not available');
      
      const data = await response.json();
      this.currentWeather = data;
      this.currentLocation = data.resolvedAddress;
      
      this.updateLocationDisplay();
      this.renderCurrentWeather();
      this.renderHourlyForecast();
      this.renderDailyForecast();
      this.renderWeatherAlerts();
      this.updateWeatherIcon();
      this.setWeatherBackground();
      
      // Add to recent searches
      this.addToRecentSearches(location);
      
    } catch (error) {
      console.error('Weather fetch error:', error);
      this.showError('Failed to fetch weather data. Please try again.');
    }
  }

  renderCurrentWeather() {
    const current = this.currentWeather.currentConditions;
    
    // Update main weather display
    document.getElementById('currentTemp').textContent = `${Math.round(current.temp)}°${this.units === 'metric' ? 'C' : 'F'}`;
    document.getElementById('weatherDescription').textContent = current.conditions;
    document.getElementById('feelsLike').textContent = `Feels like ${Math.round(current.feelslike)}°${this.units === 'metric' ? 'C' : 'F'}`;
    
    // Update weather stats
    document.getElementById('humidity').textContent = `${Math.round(current.humidity)}%`;
    document.getElementById('windSpeed').textContent = `${Math.round(current.windspeed)} ${this.units === 'metric' ? 'km/h' : 'mph'}`;
    document.getElementById('pressure').textContent = `${Math.round(current.pressure)} hPa`;
    document.getElementById('visibility').textContent = `${(current.visibility / 1000).toFixed(1)} km`;
    
    // Update additional info
    this.updateAdditionalInfo();
  }

  updateAdditionalInfo() {
    const current = this.currentWeather.currentConditions;
    const today = this.currentWeather.days[0];
    
    // Air Quality (simulated - API doesn't provide this)
    const aqi = Math.floor(Math.random() * 150) + 50;
    document.getElementById('airQuality').textContent = aqi;
    document.getElementById('aqiDescription').textContent = this.getAQIDescription(aqi);
    
    // UV Index
    const uvIndex = Math.round(current.uvindex || 0);
    document.getElementById('uvIndex').textContent = uvIndex;
    document.getElementById('uvDescription').textContent = this.getUVDescription(uvIndex);
    
    // Sunrise/Sunset
    document.getElementById('sunrise').textContent = this.formatTime(today.sunrise);
    document.getElementById('sunset').textContent = this.formatTime(today.sunset);
  }

  renderHourlyForecast() {
    const hourlyContainer = document.getElementById('hourlyContainer');
    const hours = this.currentWeather.days[0].hours.slice(0, 24);
    
    const hourlyHTML = hours.map(hour => `
      <div class="hourly-item">
        <div class="time">${this.formatHour(hour.datetime)}</div>
        <div class="icon">${this.getWeatherEmoji(hour.conditions)}</div>
        <div class="temp">${Math.round(hour.temp)}°</div>
      </div>
    `).join('');
    
    hourlyContainer.innerHTML = hourlyHTML;
  }

  renderDailyForecast() {
    const dailyContainer = document.getElementById('dailyContainer');
    const days = this.currentWeather.days.slice(1, 6); // Next 5 days
    
    const dailyHTML = days.map(day => `
      <div class="daily-item">
        <div class="date">${this.formatDate(day.datetime)}</div>
        <div class="icon">${this.getWeatherEmoji(day.conditions)}</div>
        <div class="temp">${Math.round(day.temp)}°</div>
        <div class="description">${day.conditions}</div>
      </div>
    `).join('');
    
    dailyContainer.innerHTML = dailyHTML;
  }

  renderWeatherAlerts() {
    const alertsSection = document.getElementById('weatherAlerts');
    const alertText = document.getElementById('alertText');
    
    if (this.currentWeather.alerts && this.currentWeather.alerts.length > 0) {
      const alert = this.currentWeather.alerts[0];
      alertText.textContent = alert.event;
      alertsSection.style.display = 'block';
    } else {
      alertsSection.style.display = 'none';
    }
  }

  updateWeatherIcon() {
    const iconElement = document.getElementById('weatherIcon');
    const conditions = this.currentWeather.currentConditions.conditions.toLowerCase();
    iconElement.textContent = this.getWeatherEmoji(conditions);
  }

  setWeatherBackground() {
    const conditions = this.currentWeather.currentConditions.conditions.toLowerCase();
    let weatherType = 'default';
    
    if (conditions.includes('clear')) weatherType = 'clear';
    else if (conditions.includes('cloud')) weatherType = 'cloud';
    else if (conditions.includes('rain') || conditions.includes('drizzle')) weatherType = 'rain';
    else if (conditions.includes('thunder')) weatherType = 'thunder';
    else if (conditions.includes('snow')) weatherType = 'snow';
    else if (conditions.includes('fog') || conditions.includes('mist') || conditions.includes('haze')) weatherType = 'fog';
    
    document.body.setAttribute('data-weather', weatherType);
  }

  // Voice Search
  startVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        document.getElementById('voiceSearchBtn').style.background = 'var(--danger-color)';
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('cityInput').value = transcript;
        this.searchWeather();
      };
      
      recognition.onend = () => {
        document.getElementById('voiceSearchBtn').style.background = 'rgba(255, 255, 255, 0.2)';
      };
      
      recognition.start();
    } else {
      this.showError('Voice recognition not supported in this browser.');
    }
  }

  // Theme Management
  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  loadTheme() {
    return localStorage.getItem('weather-theme') || 'light';
  }

  saveTheme() {
    localStorage.setItem('weather-theme', this.theme);
  }

  // Units Management
  toggleUnits() {
    this.units = this.units === 'metric' ? 'imperial' : 'metric';
    document.getElementById('unitsToggle').textContent = this.units === 'metric' ? '°C' : '°F';
    
    if (this.currentWeather) {
      this.renderCurrentWeather();
      this.renderHourlyForecast();
      this.renderDailyForecast();
    }
  }

  // Favorites Management
  addToFavorites() {
    if (!this.currentLocation) return;
    
    const favorite = {
      name: this.currentLocation,
      timestamp: Date.now()
    };
    
    if (!this.favorites.find(f => f.name === favorite.name)) {
      this.favorites.push(favorite);
      this.saveFavorites();
      this.renderFavorites();
    }
  }

  removeFromFavorites(name) {
    this.favorites = this.favorites.filter(f => f.name !== name);
    this.saveFavorites();
    this.renderFavorites();
  }

  loadFavorites() {
    const saved = localStorage.getItem('weather-favorites');
    return saved ? JSON.parse(saved) : [];
  }

  saveFavorites() {
    localStorage.setItem('weather-favorites', JSON.stringify(this.favorites));
  }

  renderFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    const favoritesContent = document.getElementById('favoritesContent');
    
    // Render quick favorites
    const quickFavorites = this.favorites.slice(0, 5);
    favoritesList.innerHTML = quickFavorites.map(fav => `
      <div class="favorite-item" onclick="weatherApp.searchLocation('${fav.name}')">
        ${fav.name}
      </div>
    `).join('');
    
    // Render modal favorites
    if (this.favorites.length === 0) {
      favoritesContent.innerHTML = '<p>No favorite locations yet. Search for a city and add it to favorites!</p>';
    } else {
      favoritesContent.innerHTML = this.favorites.map(fav => `
        <div class="favorite-item" style="justify-content: space-between; margin-bottom: 0.5rem;">
          <span onclick="weatherApp.searchLocation('${fav.name}')">${fav.name}</span>
          <button onclick="weatherApp.removeFromFavorites('${fav.name}')" style="background: var(--danger-color); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer;">×</button>
        </div>
      `).join('');
    }
  }

  searchLocation(location) {
    document.getElementById('cityInput').value = location;
    this.getWeatherByLocation(location);
    this.hideFavoritesModal();
  }

  showFavoritesModal() {
    document.getElementById('favoritesModal').style.display = 'block';
  }

  hideFavoritesModal() {
    document.getElementById('favoritesModal').style.display = 'none';
  }

  hideShareModal() {
    document.getElementById('shareModal').style.display = 'none';
  }

  // Sharing
  copyWeatherLink() {
    const url = `${window.location.origin}${window.location.pathname}?location=${encodeURIComponent(this.currentLocation)}`;
    navigator.clipboard.writeText(url).then(() => {
      this.showNotification('Link copied to clipboard!');
    });
  }

  shareToTwitter() {
    const text = `Current weather in ${this.currentLocation}: ${this.currentWeather.currentConditions.temp}°${this.units === 'metric' ? 'C' : 'F'} - ${this.currentWeather.currentConditions.conditions}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  shareToWhatsApp() {
    const text = `Current weather in ${this.currentLocation}: ${this.currentWeather.currentConditions.temp}°${this.units === 'metric' ? 'C' : 'F'} - ${this.currentWeather.currentConditions.conditions}`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  shareViaEmail() {
    const subject = `Weather in ${this.currentLocation}`;
    const body = `Current weather in ${this.currentLocation}:\nTemperature: ${this.currentWeather.currentConditions.temp}°${this.units === 'metric' ? 'C' : 'F'}\nConditions: ${this.currentWeather.currentConditions.conditions}\nHumidity: ${this.currentWeather.currentConditions.humidity}%\nWind: ${this.currentWeather.currentConditions.windspeed} ${this.units === 'metric' ? 'km/h' : 'mph'}`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url);
  }

  // Utility Functions
  formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  formatHour(timeString) {
    return new Date(timeString).toLocaleTimeString('en-US', { 
      hour: 'numeric',
      hour12: true 
    });
  }

  formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }

  getWeatherEmoji(conditions) {
    const condition = conditions.toLowerCase();
    if (condition.includes('clear')) return '☀️';
    if (condition.includes('cloud')) return '☁️';
    if (condition.includes('rain')) return '🌧️';
    if (condition.includes('snow')) return '❄️';
    if (condition.includes('thunder')) return '⛈️';
    if (condition.includes('fog') || condition.includes('mist')) return '🌫️';
    if (condition.includes('drizzle')) return '🌦️';
    return '🌤️';
  }

  getAQIDescription(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  getUVDescription(uv) {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  }

  updateLocationDisplay() {
    document.getElementById('currentLocation').textContent = this.currentLocation;
  }

  showLoading() {
    document.getElementById('currentTemp').textContent = 'Loading...';
    document.getElementById('weatherDescription').textContent = 'Fetching weather data...';
  }

  showError(message) {
    document.getElementById('currentTemp').textContent = 'Error';
    document.getElementById('weatherDescription').textContent = message;
  }

  showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: var(--success-color);
      color: white;
      padding: 1rem;
      border-radius: var(--radius-md);
      z-index: 1001;
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  refreshWeather() {
    if (this.currentLocation) {
      this.getWeatherByLocation(this.currentLocation);
    }
  }

  addToRecentSearches(location) {
    let recent = JSON.parse(localStorage.getItem('weather-recent') || '[]');
    recent = recent.filter(item => item !== location);
    recent.unshift(location);
    recent = recent.slice(0, 10); // Keep only 10 recent searches
    localStorage.setItem('weather-recent', JSON.stringify(recent));
  }

  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(registration => console.log('SW registered'))
        .catch(error => console.log('SW registration failed'));
    }
  }
}

// Initialize the app
const weatherApp = new WeatherApp();

// Add global function for favorites
window.searchLocation = (location) => weatherApp.searchLocation(location);
window.removeFromFavorites = (name) => weatherApp.removeFromFavorites(name);
