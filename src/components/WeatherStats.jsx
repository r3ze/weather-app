import { Droplets, Wind, Gauge, Eye } from 'lucide-react';
import PropTypes from 'prop-types';
import { getUVIndexInfo, getWindDirection, msToKmh } from '../utils/weatherHelpers';

/**
 * StatCard — individual stat tile with glass effect.
 */
const StatCard = ({ icon: Icon, label, value, subValue, iconBg }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 md:p-5 flex items-center gap-4 animate-fade-in">
    <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </div>
    <div className="min-w-0">
      <p className="text-white/50 text-xs uppercase tracking-wide">{label}</p>
      <p className="text-white text-lg md:text-xl font-semibold leading-tight truncate">
        {value}
      </p>
      {subValue && (
        <p className="text-white/50 text-xs mt-0.5">{subValue}</p>
      )}
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  subValue: PropTypes.string,
  iconBg: PropTypes.string.isRequired,
};

StatCard.defaultProps = {
  subValue: undefined,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const humidityLabel = (h) => {
  if (h > 70) return 'High';
  if (h > 40) return 'Moderate';
  return 'Low';
};

const visibilityLabel = (v) => {
  if (v >= 10000) return 'Excellent';
  if (v >= 5000) return 'Moderate';
  return 'Poor';
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * WeatherStats
 * Renders a 2-column grid of stat cards: Humidity, Wind, UV Index, Visibility.
 */
const WeatherStats = ({ weather, uvIndex }) => {
  const { main, wind, visibility } = weather;
  const uvInfo = getUVIndexInfo(uvIndex);
  const windDir = getWindDirection(wind.deg);
  const windSpeed = msToKmh(wind.speed);

  const stats = [
    {
      icon: Droplets,
      label: 'Humidity',
      value: `${main.humidity}%`,
      subValue: humidityLabel(main.humidity),
      iconBg: 'bg-blue-500/30',
    },
    {
      icon: Wind,
      label: 'Wind Speed',
      value: `${windSpeed} km/h`,
      subValue: windDir ? `Direction: ${windDir}` : undefined,
      iconBg: 'bg-cyan-500/30',
    },
    {
      icon: Gauge,
      label: 'UV Index',
      value: uvIndex != null ? String(Math.round(uvIndex)) : 'N/A',
      subValue: uvInfo.level,
      iconBg: 'bg-orange-500/30',
    },
    {
      icon: Eye,
      label: 'Visibility',
      value: visibility ? `${(visibility / 1000).toFixed(1)} km` : 'N/A',
      subValue: visibility ? visibilityLabel(visibility) : undefined,
      iconBg: 'bg-purple-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
};

WeatherStats.propTypes = {
  weather: PropTypes.shape({
    main: PropTypes.shape({
      humidity: PropTypes.number.isRequired,
    }).isRequired,
    wind: PropTypes.shape({
      speed: PropTypes.number.isRequired,
      deg: PropTypes.number,
    }).isRequired,
    visibility: PropTypes.number,
  }).isRequired,
  uvIndex: PropTypes.number,
};

WeatherStats.defaultProps = {
  uvIndex: null,
};

export default WeatherStats;
