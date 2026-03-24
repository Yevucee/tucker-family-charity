import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Heart, Target, Users, Award } from "lucide-react";
import schoolGrounds from "@/assets/0cac28478cd9e148e19e33753c2ce2b1507d4676.png";
import computerLab from "@/assets/d5c30ac405997a9f47bb022e66f8a25896a2b859.png";
import gardenArea from "@/assets/f0dd27edb7bda065be4dd5f0f576138f64514baf.png";
import gardenBeds from "@/assets/7b52c9c4cb4c502f6ea99c7fce5fe04da5995174.png";
import kitchenArea from "@/assets/8d8da24d7e2cba1694663d3735775c2318c86b68.png";
import diningArea from "@/assets/8e268001b9e0fd2784e0fabc8aa1f352deb6f3d2.png";
import tuckerFamily from "@/assets/708f3b7edb5dbc413e39e442a736f205e2c35b56.png";

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative min-h-[400px] bg-amber-50 overflow-hidden">
        {/* Tucker Family Photo - object-contain shows full image, no cropping */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={tuckerFamily}
            alt="The Tucker Family"
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Our Story</h1>
            <p className="text-xl text-neutral-200 max-w-2xl mx-auto">
              The Tucker Family Charity began with a moment of reflection in 2009.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="max-w-none lg:max-w-xl mx-auto lg:mx-0">
              <div className="relative h-[280px] sm:h-[340px] rounded-lg overflow-hidden shadow-xl group mb-10 lg:hidden">
                <img
                  src={computerLab}
                  alt="Computer lab at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="space-y-6 text-lg text-neutral-700">
                <p>
                  As Brett and Kelly waited for the arrival of their first daughter, Madison, due on 13 August that year, they found themselves thinking deeply about the future. Like many soon-to-be parents, they were filled with excitement, but also with a growing awareness of responsibility. Not only for the life they were about to welcome into the world, but for the wider world she would grow up in.
                </p>
                <p>
                  That period prompted them to look back on their own lives and the opportunities they had been fortunate to experience. They had attended excellent schools and universities, travelled both within South Africa and abroad, and benefited greatly from sport. Sport had opened doors, created friendships, and offered experiences that shaped who they became, from school tours to provincial and national representation.
                </p>
                <p>
                  What stood out most was how naturally many of those opportunities had come. They had often simply said yes when opportunities appeared, without ever having to question whether access would be possible.
                </p>
                <p>
                  At the same time, they became increasingly aware that for many children in South Africa, that is not the reality. Talent, determination and ambition are often present, but opportunity is not. For many young people, the starting point is very different.
                </p>
                <p>
                  Before Madison was even born, they made a decision as a family: that in whatever way they could, they would try to make a difference.
                </p>
                <p className="font-semibold text-neutral-900">
                  That decision became the Tucker Family Charity.
                </p>
                <p>
                  In the beginning, the charity was small and practical, supporting a number of initiatives while learning where meaningful impact could be made. In 2010, they were introduced to Oliver's Village, a community project whose focus on education, feeding schemes and wider community care strongly aligned with what they believed in.
                </p>
                <p>
                  What began as support for one project quickly grew into something much broader.
                </p>
                <p>
                  The charity's first fundraising event reflected that spirit from the very beginning. A Father & Son Golf Day was held at Parkview Golf Club, followed by a gathering at the family home that brought together more than 200 guests, including golfers, partners and children. Kelly, eight months pregnant at the time, helped host the day, creating an atmosphere of warmth and generosity that would come to define the charity's character.
                </p>
                <p>
                  That first event captured something important: the belief that community, hospitality and shared effort can create real impact.
                </p>
                <p>
                  Over time, through the support of family, friends, business relationships and sporting networks, the Tucker Family Charity has grown into a wider platform for community engagement. Today its work includes fundraising events, partnerships, support for local initiatives, employment ideas, trusted networks and projects that aim to create practical opportunity.
                </p>
                <p>
                  Although the work has grown, the original purpose remains unchanged.
                </p>
                <div className="space-y-2 text-neutral-900 font-medium pt-2">
                  <p>It is still rooted in gratitude.</p>
                  <p>It is still driven by opportunity.</p>
                  <p>And it is still about doing what is possible, with the people around you, to help build a better future for others.</p>
                </div>
                <p className="pt-4 text-neutral-800">
                  In many ways, it all began with the arrival of a little girl who reminded a family what truly matters.
                </p>
              </div>
            </div>

            <div className="hidden lg:block relative h-[min(90vh,920px)] min-h-[500px] rounded-lg overflow-hidden shadow-xl group lg:sticky lg:top-24">
              <img
                src={computerLab}
                alt="Computer lab at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          </div>
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

      {/* About Oliver's Village */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl group">
              <img
                src={gardenBeds}
                alt="Vegetable gardens at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div>
              <h2 className="text-4xl font-bold mb-6 text-neutral-900">
                About Oliver's Village
              </h2>
              <p className="text-lg text-neutral-700 mb-6">
                Oliver's Village is a community education centre located near Benoni, east of Johannesburg. The organisation works with children and families from nearby communities to provide education, training and practical support.
              </p>
              <p className="text-lg text-neutral-700 mb-6">
                The project began as Oliver's House in 2001 and has grown into a broader community centre supporting hundreds of people. The dedicated staff work tirelessly to ensure every child receives the attention, resources, and encouragement they need to reach their full potential.
              </p>
              <p className="text-lg text-neutral-700">
                Despite limited resources, Oliver's Village continues to achieve remarkable results thanks to passionate educators, supportive families, and the generous contributions of donors like you. Together, we're proving that when a community invests in its children, everyone benefits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Gallery */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-neutral-900">
              See the Impact of Your Support
            </h2>
            <p className="text-lg text-neutral-600">
              Real facilities and programs at Oliver's Village
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Computer Lab */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={computerLab}
                  alt="Computer lab at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Computer Training</h3>
                <p className="text-neutral-600">
                  Computer facilities provide digital skills training for young people and adults, helping them build essential skills for the future.
                </p>
              </div>
            </div>

            {/* Garden Beds */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={gardenBeds}
                  alt="Vegetable gardens at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Food Gardens</h3>
                <p className="text-neutral-600">
                  Sustainable vegetable gardens provide fresh produce and teach students about nutrition, agriculture, and self-sufficiency.
                </p>
              </div>
            </div>

            {/* Kitchen */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={kitchenArea}
                  alt="Community kitchen at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Meals & Nutrition</h3>
                <p className="text-neutral-600">
                  A feeding programme ensures children attending the centre receive regular, nutritious meals every day.
                </p>
              </div>
            </div>

            {/* Dining Area */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={diningArea}
                  alt="Community dining area at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Community Space</h3>
                <p className="text-neutral-600">
                  Comfortable outdoor spaces where children can eat together, learn, and build community connections.
                </p>
              </div>
            </div>

            {/* Garden Program */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={gardenArea}
                  alt="Garden program at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">Educational Gardens</h3>
                <p className="text-neutral-600">
                  Hands-on learning through gardening helps students develop practical skills and environmental awareness.
                </p>
              </div>
            </div>

            {/* School Grounds */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
              <div className="relative h-64 group overflow-hidden">
                <img
                  src={schoolGrounds}
                  alt="Oliver's Village school campus"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">School Campus</h3>
                <p className="text-neutral-600">
                  Safe, well-maintained facilities providing a nurturing environment for learning, growth, and development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Impact in Numbers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">350+</div>
              <div className="text-lg text-orange-100">Students Supported</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">R450K</div>
              <div className="text-lg text-orange-100">Raised This Year</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">15+</div>
              <div className="text-lg text-orange-100">Community Events</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-lg text-orange-100">Funds to School</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6 text-neutral-900">
            Join Our Mission
          </h2>
          <p className="text-xl text-neutral-600 mb-8">
            Every contribution, no matter the size, makes a real difference in the lives of students at Oliver's Village
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#support"
              className="bg-orange-600 text-white px-8 py-3 rounded-full hover:bg-orange-700 transition-colors font-semibold"
            >
              Support the Charity
            </a>
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