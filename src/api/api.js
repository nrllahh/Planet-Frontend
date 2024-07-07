import axios from "axios";
import { store } from "../data/store";

const ax = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

ax.interceptors.request.use(
  function (config) {
    config.headers["Content-Type"] = "application/json";

    const accessToken = localStorage.getItem("accessToken");
    if (accessToken !== null) {
      config.headers["Authorization"] = `Bearer ${localStorage.getItem(
        "accessToken"
      )}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

ax.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    if (error.response.status === 401 && (await sendSignInRefreshRequest())) {
      store.dispatch(authenticate());
      return ax(error.config);
    }

    window.location.href = "/SignIn";
    return Promise.reject(error);
  }
);

async function sendSignInRefreshRequest() {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken === null || refreshToken === null) {
    return false;
  }

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  var response = await api.post("Users/SignInRefresh", {
    body: {
      accessToken,
      refreshToken,
    },
  });

  if (response.status !== 200 || !response.data.header.isSuccess) {
    return false;
  }

  localStorage.setItem("accessToken", response.data.body.accessToken);
  localStorage.setItem("refreshToken", response.data.body.refreshToken);

  return true;
}

const api = {
  get: async function (path, params = {}) {
    try {
      const response = await ax.get(path, {
        params,
      });

      return parseApiResponse(response);
    } catch (e) {
      console.error(e);
      return {
        isSuccess: false,
        message: "Bilinmeyen bir hata oluştu!",
      };
    }
  },
  post: async function (path, body) {
    try {
      const response = await ax.post(path, body);

      return parseApiResponse(response);
    } catch (e) {
      console.error(e);

      return {
        isSuccess: false,
        message: "Bilinmeyen bir hata oluştu!",
      };
    }
  },
};

function parseApiResponse(response) {
  const isSuccess = response.data.header.isSuccess;
  const message = response.data.header.message;
  const validationMessages = response.data.header.validationMessages;
  const body = response.data.body;

  return {
    isSuccess,
    message,
    validationMessages,
    body,
  };
}

export default api;
