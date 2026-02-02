import { useState, useEffect, useRef } from "react";

/**
 * Lazy loaded image component with blur-up effect
 */
export function LazyImage({
  src,
  alt,
  className = "",
  placeholderColor = "bg-white/5",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Placeholder */}
      <div
        className={`absolute inset-0 ${placeholderColor} transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      )}
    </div>
  );
}

/**
 * Lazy image for object-contain (like car images)
 */
export function LazyImageContain({
  src,
  alt,
  className = "",
  placeholderColor = "bg-white/5",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      {/* Placeholder */}
      <div
        className={`absolute inset-0 ${placeholderColor} transition-opacity duration-500 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* Actual Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-contain transition-all duration-700 ${
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        />
      )}
    </div>
  );
}
