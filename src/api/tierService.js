import { API_URL } from './api';

// Get all tiers
export const getTiers = async () => {
  try {
    const response = await fetch(`${API_URL}/tiers`);
    if (!response.ok) throw new Error('Failed to fetch tiers');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tiers:', error);
    throw error;
  }
};

// Get tier by ID
export const getTierById = async (tierId) => {
  try {
    const response = await fetch(`${API_URL}/tiers/${tierId}`);
    if (!response.ok) throw new Error('Failed to fetch tier');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tier:', error);
    throw error;
  }
};

// Create new tier (admin only)
export const createTier = async (tierData) => {
  try {
    const response = await fetch(`${API_URL}/tiers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tierData),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create tier');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating tier:', error);
    throw error;
  }
};

// Update tier (admin only)
export const updateTier = async (tierId, tierData) => {
  try {
    const response = await fetch(`${API_URL}/tiers/${tierId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tierData),
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

// Delete tier (admin only)
export const deleteTier = async (tierId) => {
  try {
    const response = await fetch(`${API_URL}/tiers/${tierId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete tier');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting tier:', error);
    throw error;
  }
};

// Get tier statistics
export const getTierStats = async () => {
  try {
    const response = await fetch(`${API_URL}/tiers/stats`);
    if (!response.ok) throw new Error('Failed to fetch tier statistics');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tier statistics:', error);
    throw error;
  }
};
