import axios from "axios";

const createHttpService = (getToken: () => Promise<string | null>) => {
  const HttpService = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  });

  HttpService.interceptors.request.use(
    async (config) => {
      const token = await getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        delete config.headers["Authorization"];
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  HttpService.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return HttpService;
};
export default createHttpService;
