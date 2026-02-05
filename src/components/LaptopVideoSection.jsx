import { useState, useEffect, useRef } from "react";
import macbookImg from "../assets/images/macbook.png";

export default function LaptopVideoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 lg:py-20 bg-black text-white overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-b from-black via-black/95 to-[#1a1a1a]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-6 lg:mb-10">
          <h2
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ fontFamily: "Cera Pro, sans-serif" }}
          >
            Kush jemi ne?
          </h2>
          <div
            className={`w-16 h-1 bg-white mx-auto mb-6 transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
            style={{ transformOrigin: "center" }}
          />
          <p
            className={`text-gray-300 text-lg lg:text-xl max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Njihuni me historinë dhe vizionin tonë.
          </p>
        </div>

        {/* Laptop Container */}
        <div
          className={`relative flex items-center justify-center transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Video positioned behind the MacBook screen */}
          <div className="relative w-full max-w-4xl mx-auto">
            {/* MacBook frame - pointer-events-none so video is clickable */}
            <div className="relative z-20 pointer-events-none">
              <img
                src={macbookImg}
                alt="MacBook"
                className="w-full h-auto select-none"
                draggable="false"
              />
            </div>

            {/* YouTube video iframe positioned to fit the screen area */}
            <div
              className="absolute z-10"
              style={{
                /* Position the video to align with the MacBook screen */
                top: "10.5%",
                left: "9.5%",
                width: "81%",
                height: "80%",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/hA-dBSNfZE0?rel=0&modestbranding=1"
                title="Kush jemi ne - TAFA"
                className="w-full h-full"
                style={{
                  border: "none",
                  borderRadius: "8px",
                }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-white/2 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-white/2 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      </div>
    </section>
  );
}
