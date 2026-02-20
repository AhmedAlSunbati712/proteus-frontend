const AUTH_TOKEN_KEY = "auth_token";

export { AUTH_TOKEN_KEY };

type AxiosLike = {
  defaults: { headers: { common: Record<string, unknown> } };
};

export function setCredentials(axiosInstance: AxiosLike, token: string): void {
  if (!token) return;
  axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearCredentials(axiosInstance: AxiosLike): void {
  delete axiosInstance.defaults.headers.common["Authorization"];
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function restoreCredentials(axiosInstance: AxiosLike): void {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
}
