"use client";
import { Header } from "@/components/Header";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

interface MediaItem {
    id: string;
    media_url: string;
    caption?: string;
    timestamp: string;
}

const Carousel = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingImages, setLoadingImages] = useState(true); // Track image loading
  const [error, setError] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cardRefs, setCardRefs] = useState<Record<number, React.RefObject<HTMLDivElement | null>>>({});
  const [showBrowserBanner, setShowBrowserBanner] = useState(true);

  // Fetch Instagram media when the component mounts
  useEffect(() => {
    const fetchInstagramMedia = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/instagramMedia");
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "Failed to fetch Instagram media.");
        }

        setMedia(data.data || []);
        setTimeout(() => setLoading(false), 500); // Small delay for smoother transition
      } catch (err) {
        console.error("Error fetching Instagram media:", err);
        setError("Failed to load Instagram media. Please try again later.");
        setLoading(false);
      }
    };

    fetchInstagramMedia();
  }, []);

  // Preload images - Fixed constructor conflict
  useEffect(() => {
    if (media.length > 0 && !loading) {
      setLoadingImages(true);
      let loadedCount = 0;
      const totalImages = Math.min(media.length, 5); // Preload first 5 images
      let validImagesCount = 0;

      media.slice(0, 5).forEach((item) => {
        // Check if item and media_url exist before creating an image
        if (item && item.media_url) {
          validImagesCount++;
          // Use window.Image explicitly to avoid conflict with Next.js Image component
          const imgElement = new window.Image();
          imgElement.src = item.media_url;
          imgElement.onload = () => {
            loadedCount++;
            if (loadedCount === validImagesCount) {
              setLoadingImages(false);
            }
          };
          imgElement.onerror = () => {
            loadedCount++;
            if (loadedCount === validImagesCount) {
              setLoadingImages(false);
            }
          };
        }
      });

      // If there are no valid images to preload, don't keep showing the loading state
      if (validImagesCount === 0) {
        setLoadingImages(false);
      }
    }
  }, [media, loading]);

  useEffect(() => {
    if (media.length > 0) {
      const refs: Record<number, React.RefObject<HTMLDivElement | null>> = {};
      media.forEach((_, index) => {
        refs[index] = React.createRef<HTMLDivElement>();
      });
      setCardRefs(refs);
    }
  }, [media]);

  useEffect(() => {
    const bannerDismissed = localStorage.getItem('carousel-banner-dismissed');
    if (bannerDismissed) {
      setShowBrowserBanner(false);
    }
  }, []);

  const nextIndex = (currentCard + 1) % media.length;
  const prevIndex = (currentCard - 1 + media.length) % media.length;

  // Handle navigation with smooth transition
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isTransitioning || media.length === 0) return;

      setIsTransitioning(true);
      const nextCard = direction === "next" ? nextIndex : prevIndex;

      // Get the actual DOM elements using refs
      const currentElement = cardRefs[currentCard]?.current;
      const nextElement = cardRefs[nextCard]?.current;

      // If elements aren't available yet, skip animation
      if (!currentElement || !nextElement) {
        setCurrentCard(nextCard);
        setIsTransitioning(false);
        return;
      }

      // Synchronized transform/opacity transition via the Web Animations API.
      const ease = "cubic-bezier(0.65, 0, 0.35, 1)";
      const outX = direction === "next" ? -250 : 250;
      const inX = direction === "next" ? 250 : -250;

      nextElement.style.visibility = "visible";

      currentElement.animate(
        [
          { transform: "translateX(0px) scale(1)", opacity: 1 },
          { transform: `translateX(${outX}px) scale(0.9)`, opacity: 0.7 },
        ],
        { duration: 600, easing: ease, fill: "forwards" }
      );

      const inAnim = nextElement.animate(
        [
          { transform: `translateX(${inX}px) scale(0.9)`, opacity: 0.7 },
          { transform: "translateX(0px) scale(1.1)", opacity: 1 },
        ],
        { duration: 600, easing: ease, fill: "forwards" }
      );

      inAnim.onfinish = () => {
        setCurrentCard(nextCard);
        setIsTransitioning(false);
      };
    },
    [currentCard, nextIndex, prevIndex, isTransitioning, cardRefs, media.length]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") navigate("prev");
      if (e.key === "ArrowRight") navigate("next");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  // Touch/swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => navigate("next"),
    onSwipedRight: () => navigate("prev"),
    trackMouse: true,
  });

  // Handle mouse hover for 3D rotation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const centerPosition = {
      x: box.left + box.width / 2,
      y: box.top + box.height / 2,
    };
    const angleX = (e.pageX - centerPosition.x) / 10;
    const angleY = (e.pageY - centerPosition.y) / 10;
    card.style.transition = "transform 0.1s ease-out";
    card.style.transform = `perspective(1000px) rotateY(${angleX}deg) rotateX(${-angleY}deg)`;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transition = "transform 0.5s ease-out";
    card.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg)";
  };

  const dismissBanner = () => {
    localStorage.setItem('carousel-banner-dismissed', 'true');
    setShowBrowserBanner(false);
  };

  const tryAgain = async () => {
    setError(null);
    const fetchInstagramMedia = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/instagramMedia");
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error.message || "Failed to fetch Instagram media.");
        }

        setMedia(data.data || []);
        setTimeout(() => setLoading(false), 500);
      } catch (err) {
        console.error("Error fetching Instagram media:", err);
        setError("Failed to load Instagram media. Please try again later.");
        setLoading(false);
      }
    };

    fetchInstagramMedia();
  };

  // Loading skeleton
  if (loading || loadingImages) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center">
        <Header />
        <div className="flex flex-col items-center justify-center space-y-8 mt-16">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="text-zinc-300 text-lg">Loading your Instagram moments...</p>
          <div className="flex space-x-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-32 h-48 bg-zinc-700 rounded-lg"></div>
                <div className="mt-2 h-4 bg-zinc-700 rounded w-24 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center">
        <Header />
        <div className="bg-red-900/20 border border-red-500/30 p-6 rounded-lg max-w-md mx-auto mt-16 text-center">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={tryAgain}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No media found
  if (media.length === 0) {
    return (
      <div className="relative min-h-[100dvh] w-full bg-gradient-to-b from-zinc-900 to-zinc-800 flex flex-col items-center justify-center">
        <Header />
        <div className="bg-zinc-800/50 p-6 rounded-lg max-w-md mx-auto mt-16 text-center border border-zinc-700">
          <svg
            className="w-16 h-16 text-zinc-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            ></path>
          </svg>
          <p className="text-zinc-300 mb-4">No Instagram posts found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden bg-black" {...swipeHandlers}>
      <Header />

      {/* Browser Compatibility Banner */}
      {showBrowserBanner && (
        <div className="absolute top-16 left-0 right-0 z-50 flex justify-between items-center px-4 py-2 bg-amber-600/90 text-white backdrop-blur-sm">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">
              This carousel works best in Chrome in Desktop. Safari and mobile may display animations incorrectly.
            </span>
          </div>
          <button 
            onClick={dismissBanner} 
            className="ml-4 p-1 hover:bg-amber-700/50 rounded-full transition-colors"
            aria-label="Dismiss browser compatibility notice"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* API Description */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 text-center p-4 bg-black/50 backdrop-blur-md rounded-lg max-w-[90%] md:max-w-[70%] mt-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-100">
          My Instagram Posts
        </h1>
        <p className="text-sm md:text-lg text-gray-300 mt-2">
          A personalized showcase of my favorite Instagram posts, powered by the Instagram API.
        </p>
        <div className="flex items-center justify-center mt-4 space-x-2 text-sm">
          <span className="text-gray-400">
            #{currentCard + 1} of {media.length}
          </span>
          <span className="px-2 py-1 bg-green-600/20 text-green-400 rounded-full text-xs">
            {new Date(media[currentCard]?.timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Background with animated transition */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center blur-sm transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url(${media[currentCard]?.media_url})`,
          opacity: 0.5,
        }}
      ></div>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-[1] opacity-70"></div>

      {/* Carousel Wrapper */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        {/* Cards */}
        <div className="relative flex items-center justify-center h-[400px] w-[800px] perspective">
          {media.map((item, index) => {
            const isActive = index === currentCard;
            const isPrev = index === prevIndex;
            const isNext = index === nextIndex;

            // We'll render more cards but with different visibility
            const shouldRender =
              isActive ||
              isPrev ||
              isNext ||
              index === (currentCard + 2) % media.length ||
              index === (currentCard - 2 + media.length) % media.length;

            if (!shouldRender) return null;

            return (
              <div
                key={item.id}
                ref={cardRefs[index]}
                className={`absolute w-[280px] h-[400px] transition-all ${
                  isActive
                    ? "z-30 scale-110 opacity-100 visible"
                    : isPrev || isNext
                    ? "z-20 scale-90 opacity-70 visible"
                    : "opacity-0 invisible z-10"
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  boxShadow: isActive
                    ? "0 20px 25px -5px rgba(0,0,0,0.3)"
                    : "none",
                  // Pre-position non-active cards for smoother first animation
                  transform: `scale(${isActive ? 1.1 : 0.9}) 
                         translateX(${
                           isPrev ? -300 : isNext ? 300 : 0
                         }px)`,
                }}
                onMouseMove={isActive ? handleMouseMove : undefined}
                onMouseLeave={isActive ? handleMouseLeave : undefined}
              >
                <div
                  className={`w-full h-full rounded-2xl overflow-hidden ${
                    isActive ? "ring-4 ring-white/30" : ""
                  }`}
                >
                  <Image
                    src={item.media_url}
                    alt={item.caption || "Instagram post"}
                    className="w-full h-full object-cover"
                    width={280}
                    height={400}
                    unoptimized
                    priority={isActive}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Caption */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 w-[80%] max-w-2xl text-center z-30">
          <div className="bg-black/70 backdrop-blur-md p-4 rounded-xl text-sm md:text-base text-gray-100 max-h-[100px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500">
            {media[currentCard]?.caption
              ? media[currentCard].caption.length > 150
                ? `${media[currentCard].caption.substring(0, 150)}...`
                : media[currentCard].caption
              : "No caption available"}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={() => navigate("prev")}
          disabled={isTransitioning}
          className="absolute top-1/2 left-5 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full shadow-lg z-20 backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Previous image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={() => navigate("next")}
          disabled={isTransitioning}
          className="absolute top-1/2 right-5 -translate-y-1/2 p-4 bg-black/50 hover:bg-black/70 text-white rounded-full shadow-lg z-20 backdrop-blur-md transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Next image"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
          {media.length > 1 &&
            media.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index > currentCard) navigate("next");
                  else if (index < currentCard) navigate("prev");
                }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentCard
                    ? "bg-white"
                    : "bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
        </div>
      </div>

      {/* Swipe indicator for mobile */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-xs flex items-center space-x-2 md:hidden z-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          />
        </svg>
        <span>Swipe to navigate</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>
    </div>
  );
};

export default Carousel;
