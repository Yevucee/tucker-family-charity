import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { Calendar, ExternalLink } from "lucide-react";
import { upcomingEvents, pastEvents } from "@/data/events";

export function Events() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[400px] bg-neutral-900 flex items-center">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1771924368588-507c6a048363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzMwNDU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Community events"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 w-full py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Events & Activities</h1>
            <p className="text-xl text-neutral-200">
              Join us and be part of our community making a difference
            </p>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-12 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-lg text-neutral-700">
            Throughout the year, we host a variety of events that bring our community together while raising vital funds for Oliver's Village. From elegant galas to fun runs, wine tastings to school visits—there's something for everyone. We'd love to see you there!
          </p>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-neutral-900">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="relative h-48 flex-shrink-0">
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 min-h-0">
                  <h3 className="text-xl font-bold mb-2 text-neutral-900">{event.title}</h3>
                  <div className="flex items-center gap-2 text-orange-600 font-semibold mb-2">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {event.date}
                  </div>
                  <p className="text-neutral-600 mb-4 flex-1 line-clamp-3">{event.description}</p>
                  <a
                    href={event.ctaLink}
                    target={event.ctaType === "external" ? "_blank" : undefined}
                    rel={event.ctaType === "external" ? "noopener noreferrer" : undefined}
                    className="block w-full bg-orange-600 text-white px-6 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold text-center"
                  >
                    {event.ctaLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events — centred copy, one hero image, link to Google album / folder */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-neutral-900 text-center">Past Events</h2>
          <div className="space-y-16">
            {pastEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-amber-100/80"
              >
                <div className="px-6 pt-8 pb-6 md:px-10 md:pt-10 md:pb-8 text-center">
                  <h3 className="text-2xl font-bold mb-4 text-neutral-900">{event.title}</h3>
                  <p className="text-neutral-700 text-lg leading-relaxed max-w-2xl mx-auto">
                    {event.shortDescription}
                  </p>
                </div>

                <div className="px-6 pb-8 md:px-10">
                  <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-md aspect-[16/10] bg-neutral-100">
                    <ImageWithFallback
                      src={event.coverImage}
                      alt={event.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div className="px-6 pb-8 md:px-10 flex justify-center">
                  <a
                    href={event.albumLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
                  >
                    View Full Gallery
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Can't Attend an Event?</h2>
          <p className="text-xl mb-8 text-orange-100">
            You can still support Oliver's Village through direct donations or by purchasing our charity merchandise
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/donate"
              className="bg-white text-orange-600 px-8 py-3 rounded-full hover:bg-neutral-100 transition-colors font-semibold"
            >
              Make a Donation
            </Link>
            <Link
              to="/shop"
              className="bg-orange-700 text-white px-8 py-3 rounded-full hover:bg-orange-800 transition-colors font-semibold border-2 border-white"
            >
              Shop Merchandise
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
