export function decodeJWT(token: string) {
    try {
      // Split the token into its three parts
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('The token is invalid');
      }
  
      // Decode the payload part (second part)
      const payload = parts[1];
      const decodedPayload = atob(payload.replace(/_/g, '/').replace(/-/g, '+'));
  
      // Parse the payload as JSON and return it
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
  