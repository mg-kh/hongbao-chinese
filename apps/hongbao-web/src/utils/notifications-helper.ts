import { notifications } from "@mantine/notifications";

export const showSuccessNoti = (message?: string | undefined) => {
  notifications.show({
    message: message || "Success",
  });
};

export const showErrorNoti = (message?: string | undefined) => {
  notifications.show({
    message: message || "Something went wrong",
    color: "red",
  });
};
