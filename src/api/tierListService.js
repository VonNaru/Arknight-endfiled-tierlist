import { API_URL } from './api';

// Get all tier lists
export const getTierLists = async () => {
  try {
    const response = await fetch(`${API_URL}/tierlists`);
    if (!response.ok) throw new Error('Failed to fetch tier lists');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tier lists:', error);
    throw error;
  }
};

// Get tier list by ID with items
export const getTierListById = async (tierListId) => {
  try {
    const response = await fetch(`${API_URL}/tierlists/${tierListId}`);
    if (!response.ok) throw new Error('Failed to fetch tier list');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tier list:', error);
    throw error;
  }
};

// Create new tier list
export const createTierList = async (tierListData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tierlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tierListData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create tier list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating tier list:', error);
    throw error;
  }
};

// Update tier list
export const updateTierList = async (tierListId, tierListData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tierlists/${tierListId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tierListData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update tier list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating tier list:', error);
    throw error;
  }
};

// Delete tier list
export const deleteTierList = async (tierListId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tierlists/${tierListId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete tier list');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting tier list:', error);
    throw error;
  }
};

// Add character to tier list
export const addCharacterToTierList = async (tierListId, characterId, tier) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tierlists/${tierListId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ character_id: characterId, tier }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add character');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding character:', error);
    throw error;
  }
};

// Remove character from tier list
export const removeCharacterFromTierList = async (tierListId, itemId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tierlists/${tierListId}/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to remove character');
    }
    return await response.json();
  } catch (error) {
    console.error('Error removing character:', error);
    throw error;
  }
};

// Update character tier in tier list
export const updateCharacterTierInList = async (tierListId, itemId, tier) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/tierlists/${tierListId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ tier }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update tier');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating tier:', error);
    throw error;
  }
};
