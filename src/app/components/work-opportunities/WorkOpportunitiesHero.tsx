import { WorkOpportunitiesSubNav } from "./WorkOpportunitiesSubNav";
import heroImage from "@/assets/work-opportunities/hero.png";

type WorkOpportunitiesHeroProps = {
  title: string;
  description: string;
};

export function WorkOpportunitiesHero({ title, description }: WorkOpportunitiesHeroProps) {
  return (
    <section className="relative py-10 md:py-12 overflow-hidden border-b border-amber-900/10">
      <img
        src={heroImage}
        alt="People in conversation in a supportive workplace setting"
        className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/88 via-amber-800/82 to-amber-900/75" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-wider text-amber-100/90 mb-1">
          Work Opportunities
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">{title}</h1>
        <p className="text-base sm:text-lg text-amber-100 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
        <div className="mt-6">
          <WorkOpportunitiesSubNav />
        </div>
      </div>
    </section>
  );
}
