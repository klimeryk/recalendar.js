export const ITINERARY_ITEM = 'item';
export const ITINERARY_LINES = 'lines';
export const ITINERARY_NEW_PAGE = 'new_page';

export function parseItineraryProperty(type, property, value) {
  if (property === 'value' && type === ITINERARY_LINES) {
    return Number(value);
  }

  return value;
}
