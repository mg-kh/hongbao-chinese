import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Overlay,
  Radio,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import useContainer from "./useContainer";

const DailyLesson = () => {
  const {
    handleCelebrate,
    canvasRef,
    showErrorOverlay,
    setShowErrorOverlay,
    showSuccessOverlay,
    setShowSuccessOverlay,
  } = useContainer();
  return (
    <Box p={10}>
      <Stack className="relative">
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 9999,
          }}
        />
        <Stack gap={0}>
          <Text fw="bold" className="text-base! sm:text-xl!">
            TODAY&apos;S LESSON - Giving Directions
          </Text>
          <Text c={"gray.6"} size="sm">
            Choose the correct answer
          </Text>
        </Stack>
        <Stack className="relative">
          {showErrorOverlay && (
            <Overlay
              zIndex={0}
              bg={"hongbao-cream.0"}
              backgroundOpacity={1}
              bdrs={15}
            >
              <Center w={"100R"} h={"100%"}>
                <Stack align="center">
                  <Stack gap={0}>
                    <Image
                      src="./assets/images/error.svg"
                      w={100}
                      mx={"auto"}
                      alt=""
                    />
                    <Text>Almost there! Give it another try.</Text>
                  </Stack>
                  <Button
                    onClick={() => {
                      setShowErrorOverlay(false);
                    }}
                    color="hongbao-red"
                  >
                    Try again
                  </Button>
                </Stack>
              </Center>
            </Overlay>
          )}
          {showSuccessOverlay && (
            <Overlay
              zIndex={0}
              bg={"hongbao-cream.0"}
              backgroundOpacity={1}
              bdrs={15}
            >
              <Center w={"100R"} h={"100%"}>
                <Stack align="center">
                  <Stack gap={0}>
                    <Image
                      src="./assets/images/correct.svg"
                      w={100}
                      mx={"auto"}
                      alt=""
                    />
                    <Text>Correct! Great job.</Text>
                  </Stack>
                  <Button
                    onClick={() => {
                      setShowSuccessOverlay(false);
                    }}
                    color="green"
                  >
                    Close
                  </Button>
                </Stack>
              </Center>
            </Overlay>
          )}
          <Flex
            bg={"hongbao-cream.0"}
            mih={150}
            bdrs={15}
            align={"center"}
            justify={"center"}
          >
            <Stack gap={10}>
              <Text size="35px" ta={"center"}>
                现在几点？
              </Text>
              <Text size="lg" ta={"center"} c={"gray"}>
                Xiànzài jǐ diǎn?
              </Text>
            </Stack>
          </Flex>
          {/* options */}
          <Radio.Group>
            <SimpleGrid cols={{ base: 1, xs: 2 }} spacing={10}>
              <Radio.Card
                checked={true}
                bdrs={15}
                p={10}
                bg="hongbao-red"
                c={"white"}
                ta={"center"}
              >
                What time is it?
              </Radio.Card>
              <Radio.Card checked={true} bdrs={15} p={10} ta={"center"}>
                What did you eat?
              </Radio.Card>
              <Radio.Card
                onClick={() => {
                  setShowErrorOverlay(true);
                }}
                checked={true}
                bdrs={15}
                p={10}
                ta={"center"}
              >
                What is your name?
              </Radio.Card>
              <Radio.Card
                onClick={() => {
                  setShowSuccessOverlay(true);
                  handleCelebrate();
                }}
                checked={true}
                bdrs={15}
                p={10}
                ta={"center"}
              >
                What is this?
              </Radio.Card>
            </SimpleGrid>
          </Radio.Group>
        </Stack>
      </Stack>
    </Box>
  );
};

export default DailyLesson;
