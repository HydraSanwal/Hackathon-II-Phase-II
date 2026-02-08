// Authentication functions for the frontend
// Connects to the backend API

export const signIn = async (email: string, password: string) => {
  // Sign in implementation
  const response = await fetch('http://localhost:8000/api/v1/auth/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to sign in');
  }

  const data = await response.json();
  localStorage.setItem('auth_token', data.access_token);
  // Set cookie for middleware
  document.cookie = `auth_token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
  return data;
};

export const signUp = async (email: string, password: string) => {
  // Sign up implementation - note: name is not required by backend
  const response = await fetch('http://localhost:8000/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to sign up');
  }

  const data = await response.json();
  localStorage.setItem('auth_token', data.access_token);
  // Set cookie for middleware
  document.cookie = `auth_token=${data.access_token}; path=/; max-age=604800; SameSite=Lax`;
  return data;
};

export const signOut = async () => {
  // Clear the token from localStorage and cookie
  localStorage.removeItem('auth_token');
  document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
};

export const checkAuthState = (): { isAuthenticated: boolean; user?: any } => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    return { isAuthenticated: false };
  }

  // In a real app, you might decode the JWT to get user info
  // For now, just return that the user is authenticated
  return {
    isAuthenticated: true,
    user: { id: 'current-user-id', email: 'current@example.com' } // Would come from decoded token
  };
};