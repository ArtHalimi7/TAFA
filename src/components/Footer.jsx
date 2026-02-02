import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Footer() {
  const [activeModal, setActiveModal] = useState(null)

  const currentYear = new Date().getFullYear()

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
                style={{ fontFamily: 'Cera Pro, sans-serif' }}
              >
                AUTO TAFA
              </h3>
              <p 
                className="text-white/60 mb-8 leading-relaxed"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Curating the world's finest automobiles for discerning collectors and enthusiasts.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/60 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/60 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-white/50 hover:bg-white/5 transition-all duration-300">
                  <svg className="w-5 h-5 text-white/60 hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 11.37A4 4 0 1112.63 8" fill="none" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 
                className="text-sm uppercase tracking-widest text-white/40 mb-8 font-bold"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Explore
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link to="/collection" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Our Collection
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 
                className="text-sm uppercase tracking-widest text-white/40 mb-8 font-bold"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Services
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Custom Sourcing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Financing Options
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Delivery Services
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Maintenance
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 
                className="text-sm uppercase tracking-widest text-white/40 mb-8 font-bold"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Contact
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+1234567890" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    +1 (234) 567-890
                  </a>
                </li>
                <li>
                  <a href="mailto:hello@autotafa.com" className="text-white/70 hover:text-white transition-colors duration-300" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    hello@autotafa.com
                  </a>
                </li>
                <li>
                  <p className="text-white/70" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    123 Luxury Ave<br />
                    New York, NY 10001
                  </p>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <p 
                className="text-white/50 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                &copy; {currentYear} AUTO TAFA. All rights reserved.
              </p>
              <div className="hidden sm:block w-px h-4 bg-white/20" />
              <p 
                className="text-white/50 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Designed & developed by{' '}
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
                onClick={() => setActiveModal('privacy')}
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModal('terms')}
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Terms of Service
              </button>
              <a 
                href="#"
                className="text-white/60 hover:text-white transition-colors duration-300 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Cookies
              </a>
              <Link 
                to="/dashboard"
                className="text-white/20 hover:text-white/40 transition-colors duration-300 text-sm"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                title="Admin"
              >
                •
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/10 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cera Pro, sans-serif' }}>
                Privacy Policy
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 text-white/80 space-y-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <section>
                <h3 className="text-lg font-bold text-white mb-4">1. Information We Collect</h3>
                <p>
                  AUTO TAFA collects information you provide directly to us, such as when you contact us, request information about a vehicle, or submit a form on our website. This may include your name, email address, phone number, and vehicle preferences.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">2. How We Use Your Information</h3>
                <p>
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>Respond to your inquiries and provide customer service</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Protect against fraud and maintain security</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">3. Data Protection</h3>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is entirely secure.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">4. Cookies and Tracking</h3>
                <p>
                  Our website uses cookies to enhance your browsing experience. You can control cookie settings through your browser preferences. Some cookies are essential for website functionality.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">5. Third-Party Services</h3>
                <p>
                  We may share your information with trusted third parties who assist us in operating our website and conducting our business, such as payment processors and email service providers.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">6. Your Rights</h3>
                <p>
                  You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at privacy@autotafa.com.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">7. Contact Us</h3>
                <p>
                  If you have questions about this Privacy Policy, please contact us at hello@autotafa.com or call +1 (234) 567-890.
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
      {activeModal === 'terms' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-black border border-white/10 rounded-lg max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-black border-b border-white/10 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Cera Pro, sans-serif' }}>
                Terms of Service
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8 text-white/80 space-y-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              <section>
                <h3 className="text-lg font-bold text-white mb-4">1. Agreement to Terms</h3>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">2. Use License</h3>
                <p>
                  Permission is granted to temporarily download one copy of the materials (information or software) on AUTO TAFA's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer, disassemble, or decompile</li>
                  <li>Remove any copyright or proprietary notations</li>
                  <li>Transfer the materials to another person or "mirror" the materials</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">3. Disclaimer</h3>
                <p>
                  The materials on AUTO TAFA's website are provided on an 'as is' basis. AUTO TAFA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">4. Limitations</h3>
                <p>
                  In no event shall AUTO TAFA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the website.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">5. Accuracy of Materials</h3>
                <p>
                  The materials appearing on AUTO TAFA's website could include technical, typographical, or photographic errors. AUTO TAFA does not warrant that any of the materials on the website are accurate, complete, or current. AUTO TAFA may make changes to the materials on the website at any time without notice.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">6. Links</h3>
                <p>
                  AUTO TAFA has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by AUTO TAFA of the site. Use of any such linked website is at the user's own risk.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">7. Modifications</h3>
                <p>
                  AUTO TAFA may revise these terms of service for the website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-bold text-white mb-4">8. Governing Law</h3>
                <p>
                  These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which AUTO TAFA operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
  )
}
