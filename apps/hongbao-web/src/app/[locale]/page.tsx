import MobileBottomNav from "@/components/Navbar/MobileBottomNav/MobileBottomNav";
import { publicBottomNavItems } from "@/components/Navbar/MobileBottomNav/publicNavItems";
import ClientLayout from "@/layouts/ClientLayout/ClientLayout";
import { Stack } from "@mantine/core";
import BeginYourJourneyBanner from "./components/BeginYourJourneyBanner/BeginYourJourneyBanner";
import HeroSection from "./components/HeroSection/HeroSection";
import InstallAppSection from "./components/InstallAppSection/InstallAppSection";
import PlanAndPricing from "./components/PlanAndPricing/PlanAndPricing";
import StudentReview from "./components/StudentReview/StudentReview";
import UserGuideVideo from "./components/UserGuideVideo/UserGuideVideo";
import WeOffer from "./components/WeOffer/WeOffer";

export default function Home() {
  return (
    // The bottom bar reserves its own space, so this only needs the footer
    // hidden on mobile.
    <ClientLayout size={"100%"} p={0} hideFooterOnMobile>
      <Stack gap={50}>
        <HeroSection />
        <UserGuideVideo />
        <InstallAppSection />
        <WeOffer />
        <StudentReview />
        <PlanAndPricing />
        <BeginYourJourneyBanner />
      </Stack>

      {/* Mirrors the header's primary nav, which collapses behind the burger
          on mobile - and keeps the Privacy link reachable now that the
          footer is hidden there. */}
      <MobileBottomNav items={publicBottomNavItems} />
    </ClientLayout>
  );
}
