const AUTH_TOKEN_KEY = "agency.auth.token";
const USER_TYPE_KEY = "agency.user.type";

export function saveAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveUserType(userType: "agency" | "client") {
  localStorage.setItem(USER_TYPE_KEY, userType);
}

export function getUserType() {
  return localStorage.getItem(USER_TYPE_KEY) as "agency" | "client" | null;
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(USER_TYPE_KEY);
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
