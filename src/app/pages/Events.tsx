import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Link } from "react-router";
import { Calendar, MapPin, Clock, Users } from "lucide-react";

export function Events() {
  const events = [
    {
      id: 1,
      title: "Spring Fundraiser Gala",
      date: "April 15, 2026",
      time: "6:00 PM - 10:00 PM",
      location: "Johannesburg Community Center",
      address: "Venue TBC — check back for details",
      image: "https://images.unsplash.com/photo-1768776179834-93e6cafc6d97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBldmVudCUyMG91dGRvb3IlMjBwZW9wbGV8ZW58MXx8fHwxNzczMTMyMzA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Join us for an unforgettable evening of music, food, and community as we celebrate the collective impact we're making on education at Oliver's Village. Enjoy live performances, a silent auction, and networking with fellow supporters.",
      attendees: "150+ expected",
      category: "Fundraiser"
    },
    {
      id: 2,
      title: "Charity Wine Tasting",
      date: "May 22, 2026",
      time: "5:00 PM - 8:00 PM",
      location: "The Vineyard, Constantia",
      address: "Wine Route, Constantia Valley",
      image: "https://images.unsplash.com/photo-1771924368588-507c6a048363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzMwNDU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Sample exquisite South African wines in a beautiful vineyard setting while supporting a great cause. All proceeds benefit Oliver's Village students. Wine expert presentations and gourmet pairings included.",
      attendees: "80+ expected",
      category: "Fundraiser"
    },
    {
      id: 3,
      title: "School Visit Day",
      date: "June 10, 2026",
      time: "9:00 AM - 2:00 PM",
      location: "Oliver's Village",
      address: "Oliver's Village School, Johannesburg",
      image: "https://images.unsplash.com/photo-1666281269793-da06484657e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwc2Nob29sJTIwZWR1Y2F0aW9uJTIwYm9va3N8ZW58MXx8fHwxNzczMTMyMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Experience the magic of Oliver's Village firsthand! Meet the students and teachers, tour the facilities, participate in classroom activities, and see the direct impact of your support. Lunch provided.",
      attendees: "40+ expected",
      category: "Community"
    },
    {
      id: 4,
      title: "Summer Fun Run",
      date: "July 20, 2026",
      time: "7:00 AM - 11:00 AM",
      location: "Delta Park",
      address: "Victory Park, Johannesburg",
      image: "https://images.unsplash.com/photo-1770842655322-bcfd1c4be229?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxBZnJpY2FuJTIwY2hpbGRyZW4lMjBjb21tdW5pdHklMjBzbWlsaW5nJTIwaGFwcHl8ZW58MXx8fHwxNzczMTMyMzA0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Run, walk, or jog for education! 5K and 10K routes available for all fitness levels. Registration includes a charity T-shirt, refreshments, and the satisfaction of supporting a great cause. Family-friendly event.",
      attendees: "200+ expected",
      category: "Fundraiser"
    },
    {
      id: 5,
      title: "Annual Charity Auction",
      date: "August 30, 2026",
      time: "6:30 PM - 10:00 PM",
      location: "The Grand Hall",
      address: "Sandton Convention Centre, Johannesburg",
      image: "https://images.unsplash.com/photo-1706323625335-dad461b68fe5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBidWlsZGluZyUyMGltcHJvdmVtZW50fGVufDF8fHx8MTc3MzEzMjMwOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Our biggest fundraiser of the year! Bid on incredible items including art, experiences, vacations, and exclusive packages. Cocktails, dinner, and live entertainment. Black-tie optional.",
      attendees: "250+ expected",
      category: "Fundraiser"
    },
    {
      id: 6,
      title: "Back-to-School Supply Drive",
      date: "September 15, 2026",
      time: "10:00 AM - 4:00 PM",
      location: "Multiple Locations",
      address: "Drop-off points TBC — contact us for details",
      image: "https://images.unsplash.com/photo-1683879025805-a268b690613e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2hvb2wlMjBzdXBwbGllcyUyMHBlbmNpbHMlMjBib29rc3xlbnwxfHx8fDE3NzMxMzIzMDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Help us prepare students for a successful school year! Donate school supplies, books, backpacks, and uniforms. Drop-off locations across Johannesburg. Every item makes a difference.",
      attendees: "Community-wide",
      category: "Drive"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[400px] bg-neutral-900">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1771924368588-507c6a048363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBnYXRoZXJpbmclMjBjZWxlYnJhdGlvbnxlbnwxfHx8fDE3NzMwNDU0Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Community events"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="text-5xl md:text-6xl font-bold">Events & Activities</h1>
            <p className="text-xl mt-4 text-neutral-200">
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

      {/* Events Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {events.map((event, index) => (
              <div
                key={event.id}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-dense' : ''
                }`}
              >
                {/* Image */}
                <div className={`relative h-[400px] rounded-lg overflow-hidden shadow-xl ${
                  index % 2 === 1 ? 'lg:col-start-2' : ''
                }`}>
                  <ImageWithFallback
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                </div>

                {/* Content */}
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <h2 className="text-3xl font-bold mb-4 text-neutral-900">
                    {event.title}
                  </h2>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Calendar className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span className="font-semibold">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start gap-3 text-neutral-700">
                      <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">{event.location}</div>
                        <div className="text-sm text-neutral-600">{event.address}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-700">
                      <Users className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  <p className="text-neutral-700 mb-6">
                    {event.description}
                  </p>

                  <a
                    href={`mailto:info@tuckerfamilycharity.org?subject=Event Registration: ${encodeURIComponent(event.title)}`}
                    className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
                  >
                    Register for Event
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Can't Attend an Event?
          </h2>
          <p className="text-xl mb-8 text-orange-100">
            You can still support Oliver's Village through direct donations or by purchasing our charity merchandise
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/#support"
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
