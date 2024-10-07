export const DEBUG = true;
export const API_SERVER = DEBUG
  ? "http://localhost:8000"
  : `https://${window.location.host}/api`;
export const WS_SERVER = DEBUG
  ? "ws://localhost:8000"
  : `wss://${window.location.host}/ws`;
