"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { Tabs } from "@mantine/core";
import { last, split } from "lodash";

interface Props {
  tabRoutes: {
    label: string;
    path: string;
    icon?: React.ReactNode;
  }[];
}

const TabRoutes: React.FC<Props> = ({ tabRoutes }) => {
  const pathname = usePathname();

  return (
    <Tabs defaultValue={last(split(pathname, "/"))} variant="pills">
      <Tabs.List>
        {tabRoutes?.map((t) => {
          return (
            <Link href={t.path} key={t.label}>
              <Tabs.Tab value={t.path} leftSection={t.icon}>
                {t.label}
              </Tabs.Tab>
            </Link>
          );
        })}
      </Tabs.List>
    </Tabs>
  );
};

export default TabRoutes;
