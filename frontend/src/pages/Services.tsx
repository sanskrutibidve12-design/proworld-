import SectionHeading from "@/components/SectionHeading";
import {
  Search, Code, Palette, Layout, Smartphone, Megaphone,
  Rocket, Monitor, Settings, Headphones, HardDrive, PenTool
} from "lucide-react";

const services = [
  {
    icon: Search,
    title: "SEO",
    desc: "In this digital era, having a website is not enough. SEO helps you reach your target customers effectively. We provide the best SEO services to bring your business to the first page of search results.",
  },
  {
    icon: Code,
    title: "Web Development",
    desc: "We provide powerful web development solutions to take your business to the next level. Build fast, scalable, and modern web applications to accelerate your growth.",
  },
  {
    icon: Palette,
    title: "Graphic Design",
    desc: "Anything without a good design feels incomplete. Our expert designers turn your ideas into visually stunning and impactful designs.",
  },
  {
    icon: Layout,
    title: "UI/UX Design",
    desc: "A great user experience is key to success. We design clean, responsive, and user-friendly interfaces that enhance engagement and usability.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    desc: "Step into the mobile world with powerful app solutions. We build high-quality mobile applications to make your services accessible to a wider audience.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    desc: "Reaching your customers is more important than just building a product. We provide effective digital marketing strategies to grow your brand and increase visibility.",
  },
];

export default function Services() {
  return (
    <>
      <section className="gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Our Services</h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">Comprehensive IT solutions tailored to your business needs.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto">
          <SectionHeading title="What We Offer" subtitle="End-to-end technology services for modern businesses" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div key={i} className="glass-card p-6 hover-lift group cursor-default">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
