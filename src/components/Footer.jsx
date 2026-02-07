import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const currentYear = new Date().getFullYear();

  // Check localStorage on mount to see if user has already made a choice
  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      // Show banner only on first visit
      setTimeout(() => setShowCookieBanner(true), 100);
    }
  }, []);

  const handleCookieConsent = (accepted) => {
    localStorage.setItem("cookieConsent", accepted ? "accepted" : "declined");
    setShowCookieBanner(false);
  };

  const showCookiePreferences = () => {
    setShowCookieBanner(true);
  };

  return (
    <>
      <footer className="relative bg-black border-t border-white/10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-16 lg:py-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-12">
            {/* Brand Section */}
            <div className="col-span-sm:2 lg:col-span-1">
              <h3
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                AUTO TAFA
              </h3>
              <p
                className="text-white/60 mb-8 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Zbuloni koleksionin tonë të automjeteve luksoze, destinacioni
                juaj për shërbim të pakrahasueshëm.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://www.facebook.com/mustaf.leka.9"
                  aria-label="Follow us on Facebook"
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 text-white/80 hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/tafaleka/"
                  aria-label="Follow us on Instagram"
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-300"
                >
                  <svg
                    className="w-5 h-5 text-white/80 hover:text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.266.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4
                className="text-sm uppercase tracking-widest text-white/60 mb-8 font-bold"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Eksploro
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/collection"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Koleksioni ynë
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Rreth Nesh
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4
                className="text-sm uppercase tracking-widest text-white/60 mb-8 font-bold"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Sherbimet
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="/custom-sourcing"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Furnizim sipas kërkesës
                  </a>
                </li>
                <li>
                  <a
                    href="/financing-options"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Opcione Financimi
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4
                className="text-sm uppercase tracking-widest text-white/60 mb-8 font-bold"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Kontakt
              </h4>
              <ul className="space-y-4">
                <li>
                  <a
                    href="tel:+38344666662"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    +38344666662
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:hello@tafaleka.com"
                    className="text-white/80 hover:text-white transition-colors duration-300"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    info@tafaleka.com
                  </a>
                </li>
                <li>
                  <p
                    className="text-white/80"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    CFM4+W38, Livoç i Poshtëm 60000
                    <br />
                    Gjilan, Kosovë
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <p
                className="text-white/70 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                &copy; {currentYear} AUTO TAFA. Të gjitha të drejtat e
                rezervuara.
              </p>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <p
                className="text-white/70 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Designed & developed by{" "}
                <a
                  href="https://arthalimi.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-white/80 transition-colors duration-300 font-medium"
                >
                  Art Halimi
                </a>
              </p>
            </div>

            <div className="flex flex-wrap gap-8">
              <button
                onClick={() => setActiveModal("privacy")}
                className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModal("terms")}
                className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Terms of Service
              </button>
              <button
                onClick={showCookiePreferences}
                className="text-white/70 hover:text-white transition-colors duration-300 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Cookies
              </button>
              <Link
                to="/dashboard"
                className="text-white/20 hover:text-white/40 transition-colors duration-300 text-sm"
                style={{ fontFamily: "Montserrat, sans-serif" }}
                title="Admin"
              >
                •
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-24 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex-1">
              <h3
                className="text-sm font-bold text-white mb-2"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                Përdorimi i Cookies
              </h3>
              <p
                className="text-sm text-white/60 leading-relaxed"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Ne përdorim cookies për të përmirësuar përvojën tuaj të
                shfletimit dhe për të analizuar trafikun në faqe. Duke klikuar
                "Prano", ju pranoni përdorimin tonë të cookies. Ju mund të
                menaxhoni preferencat tuaja në çdo kohë.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleCookieConsent(false)}
                className="px-6 py-2 text-sm font-medium text-white/80 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-300 rounded"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Refuzo
              </button>
              <button
                onClick={() => handleCookieConsent(true)}
                className="px-6 py-2 text-sm font-medium text-black bg-white hover:bg-white/90 transition-all duration-300 rounded"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Prano
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {activeModal === "privacy" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/10 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex justify-between items-center">
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                Privacy Policy
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="p-8 text-white/80 space-y-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  1. Information We Collect
                </h3>
                <p>
                  AUTO TAFA collects information you provide directly to us,
                  such as when you contact us, request information about a
                  vehicle, or submit a form on our website. This may include
                  your name, email address, phone number, and vehicle
                  preferences.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  2. How We Use Your Information
                </h3>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>
                    Respond to your inquiries and provide customer service
                  </li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Protect against fraud and maintain security</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  3. Data Protection
                </h3>
                <p>
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the Internet is entirely secure.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  4. Cookies and Tracking
                </h3>
                <p>
                  Our website uses cookies to enhance your browsing experience.
                  You can control cookie settings through your browser
                  preferences. Some cookies are essential for website
                  functionality.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  5. Third-Party Services
                </h3>
                <p>
                  We may share your information with trusted third parties who
                  assist us in operating our website and conducting our
                  business, such as payment processors and email service
                  providers.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  6. Your Rights
                </h3>
                <p>
                  You have the right to access, correct, or delete your personal
                  information. To exercise these rights, please contact us at
                  privacy@tafaleka.com.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  7. Contact Us
                </h3>
                <p>
                  If you have questions about this Privacy Policy, please
                  contact us at hello@tafaleka.com or call +1 (234) 567-890.
                </p>
              </section>

              <section>
                <p className="text-white/60 text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* Terms of Service Modal */}
      {activeModal === "terms" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/10 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex justify-between items-center">
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: "Cera Pro, sans-serif" }}
              >
                Terms of Service
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div
              className="p-8 text-white/80 space-y-6"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  1. Agreement to Terms
                </h3>
                <p>
                  By accessing and using this website, you accept and agree to
                  be bound by the terms and provision of this agreement. If you
                  do not agree to abide by the above, please do not use this
                  service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  2. Use License
                </h3>
                <p>
                  Permission is granted to temporarily download one copy of the
                  materials (information or software) on AUTO TAFA's website for
                  personal, non-commercial transitory viewing only. This is the
                  grant of a license, not a transfer of title, and under this
                  license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>Modify or copy the materials</li>
                  <li>
                    Use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    Attempt to reverse engineer, disassemble, or decompile
                  </li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>
                    Transfer the materials to another person or "mirror" the
                    materials
                  </li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  3. Disclaimer
                </h3>
                <p>
                  The materials on AUTO TAFA's website are provided on an 'as
                  is' basis. AUTO TAFA makes no warranties, expressed or
                  implied, and hereby disclaims and negates all other warranties
                  including, without limitation, implied warranties or
                  conditions of merchantability, fitness for a particular
                  purpose, or non-infringement of intellectual property or other
                  violation of rights.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  4. Limitations
                </h3>
                <p>
                  In no event shall AUTO TAFA or its suppliers be liable for any
                  damages (including, without limitation, damages for loss of
                  data or profit, or due to business interruption) arising out
                  of the use or inability to use the materials on the website.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  5. Accuracy of Materials
                </h3>
                <p>
                  The materials appearing on AUTO TAFA's website could include
                  technical, typographical, or photographic errors. AUTO TAFA
                  does not warrant that any of the materials on the website are
                  accurate, complete, or current. AUTO TAFA may make changes to
                  the materials on the website at any time without notice.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">6. Links</h3>
                <p>
                  AUTO TAFA has not reviewed all of the sites linked to its
                  website and is not responsible for the contents of any such
                  linked site. The inclusion of any link does not imply
                  endorsement by AUTO TAFA of the site. Use of any such linked
                  website is at the user's own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  7. Modifications
                </h3>
                <p>
                  AUTO TAFA may revise these terms of service for the website at
                  any time without notice. By using this website, you are
                  agreeing to be bound by the then current version of these
                  terms of service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">
                  8. Governing Law
                </h3>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws of the jurisdiction in which AUTO
                  TAFA operates, and you irrevocably submit to the exclusive
                  jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <p className="text-white/60 text-sm">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
