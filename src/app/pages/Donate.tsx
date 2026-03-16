import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Link } from "react-router";
import { DollarSign, Clock, Package, Heart } from "lucide-react";
import { DONATION_LINK } from "@/config";
import { currentNeeds } from "@/data/currentNeeds";

export function Donate() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[300px] bg-gradient-to-r from-amber-600 to-amber-800">
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Support Oliver's Village</h1>
            <p className="text-xl text-amber-100">
              Your donation makes a real difference in children's lives
            </p>
          </div>
        </div>
      </section>

      {/* Money */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Give Money</h2>
              <p className="text-lg text-neutral-700 mb-6">
                Financial donations help us provide daily meals, educational materials, and training for children and families at Oliver's Village. Every rand goes directly to supporting the community.
              </p>
              <a
                href={DONATION_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Donate Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Time */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Clock className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Give Time</h2>
              <p className="text-lg text-neutral-700 mb-6">
                Volunteer your time and skills. We welcome help with events, mentoring, and practical support at Oliver's Village. Whether you can spare an hour or a day, your contribution matters.
              </p>
              <ul className="list-disc list-inside text-neutral-700 mb-6 space-y-2">
                <li>Helping at fundraising events</li>
                <li>Mentoring and tutoring</li>
                <li>Practical support at the centre</li>
              </ul>
              <a
                href="mailto:info@tuckerfamilycharity.org?subject=Volunteer Enquiry"
                className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Get in Touch to Volunteer
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-neutral-900">Give Materials</h2>
              <p className="text-lg text-neutral-700 mb-6">
                Donations of books, school supplies, educational materials, and useful household items can make a big difference. We accept items in good condition that support our mission.
              </p>
              <p className="text-lg font-semibold text-neutral-900 mb-4">Examples:</p>
              <ul className="list-disc list-inside text-neutral-700 mb-8 space-y-2">
                <li>Books (children's and educational)</li>
                <li>School supplies (pens, pencils, notebooks, crayons)</li>
                <li>Educational materials</li>
                <li>Useful household donations</li>
              </ul>

              {/* Current Needs - editable via src/data/currentNeeds.ts */}
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <h3 className="text-xl font-bold mb-4 text-neutral-900 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-orange-600" />
                  Current needs right now
                </h3>
                <ul className="space-y-2 text-neutral-700">
                  {currentNeeds.map((need) => (
                    <li key={need} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      {need}
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="mailto:info@tuckerfamilycharity.org?subject=Material Donation Enquiry"
                className="inline-block mt-6 bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
              >
                Contact Us About Donating Materials
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Thank You</h2>
          <p className="text-xl text-orange-100 mb-8">
            Every contribution—whether money, time, or materials—helps Oliver's Village continue its vital work. Thank you for being part of our community.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-neutral-100 transition-colors font-semibold"
          >
            Shop for Charity
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
