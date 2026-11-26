import RubyButtonComponent from "@/components/Buttons/RubyButtonComponent/RubyButtonComponent";
import {
  Box,
  Button,
  Flex,
  Paper,
  Stack,
  Tabs,
  TextInput,
} from "@mantine/core";
import { IconRepeat } from "@tabler/icons-react";
import HanziWriter from "hanzi-writer";
import { useEffect, useRef, useState } from "react";

const sampleChars = ["随", "游", "勤", "稳", "警"];

const StrokeStyle = () => {
  const [input, setInput] = useState("随");
  const [char, setChar] = useState("随");
  const writerRef = useRef<HanziWriter | null>(null);

  useEffect(() => {
    const container = document.getElementById("preview");
    if (!container || !char) return;

    // Clear previous writer
    container.innerHTML = "";

    const writer = HanziWriter.create("preview", char, {
      width: 200,
      height: 200,
      padding: 5,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 100,
      delayBetweenLoops: 3000,
    });

    writer.loopCharacterAnimation();
    writerRef.current = writer;

    return () => {
      container.innerHTML = "";
      writerRef.current = null;
    };
  }, [char]);

  const handleUpdate = () => {
    const firstChar = input.trim().slice(0, 1);

    if (!firstChar) return;

    setChar(firstChar);
  };

  const handleAnimate = () => {
    writerRef.current?.animateCharacter();
  };

  return (
    <Box p={10}>
      <Stack gap="md">
        <Flex gap={10}>
          <Flex
            bg="var(--hb-tint-cream)"
            w="100%"
            bdrs={15}
            align={"center"}
            justify={"center"}
          >
            <Box id="preview" w={200} h={200} />
          </Flex>
          <Paper
            bg="var(--hb-tint-cream)"
            bdrs={15}
            p={10}
            className="flex-1!"
            withBorder
          >
            <Tabs variant="pills" value={char} orientation="vertical">
              <Tabs.List w={"100%"}>
                {sampleChars?.map((c) => {
                  return (
                    <Tabs.Tab
                      key={c}
                      bdrs={15}
                      value={c}
                      color="hongbao-cream.9"
                      onClick={() => {
                        setChar(c);
                        setInput(c);
                      }}
                      className="w-full! text-lg!"
                    >
                      {c}
                    </Tabs.Tab>
                  );
                })}
              </Tabs.List>
            </Tabs>
          </Paper>
        </Flex>

        <Flex gap={10} className="flex-col! sm:flex-row!">
          <TextInput
            value={input}
            size="lg"
            radius={15}
            variant="filled"
            placeholder="Type a Chinese character"
            styles={{
              input: {
                "--input-bd": "var(--mantine-color-hongbao-red-1)",
                "--input-bg": "var(--mantine-color-white)",
              },
            }}
            onChange={(e) => {
              setInput(e.currentTarget.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleUpdate();
              }
            }}
            className="flex-1"
          />

          <Flex gap={10} className="shrink-0!">
            <Button
              size="lg"
              variant="light"
              color="hongbao-red"
              onClick={handleAnimate}
              aria-label="Replay stroke animation"
            >
              <IconRepeat />
            </Button>
            <RubyButtonComponent
              size="lg"
              onClick={handleUpdate}
              className="flex-1! sm:flex-none!"
            >
              Update
            </RubyButtonComponent>
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );
};

export default StrokeStyle;
