import { Link } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Heart, Target, Users, Award } from "lucide-react";
import computerLab from "@/assets/d5c30ac405997a9f47bb022e66f8a25896a2b859.png";
import tuckerFamily from "@/assets/708f3b7edb5dbc413e39e442a736f205e2c35b56.png";

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero — family photo only, no text overlay */}
      <section className="relative min-h-[320px] sm:min-h-[400px] bg-amber-50 overflow-hidden">
        <div className="flex items-center justify-center min-h-[320px] sm:min-h-[400px]">
          <img
            src={tuckerFamily}
            alt="The Tucker Family"
            className="w-full max-h-[min(55vh,520px)] sm:max-h-[min(60vh,600px)] object-contain"
          />
        </div>
      </section>

      {/* Our Story — title and full narrative in the text area only */}
      <section className="py-16 md:py-20 bg-white border-t border-amber-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
            The Story of the Tucker Family Charity
          </h1>
          <p className="text-xl sm:text-2xl font-semibold text-neutral-900 mb-10 leading-snug">
            In 2009, everything changed for us.
          </p>
          <div className="space-y-6 text-lg text-neutral-700">
            <p>
              As we waited for the arrival of our first daughter, Madison, due on 13 August 2009, we found ourselves in a moment of deep reflection. Like many soon-to-be parents, we were filled with excitement, but also a growing sense of responsibility. Not just for the life we were bringing into the world, but for the world she would grow up in.
            </p>
            <p className="font-semibold text-neutral-900">We began to reflect on our own journeys.</p>
            <p>
              We had been incredibly fortunate. We had attended great schools and universities. We had travelled, both locally and abroad. Sport had given us opportunities to see the world, to compete, to grow, from school tours to provincial and national representation. Our parents had said yes to every opportunity, often without ever having to question whether it was possible.
            </p>
            <p>
              <span className="font-semibold text-neutral-900">And in that moment, it hit us: not everyone has that chance.</span>{" "}
              There are so many children in South Africa who will never experience those same opportunities, not because they lack talent, heart, or ambition, but simply because they were not given the same starting point.
            </p>
            <p className="font-medium text-neutral-900">We couldn't ignore that.</p>
            <p>
              And so, before Madison was even born, we made a decision, that as a family, we would try, in whatever way we could, to make a difference.
            </p>
            <p className="font-semibold text-neutral-900">
              That decision became the Tucker Family Charity.
            </p>
            <p>
              In the early days, it was small and simple. We supported a few initiatives, learning as we went, trying to understand where we could make the most meaningful impact. Then, in 2010, we found Oliver's Village, and everything aligned.
            </p>
            <p>
              What drew us in was their belief in education as the foundation for change. Not just education in the classroom, but holistic care, including daily feeding schemes that support not only the children, but the wider community. It was real, it was tangible, and it was making a difference where it mattered most.
            </p>
            <p>
              What started as a partnership quickly became something much deeper, a shared purpose.
            </p>
            <p>
              Our very first fundraising effort was a Father &amp; Son Golf Day at Parkview Golf Club in 2009. That same afternoon, we opened up our home and hosted over 200 people, golfers, partners, and children, for a function that brought everyone together. Kelly was eight months pregnant at the time, welcoming guests with incredible warmth and energy, which made the occasion even more special and meaningful.
            </p>
            <p>
              It was a moment that captured everything the charity would come to represent: generosity, community, and a willingness to give, even when life was already full.
            </p>
            <p className="font-semibold text-neutral-900">
              From those humble beginnings, something powerful started to grow.
            </p>
          </div>

          <figure className="mt-14">
            <div className="relative w-full h-[min(48vh,420px)] sm:h-[min(52vh,480px)] rounded-lg overflow-hidden shadow-xl group">
              <img
                src={computerLab}
                alt="Computer lab at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <figcaption className="text-center text-sm text-neutral-500 mt-3 px-2">
              Learning and skills at Oliver's Village
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center text-neutral-900">Our Mission & Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Compassion</h3>
              <p className="text-neutral-600">
                We lead with empathy and a genuine commitment to improving lives
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Impact</h3>
              <p className="text-neutral-600">
                Every action we take is focused on creating measurable, lasting change
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Community</h3>
              <p className="text-neutral-600">
                We believe in the power of people coming together for a common purpose
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Integrity</h3>
              <p className="text-neutral-600">
                We operate with transparency and accountability in everything we do
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Oliver's Village — full story & photos on dedicated page */}
      <section className="py-20 bg-white border-y border-amber-100/80">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900">Oliver&apos;s Village</h2>
          <p className="text-lg text-neutral-700 mb-8">
            The community education centre near Benoni we support with fundraising and partnership — education, meals,
            training and care for hundreds of children and families. See photos of the campus and programmes, and learn
            how to help.
          </p>
          <Link
            to="/olivers-village"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
          >
            Explore Oliver&apos;s Village
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-amber-50 border-t border-amber-100/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-neutral-900">
            Join Our Mission
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Every contribution, no matter the size, helps us support beneficiaries at Oliver&apos;s Village and across the communities we partner with.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/donate"
              className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
            >
              Donate via Tucker Family Charity
            </Link>
            <a
              href="https://instagram.com/tuckerfamilycharity"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-full hover:bg-orange-50 transition-colors font-semibold"
            >
              Follow Our Journey
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}