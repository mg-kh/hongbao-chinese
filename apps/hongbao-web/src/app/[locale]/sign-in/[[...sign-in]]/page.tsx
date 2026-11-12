import { SignIn } from "@clerk/nextjs";
import { Center, Container } from "@mantine/core";

export default function Page() {
  return (
    <Container size={"sm"}>
      <Center>
        <SignIn />
      </Center>
    </Container>
  );
}
