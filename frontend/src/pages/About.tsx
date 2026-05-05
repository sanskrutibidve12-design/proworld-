import SectionHeading from "@/components/SectionHeading";
import aboutTeamImg from "@/assets/about-team.jpg";
import { Lightbulb, Heart, Star, TrendingUp } from "lucide-react";

const values = [
  { icon: Lightbulb, title: "Innovation", desc: "Continuously exploring new technologies and creative solutions." },
  { icon: Heart, title: "Integrity", desc: "Maintaining the highest ethical standards in all our endeavors." },
  { icon: Star, title: "Excellence", desc: "Striving for excellence in every project and interaction." },
  { icon: TrendingUp, title: "Growth", desc: "Fostering growth for our team, clients, and community." },
];

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A1F44] via-[#123A7A] to-[#1E5EFF] py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            About ProWorld Technology
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Discover our story, mission, and the values that drive everything we do.
          </p>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-[#F5F8FF]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <img
              src={aboutTeamImg}
              alt="Our Team"
              className="rounded-2xl w-full shadow-[0_8px_30px_rgba(10,31,68,0.12)]"
              loading="lazy"
            />

            <div>
              <h2 className="text-3xl font-bold text-[#0A1F44] mb-4">
                Our Team
              </h2>

              <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#0A1F44] to-[#1E5EFF] mb-6" />

              <p className="text-[#4A5A75] leading-relaxed mb-4">
                Our team comprises seasoned professionals with diverse expertise in software development, IT consulting, and education. Each member brings unique skills and perspectives that enrich our collaborative environment.
              </p>

              <p className="text-[#4A5A75] leading-relaxed">
                Together, we work towards delivering exceptional results for our clients while nurturing the next generation of tech talent.
              </p>
            </div>

          </div>
        </div>
      </section>

  

      {/* Mission & Vision */}
      <section className="py-20 bg-[#F5F8FF]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">

            <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_8px_30px_rgba(10,31,68,0.08)] hover:shadow-[0_12px_30px_rgba(10,31,68,0.12)] transition">
              <h3 className="text-2xl font-bold text-[#0A1F44] mb-4">
                Our Mission
              </h3>
              <p className="text-[#4A5A75] leading-relaxed">
                To deliver innovative technology solutions that drive business growth while empowering aspiring professionals with industry-relevant skills and real-world experience.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-[0_8px_30px_rgba(10,31,68,0.08)] hover:shadow-[0_12px_30px_rgba(10,31,68,0.12)] transition">
              <h3 className="text-2xl font-bold text-[#0A1F44] mb-4">
                Our Vision
              </h3>
              <p className="text-[#4A5A75] leading-relaxed">
                To be the most trusted IT services and training partner, creating a world where technology talent meets opportunity, and businesses thrive through digital transformation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-[#F5F8FF]">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Core Values"
            subtitle="The principles that guide everything we do"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 text-center rounded-2xl 
                bg-white/70 backdrop-blur-xl 
                border border-white/30 
                shadow-[0_8px_30px_rgba(10,31,68,0.08)] 
                hover:shadow-[0_12px_30px_rgba(10,31,68,0.12)] 
                hover:-translate-y-2 transition group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A1F44] to-[#1E5EFF] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <v.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="font-semibold text-lg text-[#0A1F44] mb-2">
                  {v.title}
                </h3>

                <p className="text-[#4A5A75] text-sm">
                  {v.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>
    </>
  );
}