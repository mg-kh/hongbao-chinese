import { Avatar, Flex, Paper, Stack, Text } from "@mantine/core";
import React from "react";

const ProfileCard = () => {
  return (
    <Paper py={30} withBorder bdrs={15}>
      <Stack justify="center" gap={10}>
        <Flex justify={"center"}>
          <Avatar
            src={"/assets/logo-head.svg"}
            bg={"hongbao-red.0"}
            p={10}
            size={"lg"}
          />
        </Flex>
        <Text ta={"center"}>Kaung Htet</Text>
      </Stack>
    </Paper>
  );
};

export default ProfileCard;
