import { appParams } from "@/lib/app-params";

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    this.code = data?.code;
  }
}

const getStoredToken = () => appParams.token;

async function request(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  const token = getStoredToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${appParams.apiBaseUrl}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw new ApiError(data?.message || data?.detail || `Request failed (${response.status})`, response.status, data);
  }
  return data;
}

const setToken = (token) => {
  if (token) {
    localStorage.setItem("access_token", token);
    appParams.token = token;
  } else {
    localStorage.removeItem("access_token");
    appParams.token = null;
  }
};

export const api = {
  auth: {
    me: () => request("/auth/me"),
    loginViaEmailPassword: async (email, password) => {
      const result = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setToken(result?.access_token || result?.token);
      return result;
    },
    register: (credentials) => request("/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
    verifyOtp: (payload) => request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
    resendOtp: (email) => request("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
    resetPasswordRequest: (email) => request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
    resetPassword: ({ resetToken, newPassword }) => request("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token: resetToken, password: newPassword }),
    }),
    logout: (redirect = false) => {
      setToken(null);
      if (redirect) window.location.href = "/login";
    },
    redirectToLogin: (returnTo = window.location.pathname) => {
      const query = returnTo && returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : "";
      window.location.href = `/login${query}`;
    },
    loginWithProvider: (provider, returnTo = "/") => {
      const query = `?returnTo=${encodeURIComponent(returnTo)}`;
      window.location.href = `${appParams.apiBaseUrl}/auth/${provider}${query}`;
    },
    setToken,
  },
  entities: {
    User: {
      delete: (id) => request(`/users/${encodeURIComponent(id)}`, { method: "DELETE" }),
    },
  },
  functions: {
    invoke: async (name, body = {}) => ({
      data: await request(`/functions/${encodeURIComponent(name)}`, {
        method: "POST",
        body: JSON.stringify(body),
      }),
    }),
  },
};

export { ApiError };
