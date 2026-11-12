import { cn } from "@/utils/cn";
import { Center, Loader, LoaderProps, Paper } from "@mantine/core";
import React from "react";

interface Props extends LoaderProps {
  h?: number | string;
  wrapperClass?: string;
}

const LoaderComponent: React.FC<Props> = ({
  h = 100,
  wrapperClass = "",
  ...props
}) => {
  return (
    <Center className={cn(wrapperClass)} h={h}>
      <Paper bg={"white"} py={20} px={30} bdrs={15}>
        <Loader color="blue" {...props} />
      </Paper>
    </Center>
  );
};

export default LoaderComponent;
