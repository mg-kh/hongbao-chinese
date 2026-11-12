import useProfile from "@/hooks/global-data-fetching/useProfile";

const useContainer = () => {
  const { data: user } = useProfile();

  return {
    user,
  };
};

export default useContainer;
