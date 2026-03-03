import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudSun,
  Thermometer,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { convertTemp, getWeatherIconInfo, formatDate } from '../utils/weatherHelpers';

// Map icon name string → actual Lucide component
const ICON_MAP = {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudSun,
};

/**
 * CurrentWeather
 * Displays the city name, date, main temperature, condition description,
 * animated weather icon, feels-like, and high/low.
 */
const CurrentWeather = ({ weather, unit, onToggleUnit }) => {
  const { name, sys, main, weather: conditions, dt, timezone } = weather;
  const condition = conditions[0];

  const { iconName, animation, color } = getWeatherIconInfo(condition.id);
  const WeatherIcon = ICON_MAP[iconName] ?? Cloud;

  const displayTemp = convertTemp(main.temp, unit);
  const feelsLike = convertTemp(main.feels_like, unit);
  const tempMax = convertTemp(main.temp_max, unit);
  const tempMin = convertTemp(main.temp_min, unit);
  const unitSymbol = unit === 'celsius' ? 'C' : 'F';

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 md:p-8 animate-fade-in">
      {/* Top row: city + toggle */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl md:text-4xl font-bold text-white truncate">
            {name}
          </h1>
          <p className="text-white/60 mt-1 text-sm md:text-base">
            {sys.country} &middot; {formatDate(dt, timezone)}
          </p>
        </div>

        <button
          onClick={onToggleUnit}
          title={`Switch to °${unit === 'celsius' ? 'F' : 'C'}`}
          className="shrink-0 bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/20 text-white rounded-2xl px-4 py-2 font-semibold text-sm transition-all duration-200"
        >
          °{unit === 'celsius' ? 'F' : 'C'}
        </button>
      </div>

      {/* Temperature + Icon row */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: temp block */}
        <div className="flex flex-col gap-1">
          {/* Big number */}
          <div className="flex items-start leading-none">
            <span className="text-7xl md:text-8xl font-thin text-white tracking-tighter">
              {displayTemp}
            </span>
            <span className="text-3xl md:text-4xl text-white/60 mt-2 ml-1">
              °{unitSymbol}
            </span>
          </div>

          {/* Description */}
          <p className="text-white/80 text-lg md:text-xl capitalize mt-2">
            {condition.description}
          </p>

          {/* Feels like */}
          <p className="text-white/50 text-sm">
            Feels like {feelsLike}°{unitSymbol}
          </p>

          {/* High / Low */}
          <div className="flex items-center gap-1 text-white/50 text-sm mt-1">
            <Thermometer className="w-4 h-4 shrink-0" />
            <span>
              H: {tempMax}° &nbsp;·&nbsp; L: {tempMin}°
            </span>
          </div>
        </div>

        {/* Right: animated icon */}
        <div className="shrink-0 flex items-center justify-center">
          <WeatherIcon
            className={`w-24 h-24 md:w-32 md:h-32 ${color} ${animation}`}
            strokeWidth={1}
          />
        </div>
      </div>
    </div>
  );
};

CurrentWeather.propTypes = {
  weather: PropTypes.shape({
    name: PropTypes.string.isRequired,
    sys: PropTypes.shape({ country: PropTypes.string }).isRequired,
    main: PropTypes.shape({
      temp: PropTypes.number.isRequired,
      feels_like: PropTypes.number.isRequired,
      temp_max: PropTypes.number.isRequired,
      temp_min: PropTypes.number.isRequired,
    }).isRequired,
    weather: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
      })
    ).isRequired,
    dt: PropTypes.number.isRequired,
    timezone: PropTypes.number.isRequired,
  }).isRequired,
  unit: PropTypes.oneOf(['celsius', 'fahrenheit']).isRequired,
  onToggleUnit: PropTypes.func.isRequired,
};

export default CurrentWeather;
