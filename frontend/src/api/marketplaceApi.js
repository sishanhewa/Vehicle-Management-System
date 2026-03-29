// Connecting via the Android Emulator's dedicated Localhost Bridge
export const API_URL = 'http://10.0.2.2:5000/api/marketplace';
import * as SecureStore from 'expo-secure-store';

export const fetchListings = async (queryParams = {}) => {
  const params = new URLSearchParams(queryParams);
  const response = await fetch(`${API_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to fetch listings');
  return response.json();
};

export const createListing = async (formData) => {
  const token = await SecureStore.getItemAsync('userToken');

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData,
  });
  if (!response.ok) throw new Error('Failed to create listing');
  return response.json();
};

export const fetchMyListings = async () => {
  const token = await SecureStore.getItemAsync('userToken');
  const response = await fetch(`${API_URL}/my-listings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to fetch your listings');
  return response.json();
};

export const deleteListingAPI = async (id) => {
  const token = await SecureStore.getItemAsync('userToken');
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error('Failed to delete listing');
  return response.json();
};
