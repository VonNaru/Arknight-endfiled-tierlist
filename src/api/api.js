const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api`;

// Export API_URL for use in other components
export { API_URL };

// Characters API
export const characterAPI = {
  // Get all characters
  getAll: async () => {
    const response = await fetch(`${API_URL}/characters`);
    if (!response.ok) throw new Error('Failed to fetch characters');
    return response.json();
  },

  // Get character by ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/characters/${id}`);
    if (!response.ok) throw new Error('Failed to fetch character');
    return response.json();
  },

  // Add new character
  add: async (characterData) => {
    const response = await fetch(`${API_URL}/characters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData),
    });
    if (!response.ok) throw new Error('Failed to add character');
    return response.json();
  },

  // Update character
  update: async (id, characterData) => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(characterData),
    });
    if (!response.ok) throw new Error('Failed to update character');
    return response.json();
  },

  // Delete character
  delete: async (id) => {
    const response = await fetch(`${API_URL}/characters/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete character');
    return response.json();
  },

  // Get character ratings
  getRatings: async (id) => {
    const response = await fetch(`${API_URL}/characters/${id}/ratings`);
    if (!response.ok) throw new Error('Failed to fetch ratings');
    return response.json();
  },

  // Add rating to character
  addRating: async (id, ratingData) => {
    const response = await fetch(`${API_URL}/characters/${id}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ratingData),
    });
    if (!response.ok) throw new Error('Failed to add rating');
    return response.json();
  },
};

// Tier Lists API
export const tierListAPI = {
  // Get all tier lists
  getAll: async () => {
    const response = await fetch(`${API_URL}/tierlists`);
    if (!response.ok) throw new Error('Failed to fetch tier lists');
    return response.json();
  },

  // Get tier list by ID
  getById: async (id) => {
    const response = await fetch(`${API_URL}/tierlists/${id}`);
    if (!response.ok) throw new Error('Failed to fetch tier list');
    return response.json();
  },

  // Create new tier list
  create: async (tierListData) => {
    const response = await fetch(`${API_URL}/tierlists`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tierListData),
    });
    if (!response.ok) throw new Error('Failed to create tier list');
    return response.json();
  },

  // Update tier list
  update: async (id, tierListData) => {
    const response = await fetch(`${API_URL}/tierlists/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tierListData),
    });
    if (!response.ok) throw new Error('Failed to update tier list');
    return response.json();
  },

  // Delete tier list
  delete: async (id) => {
    const response = await fetch(`${API_URL}/tierlists/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete tier list');
    return response.json();
  },
};
