import { useParams } from "next/navigation";

const useContainer = () => {
  const { userId } = useParams();

  return {
    userId,
  };
};

export default useContainer;
