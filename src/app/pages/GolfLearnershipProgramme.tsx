import { useEffect } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {
  Target,
  Users,
  GraduationCap,
  Handshake,
  BarChart3,
  Zap,
  Shield,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import { golfProgrammePartners } from "@/data/golfProgrammePartners";

const GOLF_ENQUIRY_MAILTO =
  "mailto:info@tuckerfamilycharity.org?subject=Golf%20Learnership%20Programme%20-%20Partner%20Enquiry";
const GOLF_SUPPORT_MAILTO =
  "mailto:info@tuckerfamilycharity.org?subject=Golf%20Learnership%20Programme%20-%20Support";
const GOLF_CONTACT_MAILTO =
  "mailto:info@tuckerfamilycharity.org?subject=Golf%20Learnership%20Programme%20-%20Enquiry";

const PROGRAMME_STEPS = [
  {
    title: "Identification and onboarding",
    text: "Participants are identified and brought into the programme through a structured process.",
    icon: Users,
  },
  {
    title: "Placement and participation",
    text: "Learners are given the opportunity to engage in a practical environment that encourages punctuality, discipline, consistency and teamwork.",
    icon: Target,
  },
  {
    title: "Ongoing support",
    text: "The programme is supported by coordination, communication and stakeholder involvement to help ensure learners are guided throughout the process.",
    icon: MessageCircle,
  },
  {
    title: "Personal development",
    text: "Alongside practical exposure, the wider goal is to help learners strengthen confidence, responsibility, life skills and readiness for future opportunity.",
    icon: GraduationCap,
  },
  {
    title: "Tracking and accountability",
    text: "Participation and programme activity are monitored so that progress can be reviewed and the initiative remains accountable to its partners and supporters.",
    icon: BarChart3,
  },
];

const MORE_THAN_GOLF_ITEMS = [
  "Structure and routine",
  "Confidence and discipline",
  "Teamwork and communication",
  "Practical exposure",
  "Future readiness",
];

export function GolfLearnershipProgramme() {
  useEffect(() => {
    document.title =
      "Golf Learnership Programme | Tucker Family Foundation, Afrika Tikkun and Simunye";
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* 1. Hero */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-800 py-16 md:py-20">
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[280px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto w-full text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Golf Learnership Programme</h1>
            <p className="text-xl text-amber-100 font-medium mb-6">
              A joint initiative by Tucker Family Foundation, Afrika Tikkun and Simunye
            </p>
            <p className="text-lg text-amber-100/90 mb-10 max-w-3xl mx-auto">
              The Golf Learnership Programme is a collaborative initiative designed to create
              practical pathways for young people through structured opportunity, support, exposure
              and development. Brought together through the combined efforts of Tucker Family
              Foundation, Afrika Tikkun and Simunye, the programme uses golf as a platform for
              building confidence, discipline, work readiness and future opportunity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={GOLF_ENQUIRY_MAILTO}
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors font-semibold"
              >
                Partner With Us
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={GOLF_SUPPORT_MAILTO}
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white border border-white/40 px-8 py-3 rounded-full hover:bg-white/30 transition-colors font-semibold"
              >
                Support the Programme
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Equal partner strip */}
      <section className="py-16 bg-white border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-lg font-semibold text-neutral-600 mb-10">
            Delivered through a shared commitment from three partner organisations
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {golfProgrammePartners.map((partner) => (
              <div
                key={partner.id}
                className="flex flex-col items-center justify-center min-h-[120px] bg-amber-50 rounded-lg p-8 border border-amber-200"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-16 w-auto object-contain mb-4"
                  />
                ) : (
                  <span className="text-lg font-semibold text-neutral-800 text-center">
                    {partner.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Programme overview */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-neutral-900">
            A structured pathway, not just a one-off initiative
          </h2>
          <p className="text-lg text-neutral-700 mb-6">
            The Golf Learnership Programme has been developed to give young people access to a more
            structured path forward. Through practical participation, guided support and a strong
            implementation framework, the programme aims to create an environment where learners can
            develop useful skills, build confidence and engage with real-world opportunities.
          </p>
          <p className="text-lg text-neutral-700">
            This initiative is about more than access alone. It is about creating a programme that
            is organised, collaborative and able to support meaningful progress over time.
          </p>
        </div>
      </section>

      {/* 4. Why it matters */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-neutral-900">Why this matters</h2>
          <p className="text-lg text-neutral-700 mb-6">
            Too many young people face barriers to work, development and exposure, even when they
            have the motivation to grow. This programme is built on the belief that practical
            opportunity matters. When young people are given structure, support and the chance to
            participate in something purposeful, it can strengthen confidence, responsibility and
            future readiness.
          </p>
          <p className="text-lg text-neutral-700">
            By combining practical experience with support systems and partnership-based delivery,
            the Golf Learnership Programme aims to create a setting where young people can develop
            both personally and professionally.
          </p>
        </div>
      </section>

      {/* 5. How the programme works */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4 text-neutral-900">How the programme works</h2>
          <p className="text-lg text-neutral-700 mb-12">
            The programme is designed around a simple but meaningful structure:
          </p>
          <div className="space-y-8">
            {PROGRAMME_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
              <div
                key={i}
                className="flex flex-col md:flex-row gap-6 items-start bg-white rounded-lg p-6 border border-amber-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-700">{step.text}</p>
                </div>
              </div>
            );
            })}
          </div>
        </div>
      </section>

      {/* 6. More than golf */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-neutral-900">More than golf</h2>
          <p className="text-lg text-neutral-700 mb-6">
            While golf provides the platform, the purpose of the programme is broader.
          </p>
          <p className="text-lg text-neutral-700 mb-10">
            This initiative is about helping young people engage with structure, routine,
            professionalism, responsibility, teamwork, communication, confidence and personal
            growth. The aim is to create a supportive environment in which learners are not only
            participating in an activity, but building habits, exposure and experience that can
            serve them well beyond the programme itself.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MORE_THAN_GOLF_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 bg-amber-50 rounded-lg p-4 border border-amber-200"
              >
                <Zap className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="font-medium text-neutral-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Built through partnership */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-8 text-neutral-900">Built through collaboration</h2>
          <p className="text-lg text-neutral-700 mb-6">
            This programme is the result of a shared effort between Tucker Family Foundation, Afrika
            Tikkun and Simunye. Each partner brings an important role to the initiative, helping
            shape a programme that is structured, supportive and designed for meaningful impact.
          </p>
          <p className="text-lg text-neutral-700">
            By combining experience, networks and implementation support, the partnership aims to
            create a stronger pathway for young people and a more credible foundation for long-term
            growth.
          </p>
        </div>
      </section>

      {/* 8. Accountability and impact */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-8 text-neutral-900">
                Structured for delivery and accountability
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                The programme is designed not only to create opportunity, but to do so in a way that
                is coordinated, measurable and responsible. Through collaboration between Tucker
                Family Foundation, Afrika Tikkun and Simunye, the initiative is intended to support
                implementation, learner development, stakeholder engagement and transparent
                reporting over time.
              </p>
              <p className="text-lg text-neutral-700">
                Our aim is not only to run a meaningful programme, but to do so in a way that
                allows learning, improvement and measurable impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Help create pathways that matter</h2>
          <p className="text-xl text-orange-100 mb-10">
            We welcome interest from organisations, partners and supporters who would like to be
            part of this journey.
          </p>
          <p className="text-lg text-orange-100/90 mb-10 max-w-2xl mx-auto">
            Whether through sponsorship, collaboration, implementation support or strategic
            partnership, there are meaningful ways to contribute to the growth of this programme and
            the opportunities it can create.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={GOLF_ENQUIRY_MAILTO}
              className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-amber-50 transition-colors font-semibold"
            >
              Become a Partner
              <Handshake className="w-4 h-4" />
            </a>
            <a
              href={GOLF_CONTACT_MAILTO}
              className="inline-flex items-center justify-center gap-2 bg-white/20 text-white border border-white/40 px-8 py-3 rounded-full hover:bg-white/30 transition-colors font-semibold"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
