import { CloudOff } from 'lucide-react';
import useWeather from './hooks/useWeather';
import { getBackgroundGradient } from './utils/weatherHelpers';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherStats from './components/WeatherStats';
import ForecastSection from './components/ForecastSection';
import LoadingSkeleton from './components/LoadingSkeleton';

/**
 * App — root component.
 * Owns the layout and wires the useWeather hook to all child components.
 * Background gradient transitions smoothly on weather condition change.
 */
const App = () => {
  const {
    weather,
    forecast,
    uvIndex,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    detectLocation,
    toggleUnit,
  } = useWeather();

  const gradient = weather
    ? getBackgroundGradient(weather.weather[0].id)
    : 'from-blue-950 via-blue-900 to-slate-900';

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradient} transition-all duration-1000`}
    >
      <div className="min-h-screen px-4 py-8 md:py-12">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">

          {/* ── App header ───────────────────────────────────────────── */}
          <header className="text-center mb-2 animate-fade-in">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              WeatherNow
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Real-time weather at your fingertips
            </p>
          </header>

          {/* ── Search bar ───────────────────────────────────────────── */}
          <SearchBar
            onSearch={fetchWeatherByCity}
            onDetectLocation={detectLocation}
            loading={loading}
          />

          {/* ── Error banner ─────────────────────────────────────────── */}
          {error && (
            <div
              role="alert"
              className="bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-2xl px-5 py-4 flex items-start gap-3 animate-fade-in"
            >
              <CloudOff className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* ── Loading skeleton ─────────────────────────────────────── */}
          {loading && <LoadingSkeleton />}

          {/* ── Weather content ──────────────────────────────────────── */}
          {!loading && weather && (
            <>
              <CurrentWeather
                weather={weather}
                unit={unit}
                onToggleUnit={toggleUnit}
              />

              <WeatherStats weather={weather} uvIndex={uvIndex} />

              {forecast && forecast.length > 0 && (
                <ForecastSection
                  forecast={forecast}
                  unit={unit}
                  timezone={weather.timezone}
                />
              )}
            </>
          )}

          {/* ── Empty / welcome state ─────────────────────────────────── */}
          {!loading && !weather && !error && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 animate-fade-in">
              <p className="text-white/30 text-base text-center">
                Search for a city or allow location access to get started.
              </p>
            </div>
          )}

          {/* ── Footer ───────────────────────────────────────────────── */}
          <footer className="text-center pt-4 pb-2">
            <p className="text-white/20 text-xs">
              Powered by OpenWeatherMap
            </p>
          </footer>

        </div>
      </div>
    </div>
  );
};

export default App;
