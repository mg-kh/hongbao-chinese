"use client";

import { TPurchaseActionTarget } from "@/app/[locale]/(dashboard)/dashboard/users/purchases/hooks/usePurchaseActions";
import { Button, Group, Stack, Text, Textarea } from "@mantine/core";
import useContainer from "./useContainer";

interface Props {
  purchase: Pick<TPurchaseActionTarget, "orderNo" | "user">;
  onSubmit: (reason: string) => void;
  onCancel: () => void;
}

const RejectModal: React.FC<Props> = ({ purchase, onSubmit, onCancel }) => {
  const { register, errors, submit } = useContainer(onSubmit);

  return (
    <form onSubmit={submit}>
      <Stack gap={12}>
        <Text size="sm">
          Reject order {purchase.orderNo} for{" "}
          {purchase.user?.name ?? "this user"}? The user will be notified with
          the reason below.
        </Text>
        <Textarea
          label="Reason"
          placeholder="e.g. Transaction number not found in our account"
          autosize
          minRows={3}
          maxLength={500}
          data-autofocus
          withAsterisk
          error={errors.reason && "Please enter a reason (max 500 characters)"}
          {...register("reason")}
        />
        <Group justify="end" gap={8}>
          <Button variant="default" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" color="red">
            Reject
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default RejectModal;
