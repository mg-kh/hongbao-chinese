import createHttpService from "@/utils/createHttpService";
import { useAuth } from "@clerk/nextjs";

const useFetcher = () => {
  const { getToken } = useAuth();

  const HttpService = createHttpService(() =>
    getToken({ template: "dev_token" }),
  );

  return { HttpService };
};

export default useFetcher;
