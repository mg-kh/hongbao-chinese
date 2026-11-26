"use client";

import { Paper, Stack, Tabs } from "@mantine/core";
import StrokeStyle from "./components/StrokeStyle/StrokeStyle";
import DailyLesson from "./components/DailyLesson/DailyLesson";

const ToolsPreviewSection = () => {
  return (
    <Paper
      shadow="xl"
      p={20}
      bdrs={24}
      withBorder
      className="border-white/60! bg-surface/90! backdrop-blur-sm!"
    >
      <Stack>
        <Tabs variant="pills" defaultValue="stroke-style">
          <Tabs.List
            className="border! border-hongbao-red-100 rounded-[15px] w-fit!"
            p={5}
          >
            <Tabs.Tab bdrs={15} value="stroke-style" color="hongbao-red">
              Strokes styles
            </Tabs.Tab>
            <Tabs.Tab bdrs={15} value="lesson" color="hongbao-red">
              Today's lesson
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="stroke-style">
            <StrokeStyle />
          </Tabs.Panel>
          <Tabs.Panel value="lesson">
            <DailyLesson />
          </Tabs.Panel>
        </Tabs>
      </Stack>
    </Paper>
  );
};

export default ToolsPreviewSection;
