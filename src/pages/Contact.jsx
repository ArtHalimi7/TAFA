import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSEO, seoContent } from "../hooks/useSEO";
import emailjs from "@emailjs/browser";
import logo from "../assets/images/logo.png";

// Initialize EmailJS
emailjs.init("-NWp731-hJ2KBhmcB");

export default function Contact() {
  const location = useLocation();

  // SEO optimization for contact page
  useSEO(seoContent.contact);

  const [isLoaded, setIsLoaded] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    carName: location.state?.carName || "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Send email using EmailJS
      const result = await emailjs.send("service_54yly7t", "template_pvpvfgf", {
        from_name: formData.name,
        from_email: formData.email,
        phone: formData.phone,
        car_name: formData.carName || "Nuk u specifikua",
        message: formData.message,
        to_email: "arthalimi989@gmail.com",
      });

      if (result.status === 200) {
        // Also save to backend database
        try {
          await fetch(
            `${import.meta.env.VITE_API_URL || "http://localhost:3001/api"}/contact`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                message: `Makina: ${formData.carName || "Nuk u specifikua"}\n\n${formData.message}`,
              }),
            },
          );
        } catch (dbError) {
          console.warn("Database save failed, but email was sent:", dbError);
        }

        setSubmitted(true);
        setTimeout(() => {
          setFormData({
            name: "",
            email: "",
            phone: "",
            message: "",
            carName: location.state?.carName || "",
          });
          setSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitError(
        "Pati një problem me dërgimin e emailit. Ju lutemi provoni më vonë.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactDetails = [
    {
      label: "Vendndodhja",
      value: "Gjilan, Kosovë",
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
      label: "Telefon",
      value: "+383 44 666 662",
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
      value: "info@autosallontafa.com",
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
      label: "Orari",
      value: "Hën - Sht: 9:00 - 19:00",
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
                  Faqja kryesore
                </Link>
              </li>
              <li className="text-white/30">/</li>
              <li className="text-white">Kontakti</li>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left Content */}
            <div className="lg:col-span-2">
              {/* Overline */}
              <div
                className={`mb-6 transition-all duration-1000 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <span
                  className="text-xs tracking-[0.3em] uppercase text-white/50"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Na kontaktoni
                </span>
              </div>

              {/* Main Heading */}
              <h1
                className={`transition-all duration-1000 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{
                  fontFamily: "Cera Pro, sans-serif",
                  letterSpacing: "-0.03em",
                  transitionDelay: "0.2s",
                }}
              >
                <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
                  Bisedoni me ne
                </span>
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-light text-white/40 mt-3">
                  Jemi në dispozicion për informacione dhe takime.
                </span>
              </h1>

              {/* Subtitle */}
              <p
                className={`mt-8 max-w-2xl text-base sm:text-lg text-white/60 font-light leading-relaxed transition-all duration-1000 ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{
                  fontFamily: "Montserrat, sans-serif",
                  transitionDelay: "0.3s",
                }}
              >
                Nëse jeni të interesuar për koleksionin tonë, keni nevojë për
                ndihmë, ose dëshironi të diskutoni kërkesat tuaja, ekipi ynë
                është gati t’ju kontaktojë.
              </p>
            </div>

            {/* Right Logo */}
            <div
              className={`hidden lg:flex items-start justify-center -mt-36 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: "0.4s" }}
            >
              <img
                src={logo}
                alt="TAFA Logo"
                className="h-auto w-120 object-contain"
              />
            </div>
          </div>
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
                Dërgoni një mesazh
              </span>

              <h2
                className="text-4xl sm:text-5xl lg:text-5xl font-bold mb-8"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                Çdo pyetje trajtohet
                <br />
                <span className="text-white/30">me kujdes</span>
              </h2>

              <div
                className="space-y-6 text-white/60"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <p className="text-lg leading-relaxed">
                  Ekipi ynë përgjigjet zakonisht brenda një dite pune. Qoftë një
                  pyetje për inventarin, një takim në showroom, apo shërbime
                  sipas kerkesës — jemi të përkushtuar të ofrojmë shërbim të
                  shkëlqyer.
                </p>
                <p className="text-lg leading-relaxed">
                  Për pyetje urgjente, ju lutemi na telefononi gjatë orarit të
                  punës.
                </p>
              </div>

              {/* Accent line */}
              <div className="mt-12 flex items-center gap-6">
                <div className="w-12 h-px bg-white/20" />
                <span
                  className="text-sm text-white/40 tracking-wider"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Përgjigje e shpejtë e garantuar
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
                    Emri dhe Mbiemri
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="Emri dhe mbiemri juaj"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="email@juaj.com"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label
                    className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Numër telefoni
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
                    Mesazh
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 backdrop-blur-sm resize-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    placeholder="Shkruani mesazhin tuaj..."
                  />
                </div>

                {/* Car Name Field (hidden but included in message) */}
                {formData.carName && (
                  <div>
                    <label
                      className="block text-xs uppercase tracking-[0.2em] text-white/50 mb-3"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Për automjetin që jeni interesuar
                    </label>
                    <div className="w-full px-6 py-4 bg-white/5 border border-white/10 text-white/70 rounded flex items-center justify-between">
                      <span>{formData.carName}</span>
                      <span className="text-xs text-white/50">E plotësuar</span>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    className="group relative w-full inline-flex items-center justify-center gap-3 px-8 py-4 border border-white/20 rounded-full backdrop-blur-sm bg-black/30 text-white font-medium tracking-widest uppercase text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    disabled={isSubmitting || submitted}
                  >
                    {isSubmitting ? (
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
                        Po dërgohet...
                      </>
                    ) : submitted ? (
                      <>
                        <svg
                          className="w-4 h-4 text-green-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                        </svg>
                        Dërguar!
                      </>
                    ) : (
                      <>
                        Dërgo mesazh
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

                {/* Error Message */}
                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded">
                    {submitError}
                  </div>
                )}

                {/* Success Message */}
                {submitted && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm text-center rounded">
                    Faleminderit që na kontaktuat! Do t'ju kontaktojmë së
                    shpejti.
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
                title: "Vizita në showroom",
                description:
                  "Përjetoni koleksionin tonë personalisht. Rezervoni një takim për vizitë në showroom.",
              },
              {
                title: "Provë drejtimi",
                description:
                  "Rezervoni një provë drejtimi me një nga automjetet tona sot.",
              },
              {
                title: "Këshillim",
                description:
                  "Keni nevojë për këshilla ekspertësh? Ekipi ynë është gati t'ju ndihmojë të gjeni automjetin ideal.",
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
              Vendndodhja
            </span>
            <h2
              className="text-4xl sm:text-5xl font-bold mt-4"
              style={{ fontFamily: "Cera Pro, sans-serif" }}
            >
              Na vizitoni në Gjilan<span className="text-white/30">.</span>
            </h2>
          </div>

          {/* Google Maps Embed */}
          <div className="relative h-96 lg:h-125 border border-white/10 overflow-hidden rounded-lg group">
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
              <span className="font-semibold text-white">Adresa:</span> Auto
              Tafa, Livoç i Poshtëm 60000
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
