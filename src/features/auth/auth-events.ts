export const AUTH_UNAUTHORIZED_EVENT = "auth:unauthorized";

export function emitUnauthorizedEvent() {
  window.dispatchEvent(new CustomEvent(AUTH_UNAUTHORIZED_EVENT));
}
