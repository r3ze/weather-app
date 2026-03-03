import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudSun,
} from 'lucide-react';
import PropTypes from 'prop-types';
import { convertTemp, getWeatherIconInfo, getDayName } from '../utils/weatherHelpers';

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
 * ForecastCard
 * Single day tile inside the 5-day forecast strip.
 */
const ForecastCard = ({ day, unit, timezone }) => {
  const { dt, high, low, condition } = day;

  const { iconName, animation, color } = getWeatherIconInfo(condition.id);
  const WeatherIcon = ICON_MAP[iconName] ?? Cloud;

  const dayLabel = getDayName(dt, timezone);
  const hiTemp = convertTemp(high, unit);
  const loTemp = convertTemp(low, unit);

  return (
    <div className="flex flex-col items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 md:p-4 flex-1 min-w-0">
      {/* Day name */}
      <p className="text-white/60 text-xs font-semibold uppercase tracking-wide">
        {dayLabel}
      </p>

      {/* Animated icon */}
      <WeatherIcon
        className={`w-8 h-8 md:w-10 md:h-10 ${color} ${animation}`}
        strokeWidth={1.5}
      />

      {/* Condition description */}
      <p className="text-white/50 text-xs text-center capitalize leading-tight line-clamp-2">
        {condition.description}
      </p>

      {/* High / Low */}
      <div className="flex gap-2 text-sm font-medium">
        <span className="text-white">{hiTemp}°</span>
        <span className="text-white/40">{loTemp}°</span>
      </div>
    </div>
  );
};

ForecastCard.propTypes = {
  day: PropTypes.shape({
    dt: PropTypes.number.isRequired,
    high: PropTypes.number.isRequired,
    low: PropTypes.number.isRequired,
    condition: PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  unit: PropTypes.oneOf(['celsius', 'fahrenheit']).isRequired,
  timezone: PropTypes.number,
};

ForecastCard.defaultProps = {
  timezone: 0,
};

export default ForecastCard;
