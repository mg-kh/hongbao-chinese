import CustomBreadCrumb from "@/components/CustomBreadCrumb/CustomBreadCrumb";
import { DASHBOARD } from "@/constants/DashboardRoutes";
import { Box, Button, Group } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import EditDrawer from "../EditDrawer/EditDrawer";
import useContainer from "./useContainer";

const UserPage = () => {
  const { open, opened } = useContainer();
  return (
    <>
      <Box p={10}>
        <Group justify="space-between">
          <CustomBreadCrumb
            title="Users"
            links={[
              { label: "Dashboard", href: DASHBOARD, isActive: true },
              { label: "Users", href: "", isActive: false },
            ]}
          />
        </Group>
      </Box>
      {opened && <EditDrawer />}
    </>
  );
};

export default UserPage;
