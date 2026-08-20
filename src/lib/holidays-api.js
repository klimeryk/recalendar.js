const HOLIDAYS_API_BASE = 'https://tallyfy.com/national-holidays/api';

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }

  return response.json();
}

let countriesPromise = null;

export function fetchCountries() {
  if (!countriesPromise) {
    countriesPromise = fetchJson(`${HOLIDAYS_API_BASE}/index.json`)
      .then((data) => ({
        countries: data.countries || [],
        yearsCovered: data.years_covered || [],
      }))
      .catch((error) => {
        countriesPromise = null;
        throw error;
      });
  }

  return countriesPromise;
}

export async function fetchHolidays(code, year) {
  const data = await fetchJson(`${HOLIDAYS_API_BASE}/${code}/${year}.json`);
  return data.holidays || [];
}
