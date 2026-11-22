import { ActionIcon, CopyButton, Text, Tooltip } from "@mantine/core";
import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

interface Props {
  value: string;
}

/** Monospace value with a copy-to-clipboard button. */
const CopyableText: React.FC<Props> = ({ value }) => (
  <div className="flex min-w-0 items-center gap-1">
    <Text size="sm" className="font-mono! break-all! select-all!">
      {value}
    </Text>
    <CopyButton value={value} timeout={1500}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow>
          <ActionIcon
            size="sm"
            variant="subtle"
            color={copied ? "green" : "gray"}
            onClick={copy}
            aria-label={`Copy ${value}`}
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  </div>
);

export default CopyableText;
