import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSEO, seoContent } from "../hooks/useSEO";

export default function Contact() {
  // SEO optimization for contact page
  useSEO(seoContent.contact);

  const [isLoaded, setIsLoaded] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const infoRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection observers
  useEffect(() => {
    const createObserver = (ref, setVisible) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setVisible(true);
        },
        { threshold: 0.2 },
      );
    };

    const infoObserver = createObserver(infoRef, setInfoVisible);
    const formObserver = createObserver(formRef, setFormVisible);

    if (infoRef.current) infoObserver.observe(infoRef.current);
    if (formRef.current) formObserver.observe(formRef.current);

    return () => {
      infoObserver.disconnect();
      formObserver.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  const contactDetails = [
    {
      label: "Location",
      value: "Gjilan, Kosovo",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      label: "Phone",
      value: "+383 44 XXX XXX",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      ),
    },
    {
      label: "Email",
      value: "hello@autotafa.com",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      label: "Hours",
      value: "Mon - Sat: 9:00 - 19:00",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] sm:min-h-screen flex flex-col justify-center pt-24 sm:pt-32">
        {/* Breadcrumbs - Fixed at top below navbar */}
        <nav
          className={`absolute top-20 lg:top-24 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 transition-all duration-700 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
          style={{ transitionDelay: "0.1s" }}
        >
          <div className="max-w-7xl mx-auto">
            <ol
              className="flex items-center gap-2 text-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <li>
                <Link
                  to="/"
                  className="text-white/50 hover:text-white transition-colors duration-300"
                >
                  Home
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-white">Contact</li>
            </ol>
          </div>
        </nav>
        {/* Background accent */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute top-20 right-1/4 w-96 h-96 rounded-full bg-white/2 blur-3xl transition-all duration-[2s] ${
              isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 w-full">
          {/* Overline */}
          <div
            className={`mb-6 transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span
              className="text-xs tracking-[0.3em] uppercase text-white/50"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Get in Touch
            </span>
          </div>

          {/* Main Heading */}
          <h1
            className={`transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{
              fontFamily: "Cera Pro, sans-serif",
              letterSpacing: "-0.03em",
              transitionDelay: "0.2s",
            }}
          >
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
              Let's Talk
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-white/40 mt-3">
              We're here to help.
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className={`mt-8 max-w-2xl text-base sm:text-lg text-white/60 font-light leading-relaxed transition-all duration-1000 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{
              fontFamily: "Montserrat, sans-serif",
              transitionDelay: "0.3s",
            }}
          >
            Whether you're interested in our collection, need assistance, or
            simply want to discuss your automotive dreams, our team is ready to
            connect.
          </p>
        </div>
      </section>

      {/* Contact Information Grid */}
      <section
        ref={infoRef}
        className="relative py-24 lg:py-40 border-t border-white/10"
      >
        {/* Background accent */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-white/1 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 p-px">
            {contactDetails.map((detail, index) => (
              <div
                key={detail.label}
                className={`bg-black p-10 lg:p-12 group hover:bg-white/2 transition-all duration-500 ${
                  infoVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Icon */}
                <div className="mb-6 text-white/40 group-hover:text-white/60 transition-colors duration-300">
                  {detail.icon}
                </div>

                {/* Label */}
                <p
                  className="text-xs uppercase tracking-[0.2em] text-white/40 mb-3"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {detail.label}
                </p>

                {/* Value */}
                <p
                  className="text-lg lg:text-xl text-white font-light group-hover:text-white/90 transition-colors duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {detail.value}
                </p>

                {/* Bottom accent */}
                <div className="mt-6 w-8 h-px bg-linear-to-r from-white/20 to-transparent group-hover:w-full group-hover:from-white/40 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section
        ref={formRef}
        className="relative py-24 lg:py-40 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Left - Introduction */}
            <div
              className={`transition-all duration-1000 ${
                formVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-8"
              }`}
            >
              <span
                className="text-xs tracking-[0.3em] uppercase text-white/40 mb-8 block"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Send us a Message
              </span>

              <h2
                className="text-4xl sm:text-5xl lg:text-5xl font-bold mb-8"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                We Value
                <br />
                <span className="text-white/30">Your Inquiry</span>
              </h2>

              <div
                className="space-y-6 text-white/60"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <p className="text-lg leading-relaxed">
                  Our team typically responds within 24 hours. Whether it's a
                  question about inventory, scheduling a showroom visit, or
                  discussing bespoke services, we're committed to providing
                  exceptional service.
                </p>
                <p className="text-lg leading-relaxed">
                  For urgent inquiries, please call us directly during business
                  hours.
                </p>
              </div>

              {/* Accent line */}
              <div className="mt-12 flex items-center gap-6">
                <div className="w-12 h-px bg-white/20" />
                <span
                  className="text-sm text-white/40 tracking-wider"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Fast Response Guaranteed
                </span>
              </div>
            </div>

            {/* Right - Form */}
            <div
              className={`transition-all duration-1000 ${
                formVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="+383 44 XXX XXX"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm resize-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 rounded-full backdrop-blur-sm bg-black/30 text-white font-medium tracking-widest uppercase text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    disabled={submitted}
                  >
                    {submitted ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 2a10 10 0 1010 10H15"
                          />
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <svg
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                {/* Success Message */}
                {submitted && (
                  <div className="p-4 bg-white/5 border border-white/20 text-white text-sm text-center">
                    Thank you for reaching out! We'll be in touch soon.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="relative py-24 lg:py-40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                title: "Showroom Visits",
                description:
                  "Experience our collection in person. Book an appointment for a personalized tour.",
              },
              {
                title: "Test Drives",
                description:
                  "Feel the difference. Schedule a test drive with one of our vehicles today.",
              },
              {
                title: "Consultations",
                description:
                  "Need expert advice? Our team is ready to help you find the perfect vehicle.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group border border-white/10 p-8 lg:p-10 hover:border-white/30 hover:bg-white/2 transition-all duration-500"
              >
                <h3
                  className="text-xl font-bold text-white mb-4"
                  style={{ fontFamily: "Cera Pro, sans-serif" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-300"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative py-24 lg:py-40 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24">
          <div className="mb-8">
            <span
              className="text-xs tracking-[0.3em] uppercase text-white/40"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Location
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold mt-4"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Visit Us in Gjilan<span className="text-white/30">.</span>
            </h2>
          </div>

          {/* Google Maps Embed */}
          <div className="relative h-96 lg:h-[500px] border border-white/10 overflow-hidden rounded-lg group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d2931.2!2d21.4552112!3d42.4347833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1706900000000"
              width="100%"
              height="100%"
              style={{
                border: 0,
                filter: "invert(0.9) hue-rotate(180deg)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Address Info */}
          <div className="mt-8 p-6 border border-white/10 bg-white/2 rounded-lg">
            <p
              className="text-white/70 text-sm"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="font-semibold text-white">Address:</span> Auto
              Tafa, Livoç i Poshtëm 60000
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
