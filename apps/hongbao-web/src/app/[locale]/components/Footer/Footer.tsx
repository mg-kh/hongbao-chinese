import { Link } from "@/i18n/navigation";
import {
  Box,
  Container,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconMail,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import useContainer from "./useContainer";

const Footer = () => {
  const t = useTranslations("Footer");
  const { courses } = useContainer();
  return (
    <footer>
      <Box py={{ base: 60, md: 100 }} bg={"dark.9"}>
        <Container size={"xl"} px={{ base: 16, sm: 24 }}>
          <Box>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <div className="sm:col-span-2 lg:col-span-1">
                <Stack>
                  <Link href="/">
                    <Group
                      gap={10}
                      align="center"
                      bg={"#fff8f2"}
                      className="w-fit!"
                      px={15}
                      py={10}
                      bdrs={15}
                    >
                      <Image
                        src={"/assets/logo.svg"}
                        width={60}
                        height={60}
                        alt="logo"
                      />
                      <Stack gap={0}>
                        <Text fw={"bolder"} size="xl" c={"hongbao-red"}>
                          Hong Bao
                        </Text>
                        <Text fw={"bold"} c={"gray.7"}>
                          {t("tagline")}
                        </Text>
                      </Stack>
                    </Group>
                  </Link>
                  <Text c={"gray"} maw={"90%"}>
                    {t("description")}
                  </Text>
                  <Group>
                    <ThemeIcon
                      color="gray.8"
                      radius={"xl"}
                      size={35}
                      p={7}
                      className="transition-colors! duration-200! hover:bg-hongbao-red-600!"
                    >
                      <IconMail color="gray" />
                    </ThemeIcon>
                    <ThemeIcon
                      color="gray.8"
                      radius={"xl"}
                      size={35}
                      p={7}
                      className="transition-colors! duration-200! hover:bg-hongbao-red-600!"
                    >
                      <IconBrandFacebook color="gray" />
                    </ThemeIcon>
                    <ThemeIcon
                      color="gray.8"
                      radius={"xl"}
                      size={35}
                      p={7}
                      className="transition-colors! duration-200! hover:bg-hongbao-red-600!"
                    >
                      <IconBrandTiktok color="gray" />
                    </ThemeIcon>
                    <ThemeIcon
                      color="gray.8"
                      radius={"xl"}
                      size={35}
                      p={7}
                      className="transition-colors! duration-200! hover:bg-hongbao-red-600!"
                    >
                      <IconBrandLinkedin color="gray" />
                    </ThemeIcon>
                  </Group>
                </Stack>
              </div>
              <div>
                <Box>
                  <Stack gap={10}>
                    <Text c={"#dee2e6"} size="lg">
                      {t("courses")}
                    </Text>
                    {courses?.map((c) => {
                      return (
                        <Link key={c.id} href={`/course-detail/${c?.id}`}>
                          <Text
                            key={c.id}
                            c={"gray"}
                            size="sm"
                            className="transition-colors! duration-200! hover:text-hongbao-red-300!"
                          >
                            {c?.title}
                          </Text>
                        </Link>
                      );
                    })}
                  </Stack>
                </Box>
              </div>
              <div>
                <Stack gap={10}>
                  <Text c={"#dee2e6"} size="lg">
                    {t("support")}
                  </Text>
                  <Link href="/privacy-policy">
                    <Text
                      c={"gray"}
                      size="sm"
                      className="transition-colors! duration-200! hover:text-hongbao-red-300!"
                    >
                      {t("privacy_policy")}
                    </Text>
                  </Link>
                </Stack>
              </div>
              <div className="hidden lg:block">
                <Box
                  bdrs={20}
                  h={150}
                  className="bg-gradient-to-br! from-hongbao-red-800! to-hongbao-maroon-800! flex! items-center! justify-center!"
                >
                  <Image
                    src={"/assets/logo.svg"}
                    width={56}
                    height={56}
                    alt="logo"
                    className="opacity-70"
                  />
                </Box>
              </div>
            </div>
          </Box>
          <Divider color={"gray.6"} my={30} />
          <Group justify="space-between">
            <Text c={"gray"} size="sm">
              {t("copyright", { year: new Date().getFullYear() })}
            </Text>
          </Group>
        </Container>
      </Box>
    </footer>
  );
};

export default Footer;
