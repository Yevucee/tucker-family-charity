import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Heart, Target, Users, Award } from "lucide-react";
import schoolGrounds from "@/assets/school-grounds.svg";
import computerLab from "@/assets/computer-lab.svg";
import gardenArea from "@/assets/garden-area.svg";
import gardenBeds from "@/assets/garden-beds.svg";
import kitchenArea from "@/assets/kitchen-area.svg";
import diningArea from "@/assets/dining-area.svg";
import tuckerFamily from "@/assets/tucker-family.svg";

export function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="relative h-[500px] bg-amber-50 overflow-hidden">
        {/* Tucker Family Photo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src={tuckerFamily}
            alt="The Tucker Family"
            className="h-full w-auto object-contain"
          />
        </div>
        
        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">The Heart Behind Our Mission</h1>
            <p className="text-xl text-neutral-200">
              Meet the Tucker Family—dedicated to transforming lives at Oliver's Village
            </p>
          </div>
        </div>
      </section>

      {/* Our Story with Tucker Family Photo */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 text-neutral-900">Our Story</h2>
              
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-neutral-700 mb-6">
                  Tucker Family Charity began with a simple idea: to support a community project doing important work.
                </p>
                
                <p className="text-lg text-neutral-700 mb-6">
                  The charity was created by friends and family who wanted to help Oliver's Village continue its programmes for children and families in the area. After witnessing firsthand the dedication of teachers, the enthusiasm of students, and the potential waiting to be unlocked, we knew we had to act.
                </p>
                
                <p className="text-lg text-neutral-700 mb-6">
                  We're not a large corporate foundation—we're neighbors, friends, colleagues, and family members who believe in the power of grassroots action. Through fundraising events, donations and merchandise sales, the charity raises funds that go directly towards supporting the centre.
                </p>
                
                <p className="text-lg text-neutral-700">
                  Our approach is simple: build genuine relationships, listen to what the school community needs, and work together to make it happen. We're proud to be part of Oliver's Village's journey, and we invite you to join us.
                </p>
              </div>
            </div>

            {/* Computer Lab Image */}
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <img
                src={computerLab}
                alt="Computer lab at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover"
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
            <div className="relative h-[500px] rounded-lg overflow-hidden shadow-xl">
              <img
                src={gardenBeds}
                alt="Vegetable gardens at Oliver's Village"
                className="absolute inset-0 w-full h-full object-cover"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={computerLab}
                  alt="Computer lab at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={gardenBeds}
                  alt="Vegetable gardens at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={kitchenArea}
                  alt="Community kitchen at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={diningArea}
                  alt="Community dining area at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={gardenArea}
                  alt="Garden program at Oliver's Village"
                  className="absolute inset-0 w-full h-full object-cover"
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
            <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <img
                  src={schoolGrounds}
                  alt="Oliver's Village school campus"
                  className="absolute inset-0 w-full h-full object-cover"
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