import { useEffect, useState } from 'react';

const CONDITIONS = {
  0: 'Clear',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Cloudy',
  45: 'Foggy',
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail',
};

export default function LocalWeather() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    let cancelled = false;

    if (!navigator.geolocation) return undefined;

    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const params = new URLSearchParams({
          latitude: String(coords.latitude),
          longitude: String(coords.longitude),
          current: 'temperature_2m,weather_code',
          temperature_unit: 'celsius',
          timezone: 'auto',
        });
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
        if (!response.ok) return;

        const data = await response.json();
        const temperature = data.current?.temperature_2m;
        const condition = CONDITIONS[data.current?.weather_code];
        if (!cancelled && Number.isFinite(temperature) && condition) {
          setWeather({ temperature: Math.round(temperature), condition });
        }
      } catch {
        // Weather is optional; keep the sidebar quiet when the lookup fails.
      }
    }, () => {
      // Location permission may be denied or unavailable.
    }, { enableHighAccuracy: false, maximumAge: 15 * 60_000, timeout: 8_000 });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!weather) return null;

  return (
    <span className="block text-right font-mono text-[10px] font-normal text-muted">
      {weather.temperature}°C · {weather.condition}
    </span>
  );
}
