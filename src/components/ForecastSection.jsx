import PropTypes from 'prop-types';
import ForecastCard from './ForecastCard';

/**
 * ForecastSection
 * Wraps the 5-day forecast strip with a header and glass card container.
 * Horizontally scrollable on small screens.
 */
const ForecastSection = ({ forecast, unit, timezone }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 md:p-6 animate-fade-in">
    <h2 className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
      5-Day Forecast
    </h2>

    <div className="flex gap-2 md:gap-3 overflow-x-auto scrollbar-hide pb-1">
      {forecast.map((day) => (
        <ForecastCard
          key={day.dt}
          day={day}
          unit={unit}
          timezone={timezone}
        />
      ))}
    </div>
  </div>
);

ForecastSection.propTypes = {
  forecast: PropTypes.arrayOf(
    PropTypes.shape({
      dt: PropTypes.number.isRequired,
    })
  ).isRequired,
  unit: PropTypes.oneOf(['celsius', 'fahrenheit']).isRequired,
  timezone: PropTypes.number,
};

ForecastSection.defaultProps = {
  timezone: 0,
};

export default ForecastSection;
