export const getAuthHeaders = () => {
    const authToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null; // Safely access localStorage
    return authToken
      ? {
          Authorization: `Bearer ${authToken}`,
        }
      : {};
  };