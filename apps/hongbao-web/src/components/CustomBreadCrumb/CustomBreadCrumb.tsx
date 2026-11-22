"use client";

import { Link } from "@/i18n/navigation";
import {
  ActionIcon,
  Anchor,
  Breadcrumbs,
  Group,
  Stack,
  Text,
  Title,
  Tooltip,
} from "@mantine/core";
import { IconArrowLeft, IconChevronRight } from "@tabler/icons-react";

interface Props {
  title?: string;
  links?: { label: string; href: string; isActive: boolean }[];
  /** Where the back arrow goes. Defaults to the last clickable breadcrumb (the parent page). */
  backHref?: string;
  hideBack?: boolean;
}

const CustomBreadCrumb = ({
  title = "",
  links = [],
  backHref,
  hideBack = false,
}: Props) => {
  const parentLink = links.filter((link) => link.isActive).at(-1);
  const resolvedBackHref = backHref ?? parentLink?.href;
  const showBack = !hideBack && !!resolvedBackHref;
  const backLabel =
    !backHref && parentLink ? `Back to ${parentLink.label}` : "Go back";

  return (
    <Group gap="md" align="center" wrap="nowrap" miw={0}>
      {showBack && (
        <Tooltip label={backLabel} withArrow openDelay={300}>
          <ActionIcon
            component={Link}
            href={resolvedBackHref}
            variant="default"
            radius="md"
            size={36}
            aria-label={backLabel}
            style={{ flexShrink: 0 }}
          >
            <IconArrowLeft size={18} stroke={2} />
          </ActionIcon>
        </Tooltip>
      )}

      <Stack gap={2} miw={0}>
        {links.length > 0 && (
          <Breadcrumbs
            separator={
              <IconChevronRight
                size={12}
                stroke={2}
                style={{ color: "var(--mantine-color-gray-5)" }}
              />
            }
            styles={{
              root: { flexWrap: "nowrap", overflow: "hidden" },
              separator: { marginInline: 4 },
              breadcrumb: { whiteSpace: "nowrap" },
            }}
          >
            {links.map((link, index) =>
              link.isActive ? (
                <Anchor
                  key={index}
                  component={Link}
                  href={link.href}
                  c="dimmed"
                  fz="xs"
                  underline="hover"
                >
                  {link.label}
                </Anchor>
              ) : (
                <Text
                  key={index}
                  c="dark.4"
                  fw={500}
                  fz="xs"
                  truncate
                  aria-current="page"
                >
                  {link.label}
                </Text>
              ),
            )}
          </Breadcrumbs>
        )}

        {title && (
          <Title order={3} lh={1.25} lineClamp={1}>
            {title}
          </Title>
        )}
      </Stack>
    </Group>
  );
};

export default CustomBreadCrumb;
