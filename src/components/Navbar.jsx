import React, { useState, useEffect } from 'react'
import logo from '../assets/images/logo.png'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen])

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'collection', label: 'Collection' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ]

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'py-4 bg-black/80 backdrop-blur-md' 
            : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <img src={logo} alt="TAFA LEKA" className="h-10 w-auto" />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  className="text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Hamburger Menu Button - Mobile Only */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Open menu"
            >
              <div className="flex flex-col gap-1.5">
                <span className="w-6 h-px bg-white" />
                <span className="w-6 h-px bg-white" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 right-0 z-50 w-full h-full bg-black transition-transform duration-500 ease-out ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-6">
          <img src={logo} alt="TAFA LEKA" className="h-10 w-auto" />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="w-10 h-10 flex items-center justify-center"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col h-[calc(100%-80px)] px-6">
          {/* Navigation Links */}
          <nav className="flex-1 flex flex-col justify-center">
            <ul className="space-y-6">
              {navLinks.map((link, index) => (
                <li 
                  key={link.id}
                  className={`transition-all duration-500 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                  style={{ transitionDelay: isSidebarOpen ? `${index * 0.05}s` : '0s' }}
                >
                  <a
                    href={`#${link.id}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className="block text-4xl font-display font-light text-white hover:text-neutral-400 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Navbar