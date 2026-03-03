/**
 * weatherHelpers.js
 * Utility functions for temperature conversion, icon mapping,
 * gradient selection, and data processing.
 */

// ─── Temperature ─────────────────────────────────────────────────────────────

/**
 * Convert a temperature value to the requested unit.
 * Input is always in Celsius (API default).
 */
export const convertTemp = (tempCelsius, unit) => {
  if (unit === 'fahrenheit') {
    return Math.round((tempCelsius * 9) / 5 + 32);
  }
  return Math.round(tempCelsius);
};

// ─── Background Gradients ────────────────────────────────────────────────────

/**
 * Return a Tailwind gradient string based on OWM condition code.
 * Condition code reference: https://openweathermap.org/weather-conditions
 */
export const getBackgroundGradient = (conditionCode) => {
  if (!conditionCode) return 'from-blue-950 via-blue-900 to-slate-900';

  const code = parseInt(conditionCode, 10);

  // Thunderstorm (200–232) → dark purple
  if (code >= 200 && code < 300)
    return 'from-purple-950 via-gray-900 to-slate-900';

  // Drizzle (300–321) → muted grey-blue
  if (code >= 300 && code < 400)
    return 'from-slate-800 via-slate-900 to-blue-950';

  // Rain (500–531) → deep grey-blue
  if (code >= 500 && code < 600)
    return 'from-slate-900 via-blue-950 to-gray-900';

  // Snow (600–622) → cold blue-slate
  if (code >= 600 && code < 700)
    return 'from-slate-800 via-blue-900 to-slate-900';

  // Atmosphere / Fog (700–781) → grey
  if (code >= 700 && code < 800)
    return 'from-gray-800 via-gray-700 to-slate-800';

  // Clear sky (800) → deep blue / warm orange depending on day
  if (code === 800) return 'from-blue-950 via-blue-900 to-indigo-900';

  // Few clouds (801) → blue with slight grey
  if (code === 801) return 'from-blue-950 via-slate-800 to-blue-900';

  // Scattered / broken / overcast clouds (802–804) → dark grey
  if (code >= 802) return 'from-slate-900 via-gray-800 to-slate-800';

  return 'from-blue-950 via-blue-900 to-slate-900';
};

// ─── Weather Icon Mapping ─────────────────────────────────────────────────────

/**
 * Maps an OWM condition code to a Lucide icon name + animation + colour.
 * Returns strings so callers can import icons themselves (avoids circular deps).
 */
export const getWeatherIconInfo = (conditionCode) => {
  if (!conditionCode) {
    return { iconName: 'Cloud', animation: 'animate-pulse-slow', color: 'text-gray-300' };
  }

  const code = parseInt(conditionCode, 10);

  if (code >= 200 && code < 300)
    return { iconName: 'CloudLightning', animation: 'animate-pulse', color: 'text-yellow-300' };

  if (code >= 300 && code < 400)
    return { iconName: 'CloudDrizzle', animation: 'animate-bounce-slow', color: 'text-blue-300' };

  if (code >= 500 && code < 600)
    return { iconName: 'CloudRain', animation: 'animate-bounce-slow', color: 'text-blue-400' };

  if (code >= 600 && code < 700)
    return { iconName: 'CloudSnow', animation: 'animate-float', color: 'text-blue-100' };

  if (code >= 700 && code < 800)
    return { iconName: 'CloudFog', animation: 'animate-pulse-slow', color: 'text-gray-300' };

  if (code === 800)
    return { iconName: 'Sun', animation: 'animate-spin-slow', color: 'text-yellow-400' };

  if (code === 801)
    return { iconName: 'CloudSun', animation: 'animate-float', color: 'text-yellow-300' };

  if (code >= 802)
    return { iconName: 'Cloud', animation: 'animate-float', color: 'text-gray-300' };

  return { iconName: 'Cloud', animation: 'animate-pulse-slow', color: 'text-gray-300' };
};

// ─── Date / Time ──────────────────────────────────────────────────────────────

/**
 * Format a Unix timestamp + UTC offset (in seconds) to a long date string.
 * Uses UTC internally because we manually apply the timezone offset.
 */
export const formatDate = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
};

/**
 * Return a short 3-letter weekday name (e.g. "Mon") from a Unix timestamp.
 */
export const getDayName = (timestamp, timezone = 0) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
};

// ─── UV Index ────────────────────────────────────────────────────────────────

export const getUVIndexInfo = (uvi) => {
  if (uvi == null) return { level: 'N/A', color: 'text-gray-400', barWidth: 'w-0' };
  if (uvi <= 2) return { level: 'Low', color: 'text-green-400', barWidth: 'w-1/5' };
  if (uvi <= 5) return { level: 'Moderate', color: 'text-yellow-400', barWidth: 'w-2/5' };
  if (uvi <= 7) return { level: 'High', color: 'text-orange-400', barWidth: 'w-3/5' };
  if (uvi <= 10) return { level: 'Very High', color: 'text-red-400', barWidth: 'w-4/5' };
  return { level: 'Extreme', color: 'text-purple-400', barWidth: 'w-full' };
};

// ─── Wind ─────────────────────────────────────────────────────────────────────

export const getWindDirection = (degrees) => {
  if (degrees == null) return '';
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
};

/** Convert m/s (OWM default) to km/h */
export const msToKmh = (ms) => Math.round(ms * 3.6);

// ─── Forecast Processing ──────────────────────────────────────────────────────

/**
 * Collapse the 3-hourly forecast list into one entry per calendar day.
 * Returns max 5 days, each with: dt, high, low, condition.
 */
export const processForecastData = (forecastList, timezone = 0) => {
  const dailyMap = {};

  forecastList.forEach((item) => {
    // Shift by timezone so grouping is by local calendar day
    const localDate = new Date((item.dt + timezone) * 1000);
    const dayKey = localDate.toISOString().split('T')[0]; // e.g. "2024-01-15"

    if (!dailyMap[dayKey]) {
      dailyMap[dayKey] = {
        dt: item.dt,
        temps: [],
        condition: item.weather[0],
      };
    }

    dailyMap[dayKey].temps.push(item.main.temp);

    // Prefer the midday slot for the representative condition
    const localHour = localDate.getUTCHours();
    if (localHour >= 11 && localHour <= 14) {
      dailyMap[dayKey].condition = item.weather[0];
    }
  });

  return Object.values(dailyMap)
    .slice(0, 5)
    .map((day) => ({
      dt: day.dt,
      high: Math.round(Math.max(...day.temps)),
      low: Math.round(Math.min(...day.temps)),
      condition: day.condition,
    }));
};
