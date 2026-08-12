// src/utils/jwt.js

// Simulates generating a JWT token on the server
export const generateToken = (user) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  
  const payload = btoa(JSON.stringify({
    id: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + 3600000 // Token expires in 1 hour
  }));
  
  const signature = btoa("secret_signature_for_experiment");
  
  return `${header}.${payload}.${signature}`;
};

// Decodes the token to extract user information
export const decodeToken = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    // Check if token is expired
    if (payload.exp < Date.now()) {
      return null; 
    }
    return payload;
  } catch (error) {
    return null;
  }
};