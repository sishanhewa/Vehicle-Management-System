// Connecting via the Android Emulator's dedicated Localhost Bridge
export const API_URL = 'http://10.0.2.2:5000/api/marketplace';

export const fetchListings = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
};

export const createListing = async (formData) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    // We let the browser/fetch automatically boundary logic for multipart/form-data
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create listing');
  return response.json();
};
