// src/utils/weather.js
const API = 'https://api.openweathermap.org/data/2.5/weather';
const KEY = import.meta.env.VITE_OWM_KEY;

if (!KEY) {
  console.warn('[weather.js] ⚠️ Kein VITE_OWM_KEY gefunden. Check deine .env-Datei!');
}

/**
 * Holt Wetterdaten von OpenWeatherMap
 * @param {Object} opts
 * @param {string} [opts.city] - Stadtname (z.B. 'London')
 * @param {string} [opts.country] - Ländercode (z.B. 'uk')
 * @param {number} [opts.lat] - Latitude
 * @param {number} [opts.lon] - Longitude
 * @param {string} [opts.units='metric'] - Einheit: 'metric' | 'imperial'
 * @param {string} [opts.lang='de'] - Sprache
 * @returns {Promise<Object>} Wetterdaten
 */
export async function getWeather({ city, country, lat, lon, units = 'metric', lang = 'de' } = {}) {
  const params = new URLSearchParams({ appid: KEY, units, lang });

  if (city) {
    params.set('q', country ? `${city},${country}` : city);
  } else if (lat && lon) {
    params.set('lat', lat);
    params.set('lon', lon);
  } else {
    throw new Error('Bitte entweder city oder lat/lon angeben!');
  }

  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error(`API Error ${res.status}: ${res.statusText}`);

  return await res.json();
}
