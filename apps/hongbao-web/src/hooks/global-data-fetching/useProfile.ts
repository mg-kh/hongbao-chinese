import useApiQuery from "../fetching/useApiQuery";

export type TProfileRes = {
  id: string;
  name: string;
  imageUrl: string | null;
  clerkId: string;
  email: string;
  role: string;
  createdAt: string;
};

const useProfile = () => {
  const { data, isLoading } = useApiQuery<TProfileRes, TProfileRes>({
    url: `me`,
    key: "profile",
    select: (data) => data,
  });

  return {
    data,
    isLoading,
  };
};

export default useProfile;
