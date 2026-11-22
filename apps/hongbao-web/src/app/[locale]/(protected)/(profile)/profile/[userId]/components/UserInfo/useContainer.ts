import useProfile from "@/hooks/global-data-fetching/useProfile";
import { useParams } from "next/navigation";

const useContainer = () => {
  const { data: user } = useProfile();
  const { userId } = useParams();

  return {
    user,
    settingsHref: `/profile/${userId}/settings`,
  };
};

export default useContainer;
