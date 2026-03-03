# WeatherNow

A production-ready weather application built with **React**, **Tailwind CSS**, and the **OpenWeatherMap API**. Features real-time weather data, a 5-day forecast, and a glassmorphism UI with dynamic gradients.

![WeatherNow Preview](https://i.imgur.com/placeholder.png)

---

## Features

- **Auto-detect location** on first load via the browser Geolocation API
- **City search** with a clean, accessible search bar
- **Current conditions** — temperature, feels like, high/low, weather description
- **Animated weather icons** driven by CSS keyframe animations
- **Weather stats** — Humidity, Wind speed & direction, UV Index, Visibility
- **5-day forecast** — daily high/low with weather icons
- **Dynamic background gradients** that change with the weather condition
- **Glassmorphism UI** — `backdrop-filter` blur + semi-transparent cards
- **°C / °F toggle** — seamless unit switching (no re-fetch)
- **Loading skeleton** — polished placeholder while data is loading
- **Error handling** — friendly messages for invalid cities or API failures
- **Fully responsive** — works on mobile, tablet, and desktop

---

## Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | React 18 (hooks: `useState`, `useEffect`, `useCallback`) |
| Styling      | Tailwind CSS 3                      |
| HTTP client  | Axios                               |
| Icons        | Lucide React                        |
| Build tool   | Vite 5                              |
| Weather data | OpenWeatherMap free tier            |

---

## Getting a Free OpenWeatherMap API Key

1. Visit [https://openweathermap.org/api](https://openweathermap.org/api)
2. Click **Sign Up** and create a free account
3. Go to your profile **→ My API Keys**
4. Copy the default key or click **Generate** for a new one
5. The free plan includes:
   - Current weather (`/data/2.5/weather`)
   - 5-day / 3-hour forecast (`/data/2.5/forecast`)
   - UV index (`/data/2.5/uvi`)
   - 1,000 calls/day · 60 calls/minute
6. **Important:** New API keys can take **up to 2 hours** to activate

---

## Project Setup

### Prerequisites

- Node.js 18+ and npm (or pnpm/yarn)
- A free OpenWeatherMap API key (see above)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/weather-app.git
cd weather-app

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Open .env and replace the placeholder with your real API key:
# VITE_WEATHER_API_KEY=abc123yourkeyhere

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build     # outputs to dist/
npm run preview   # preview the production build locally
```

---

## Project Structure

```
weather-app/
├── index.html                   # Vite entry point
├── vite.config.js               # Vite + React plugin config
├── tailwind.config.js           # Tailwind theme + custom animations
├── postcss.config.js            # PostCSS with Tailwind & Autoprefixer
├── .env.example                 # Required environment variables template
├── .env                         # Your local secrets (git-ignored)
└── src/
    ├── main.jsx                 # ReactDOM.createRoot entry
    ├── index.css                # Tailwind directives + global resets
    ├── App.jsx                  # Root component — layout orchestration
    ├── hooks/
    │   └── useWeather.js        # All API logic, state, unit toggling
    ├── utils/
    │   └── weatherHelpers.js    # Pure utility functions
    └── components/
        ├── SearchBar.jsx        # City search input + location button
        ├── CurrentWeather.jsx   # Main temp, icon, city, description
        ├── WeatherStats.jsx     # Humidity / Wind / UV / Visibility grid
        ├── ForecastCard.jsx     # Single day tile in forecast strip
        ├── ForecastSection.jsx  # 5-day forecast container
        └── LoadingSkeleton.jsx  # Pulsing placeholder layout
```

---

## Environment Variables

| Variable               | Required | Description                         |
|------------------------|----------|-------------------------------------|
| `VITE_WEATHER_API_KEY` | ✅ Yes   | Your OpenWeatherMap API key         |

Vite exposes env variables prefixed with `VITE_` to the browser bundle. Never commit your `.env` file to version control.

---

## API Endpoints Used

| Endpoint                              | Purpose                        |
|---------------------------------------|--------------------------------|
| `GET /data/2.5/weather`               | Current weather by city or coords |
| `GET /data/2.5/forecast`              | 3-hourly data for 5 days       |
| `GET /data/2.5/uvi`                   | UV Index (non-critical, fails gracefully) |

---

## Key Design Decisions

### Custom hook (`useWeather.js`)
All API calls, loading state, error state, and unit preference live in a single custom hook. Components remain purely presentational.

### Parallel API calls
`fetchWeatherByCoords` fires both `/weather` and `/forecast` with `Promise.all`, minimising total latency. The UV call follows once we have coordinates.

### Dynamic gradients
`weatherHelpers.getBackgroundGradient(code)` maps OWM condition codes to Tailwind gradient strings. App applies them with `transition-all duration-1000` for a smooth crossfade.

### Timezone-aware forecast grouping
`processForecastData` shifts each 3-hour slot by the city's UTC offset before grouping into calendar days, so forecast days always reflect local time regardless of the user's own timezone.

### Unit conversion without re-fetching
All temperatures are stored in Celsius internally. `convertTemp(temp, unit)` converts on render, so toggling °C/°F never triggers an API call.

---

## License

MIT
