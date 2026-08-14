import { Outlet, useLocation } from "react-router";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { CompactHowItWorks } from "../../components/work-opportunities/CompactHowItWorks";
import { WorkOpportunitiesHero } from "../../components/work-opportunities/WorkOpportunitiesHero";
import { WorkOpportunitiesSubmitCta } from "../../components/work-opportunities/WorkOpportunitiesSubmitCta";

const TAB_COPY = {
  "looking-for-work": {
    title: "Looking for Work",
    description:
      "Candidate profiles from our network. Browse below, or email us if you would like to learn more about someone listed.",
  },
  "work-available": {
    title: "Work Available",
    description:
      "Roles and placements from our network. Browse below, or email us if you are interested in a listing.",
  },
} as const;

type WorkTab = keyof typeof TAB_COPY;

function tabFromPathname(pathname: string): WorkTab {
  return pathname.includes("work-available") ? "work-available" : "looking-for-work";
}

export function WorkOpportunitiesLayout() {
  const { pathname } = useLocation();
  const tab = tabFromPathname(pathname);
  const copy = TAB_COPY[tab];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main id="main-content">
      <WorkOpportunitiesHero title={copy.title} description={copy.description} />
      <Outlet />
      <WorkOpportunitiesSubmitCta />
      <CompactHowItWorks />
      </main>
      <Footer />
    </div>
  );
}
