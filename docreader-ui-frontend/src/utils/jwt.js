export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function isJwtExpired(token) {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (!decoded || !decoded.exp) return false; // if no exp, treat as valid or let server decide
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
