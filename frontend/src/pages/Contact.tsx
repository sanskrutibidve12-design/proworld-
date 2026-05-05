import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  return (
    <>
      <section className="gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            We'd love to hear from you. Get in touch with us today.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container mx-auto max-w-3xl">
          
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Get In Touch
            </h2>

            <div className="space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    ProWorld Technology, T-3, SK Open Mall,<br />
                    B.Y. College Rd, Above Puma Showroom,<br />
                    Nashik, Maharashtra, India
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Phone</h3>
                  <p className="text-muted-foreground text-sm">
                    +91 9561702030
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Email</h3>
                  <p className="text-muted-foreground text-sm">
                    info@proworldtech.com
                  </p>
                </div>
              </div>

            </div>

            {/* Map */}
            <div className="mt-10 rounded-2xl overflow-hidden shadow-soft">
              <iframe
                title="ProWorld Location"
                src="https://www.google.com/maps?q=T-3%20SK%20Open%20Mall%20BY%20College%20Road%20Nashik&output=embed"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}