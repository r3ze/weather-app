import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { processForecastData } from '../utils/weatherHelpers';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

/**
 * useWeather — custom hook that owns all weather API logic and state.
 *
 * Exposes:
 *   weather          — OWM /weather response object
 *   forecast         — processed 5-day array
 *   uvIndex          — numeric UV value (null if unavailable)
 *   loading          — boolean
 *   error            — string | null
 *   unit             — 'celsius' | 'fahrenheit'
 *   fetchWeatherByCity(cityName)
 *   detectLocation()
 *   toggleUnit()
 */
const useWeather = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [uvIndex, setUvIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState('celsius');

  // ─── Internal: fetch UV index (non-critical, fails silently) ───────────────
  const fetchUV = async (lat, lon) => {
    try {
      const res = await axios.get(`${BASE_URL}/uvi`, {
        params: { lat, lon, appid: API_KEY },
      });
      return res.data.value ?? null;
    } catch {
      return null;
    }
  };

  // ─── Fetch by lat/lon ──────────────────────────────────────────────────────
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    if (!API_KEY) {
      setError('API key is missing. Create a .env file with VITE_WEATHER_API_KEY.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = { lat, lon, appid: API_KEY, units: 'metric' };

      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${BASE_URL}/weather`, { params }),
        axios.get(`${BASE_URL}/forecast`, { params }),
      ]);

      const uvi = await fetchUV(lat, lon);

      setWeather(weatherRes.data);
      setForecast(
        processForecastData(forecastRes.data.list, weatherRes.data.timezone)
      );
      setUvIndex(uvi);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to fetch weather data. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Fetch by city name ────────────────────────────────────────────────────
  const fetchWeatherByCity = useCallback(
    async (city) => {
      if (!API_KEY) {
        setError('API key is missing. Create a .env file with VITE_WEATHER_API_KEY.');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = { q: city, appid: API_KEY, units: 'metric' };

        const [weatherRes, forecastRes] = await Promise.all([
          axios.get(`${BASE_URL}/weather`, { params }),
          axios.get(`${BASE_URL}/forecast`, { params }),
        ]);

        const { lat, lon } = weatherRes.data.coord;
        const uvi = await fetchUV(lat, lon);

        setWeather(weatherRes.data);
        setForecast(
          processForecastData(forecastRes.data.list, weatherRes.data.timezone)
        );
        setUvIndex(uvi);
      } catch (err) {
        if (err.response?.status === 404) {
          setError(`City "${city}" not found. Check the spelling and try again.`);
        } else {
          setError(
            err.response?.data?.message ||
              'Failed to fetch weather data. Please try again.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // ─── Geolocation ──────────────────────────────────────────────────────────
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchWeatherByCoords(coords.latitude, coords.longitude);
      },
      () => {
        setLoading(false);
        setError(
          'Location access denied. Please search for a city manually.'
        );
      },
      { timeout: 10000 }
    );
  }, [fetchWeatherByCoords]);

  // ─── Unit toggle ──────────────────────────────────────────────────────────
  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'));
  }, []);

  // ─── Auto-detect on mount ─────────────────────────────────────────────────
  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  return {
    weather,
    forecast,
    uvIndex,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    detectLocation,
    toggleUnit,
  };
};

export default useWeather;
