import { createAuthenticatedClient } from './authService';

// API base URL
const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000/api/v1';

/**
 * Make an authenticated API request
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  accessToken?: string | null
): Promise<T> => {
  try {
    const url = `${API_URL}${endpoint}`;
    
    // Set up headers
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    // Add authorization header if token is provided
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    
    // Make the request
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Include cookies for authentication
    });
    
    // Handle non-2xx responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    
    // Parse and return the response data
    const data = await response.json();
    return data.data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Recipe service functions
 */
export const recipeService = {
  // Get all recipes
  getAllRecipes: async (accessToken?: string | null) => {
    return apiRequest<any[]>('/recipes', { method: 'GET' }, accessToken);
  },
  
  // Get recipe by ID
  getRecipeById: async (id: string, accessToken?: string | null) => {
    return apiRequest<any>(`/recipes/${id}`, { method: 'GET' }, accessToken);
  },
  
  // Create a new recipe
  createRecipe: async (recipeData: any, accessToken?: string | null) => {
    return apiRequest<any>(
      '/recipes',
      {
        method: 'POST',
        body: JSON.stringify(recipeData),
      },
      accessToken
    );
  },
  
  // Update a recipe
  updateRecipe: async (id: string, recipeData: any, accessToken?: string | null) => {
    return apiRequest<any>(
      `/recipes/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(recipeData),
      },
      accessToken
    );
  },
  
  // Delete a recipe
  deleteRecipe: async (id: string, accessToken?: string | null) => {
    return apiRequest<void>(`/recipes/${id}`, { method: 'DELETE' }, accessToken);
  },
};